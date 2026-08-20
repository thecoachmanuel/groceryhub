import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { email, mobile, password, otp } = body;

    const identifier = email || mobile;
    if (!identifier) {
      return NextResponse.json(
        { status: 400, result: 'false', message: 'Email or mobile is required' },
        { status: 400 }
      );
    }

    const query: any = {};
    if (email) query.email = email.toLowerCase();
    if (mobile) query.mobile = mobile;

    const user = await User.findOne(query).lean<any>();
    if (!user) {
      return NextResponse.json(
        { status: 401, result: 'false', message: 'Invalid credentials. Please check your email/mobile.' },
        { status: 401 }
      );
    }

    // For password login: verify password if provided
    if (password && user.password) {
      const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
      if (!isMatch) {
        return NextResponse.json(
          { status: 401, result: 'false', message: 'Invalid password.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Login successful',
      token: `gh_token_${user._id}_${Date.now()}`,
      user_id: user.user_id || user._id,
      data: {
        user_id: user.user_id || user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        wallet_balance: user.wallet_balance || 0,
        profile_pic: user.profile_pic || '',
        referral_code: user.referral_code || '',
      },
    });
  } catch (error: any) {
    console.error('login error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
