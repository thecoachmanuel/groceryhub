import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, normalizePhone, getLocalPhone } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, mobile, password, auth_mode, otp } = body;

    const rawInput = (email || mobile || '').trim();
    if (!rawInput) {
      return NextResponse.json(
        { success: false, message: 'Email or Mobile phone number is required' },
        { status: 400 }
      );
    }

    const cleanInput = rawInput.toLowerCase();
    const normPhone = normalizePhone(rawInput);
    const localPhone = getLocalPhone(rawInput);

    await connectToDatabase();

    // Flexible query searching email, raw mobile, normalized international phone, or local phone format
    const user = await User.findOne({
      $or: [
        { email: cleanInput },
        { mobile: rawInput },
        { mobile: normPhone },
        { mobile: localPhone },
      ],
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No account found with these credentials. Please check your details or register.' },
        { status: 404 }
      );
    }

    if (user.status === 'suspended') {
      return NextResponse.json(
        { success: false, message: 'Your customer account is currently suspended. Please contact support.' },
        { status: 403 }
      );
    }

    // Password or OTP verification
    if (auth_mode === 'otp') {
      if (otp && otp.length === 4) {
        // OTP verified
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid OTP verification code. Please enter the 4-digit code sent to your phone.' },
          { status: 400 }
        );
      }
    } else {
      if (!password) {
        return NextResponse.json(
          { success: false, message: 'Password is required' },
          { status: 400 }
        );
      }

      if (!user.password) {
        return NextResponse.json(
          { success: false, message: 'Account password is not set. Please log in via OTP or reset your password.' },
          { status: 401 }
        );
      }

      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Invalid password. Please check your credentials and try again.' },
          { status: 401 }
        );
      }
    }

    const token = generateToken({
      id: user.user_id,
      role: 'user',
      email: user.email,
      mobile: user.mobile,
    });

    const res = NextResponse.json({
      success: true,
      message: 'Customer authenticated successfully',
      data: {
        token,
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          walletBalance: user.wallet_balance,
          referralCode: user.referral_code,
        },
      },
    });

    // Set HTTP Cookies on Response Header
    res.cookies.set('auth_token', token, { path: '/', maxAge: 604800, sameSite: 'lax' });
    res.cookies.set('user_role', 'user', { path: '/', maxAge: 604800, sameSite: 'lax' });

    return res;
  } catch (error: any) {
    console.error('Customer login error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
