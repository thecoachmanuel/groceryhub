import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { email, mobile, password } = body;

    const identifier = email || mobile;
    if (!identifier) {
      return NextResponse.json(
        { status: 'error', code: 400, result: 'false', message: 'Email or mobile is required' },
        { status: 400 }
      );
    }

    // Look up ONLY existing users — no auto-registration
    const user = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase().trim() }] : []),
        ...(mobile ? [{ mobile: mobile.trim() }] : []),
      ],
    }).select('+password').lean<any>();

    if (!user) {
      return NextResponse.json(
        { status: 'error', code: 401, result: 'false', message: 'No account found with these credentials. Please register first.' },
        { status: 401 }
      );
    }

    // Password check — if user has a password, validate it
    if (password && user.password) {
      const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
      if (!isMatch) {
        return NextResponse.json(
          { status: 'error', code: 401, result: 'false', message: 'Incorrect password. Please try again.' },
          { status: 401 }
        );
      }
    }

    // Check account status
    if (user.status === 'suspended') {
      return NextResponse.json(
        { status: 'error', code: 403, result: 'false', message: 'Your account has been suspended. Contact support.' },
        { status: 403 }
      );
    }

    const userId = user.user_id || Number(String(user._id).slice(-6));
    const userName = user.name || 'Customer';
    const userEmail = user.email || '';
    const userMobile = user.mobile || '';

    // Issue a proper token with all user info embedded
    const token = signToken({
      user_id: userId,
      name: userName,
      email: userEmail,
      mobile: userMobile,
    });

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Login successful',
      token,
      user_id: userId,
      data: {
        user_id: userId,
        name: userName,
        email: userEmail,
        mobile: userMobile,
        wallet_balance: user.wallet_balance ?? 0,
        profile_pic: user.profile_pic || '',
        referral_code: user.referral_code || '',
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { status: 'error', code: 500, result: 'false', message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
