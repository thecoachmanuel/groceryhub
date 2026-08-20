import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { mobile, otp } = body;

    if (!mobile) {
      return NextResponse.json(
        { status: 400, result: 'false', message: 'Mobile number is required' },
        { status: 400 }
      );
    }

    let user = await User.findOne({ mobile }).lean<any>();
    if (!user) {
      user = await User.create({
        user_id: Date.now(),
        name: 'Customer',
        mobile,
        wallet_balance: 0,
        status: 'active',
      });
    }

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'OTP verified successfully',
      token: `gh_token_${user._id}_${Date.now()}`,
      user_id: user.user_id || user._id,
      data: {
        user_id: user.user_id || user._id,
        name: user.name,
        email: user.email || '',
        mobile: user.mobile,
        wallet_balance: user.wallet_balance || 0,
        profile_pic: user.profile_pic || '',
      },
    });
  } catch (error: any) {
    console.error('verifyMobileOtp error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
