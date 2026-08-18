import { NextRequest } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, mobile, password, referral_code } = body;

    if (!name || !mobile || !password) {
      return apiError('Full name, mobile phone number, and password are required to register', 400);
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanMobile = mobile.trim();

    await connectToDatabase();

    // Check duplicate mobile
    const existingMobile = await User.findOne({ mobile: cleanMobile });
    if (existingMobile) {
      return apiError('An account with this mobile number already exists. Please log in.', 409);
    }

    // Check duplicate email if provided
    if (cleanEmail) {
      const existingEmail = await User.findOne({ email: cleanEmail });
      if (existingEmail) {
        return apiError('An account with this email address already exists. Please log in.', 409);
      }
    }

    const hashedPassword = await hashPassword(password);
    const userId = Date.now();
    const myReferralCode = `GH${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = await User.create({
      user_id: userId,
      name: name.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      password: hashedPassword,
      wallet_balance: referral_code ? 2000.00 : 0.00, // ₦2,000 welcome bonus if referral code used
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

    return apiSuccess(
      {
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
      'Account created successfully! Welcome to GroceryHub.'
    );
  } catch (error: any) {
    console.error('Customer registration error:', error);
    return apiError(error?.message || 'Registration failed', 500);
  }
}
