import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

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

    const query: any = {};
    if (email) query.email = email.toLowerCase();
    if (mobile) query.mobile = mobile;

    // Find user in MongoDB Atlas
    let user = await User.findOne(query).select('+password').lean<any>();

    if (!user) {
      return NextResponse.json(
        { status: 'error', code: 401, result: 'false', message: 'User not found. Please sign up for an account.' },
        { status: 401 }
      );
    }

    // Verify hashed password if user has password set
    if (password && user.password) {
      const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
      if (!isMatch) {
        return NextResponse.json(
          { status: 'error', code: 401, result: 'false', message: 'Invalid password. Please check your credentials.' },
          { status: 401 }
        );
      }
    }

    const userId = user.user_id || user._id;

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Login successful',
      token: `gh_token_${userId}_${Date.now()}`,
      user_id: userId,
      data: {
        user_id: userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        wallet_balance: user.wallet_balance || 0,
        profile_pic: user.profile_pic || '',
        referral_code: user.referral_code || '',
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { status: 'error', code: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
