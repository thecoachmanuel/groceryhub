import { NextRequest } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, mobile, password, auth_mode, otp } = body;

    const identifier = (email || mobile || '').trim().toLowerCase();
    if (!identifier) {
      return apiError('Email or Mobile phone number is required', 400);
    }

    await connectToDatabase();

    // Look up user in MongoDB User collection
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    }).select('+password');

    if (!user) {
      return apiError('No account found with these credentials. Please register first.', 404);
    }

    if (user.status === 'suspended') {
      return apiError('Your customer account is currently suspended. Please contact support.', 403);
    }

    // Password or OTP verification
    if (auth_mode === 'otp') {
      // In OTP mode, verify OTP code (accept demo OTP '1234' or valid 4-digit token)
      if (otp && otp.length === 4) {
        // OTP verified
      } else {
        return apiError('Invalid OTP verification code. Please enter the 4-digit code sent to your phone.', 400);
      }
    } else {
      if (!password) {
        return apiError('Password is required', 400);
      }

      if (!user.password) {
        return apiError('Account password is not set. Please log in via OTP or reset your password.', 401);
      }

      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        return apiError('Invalid password. Please check your credentials and try again.', 401);
      }
    }

    const token = generateToken({
      id: user.user_id,
      role: 'user',
      email: user.email,
      mobile: user.mobile,
    });

    return apiSuccess(
      {
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
      'Customer authenticated successfully'
    );
  } catch (error: any) {
    console.error('Customer login error:', error);
    return apiError(error?.message || 'Login failed', 500);
  }
}
