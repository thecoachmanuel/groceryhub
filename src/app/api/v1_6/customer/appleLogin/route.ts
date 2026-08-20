import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { email, name, apple_id, uid } = body;

    let user = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(apple_id || uid ? [{ apple_id: apple_id || uid }] : []),
      ],
    }).lean<any>();

    if (!user) {
      user = await User.create({
        user_id: Date.now(),
        name: name || 'Apple User',
        email: email?.toLowerCase() || '',
        apple_id: apple_id || uid || '',
        wallet_balance: 0,
        status: 'active',
      });
    }

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Apple login successful',
      token: `gh_token_${user._id}_${Date.now()}`,
      user_id: user.user_id || user._id,
      data: {
        user_id: user.user_id || user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || '',
        wallet_balance: user.wallet_balance || 0,
        profile_pic: user.profile_pic || '',
      },
    });
  } catch (error: any) {
    console.error('appleLogin error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
