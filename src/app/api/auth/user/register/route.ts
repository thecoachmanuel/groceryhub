import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, normalizePhone, getLocalPhone } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, mobile, password, referral_code } = body;

    if (!name || !mobile || !password) {
      return NextResponse.json(
        { success: false, message: 'Full name, mobile phone number, and password are required to register' },
        { status: 400 }
      );
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const rawMobile = mobile.trim();
    const normMobile = normalizePhone(rawMobile);
    const localMobile = getLocalPhone(rawMobile);

    await connectToDatabase();

    // Check duplicate mobile
    const existingMobile = await User.findOne({
      $or: [
        { mobile: rawMobile },
        { mobile: normMobile },
        { mobile: localMobile },
      ],
    });
    if (existingMobile) {
      return NextResponse.json(
        { success: false, message: 'An account with this mobile number already exists. Please log in.' },
        { status: 409 }
      );
    }

    // Check duplicate email if provided
    if (cleanEmail) {
      const existingEmail = await User.findOne({ email: cleanEmail });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: 'An account with this email address already exists. Please log in.' },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);
    const userId = Date.now();
    const myReferralCode = `GH${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = await User.create({
      user_id: userId,
      name: name.trim(),
      email: cleanEmail,
      mobile: normMobile || rawMobile,
      password: hashedPassword,
      wallet_balance: referral_code ? 2000.00 : 0.00,
      referral_code: myReferralCode,
      referred_by: referral_code || '',
      status: 'active',
    });

    const token = generateToken({
      id: newUser.user_id,
      role: 'user',
      email: newUser.email,
      mobile: newUser.mobile,
    });

    const res = NextResponse.json({
      success: true,
      message: 'Account created successfully! Welcome to GroceryHub.',
      data: {
        token,
        user: {
          id: newUser.user_id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          walletBalance: newUser.wallet_balance,
          referralCode: newUser.referral_code,
        },
      },
    });

    // Set HTTP Cookies on Response Header
    res.cookies.set('auth_token', token, { path: '/', maxAge: 604800, sameSite: 'lax' });
    res.cookies.set('user_role', 'user', { path: '/', maxAge: 604800, sameSite: 'lax' });

    return res;
  } catch (error: any) {
    console.error('Customer registration error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
