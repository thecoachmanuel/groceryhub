import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { user_id, token } = body;

    // Support lookup by user_id (mobile app style) or token
    let user: any = null;
    if (user_id) {
      user = await User.findOne({ user_id: Number(user_id) }).lean();
    } else if (token) {
      // Try to find by token if stored, otherwise fall back to first user
      user = await User.findOne({ auth_token: token }).lean();
    }

    if (!user) {
      return NextResponse.json(
        { status: 404, result: 'false', message: 'User not found' },
        { status: 404 }
      );
    }

    const u = user as any;

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Profile fetched successfully',
      data: {
        id: String(u._id),
        user_id: u.user_id || String(u._id),
        name: u.name || '',
        email: u.email || '',
        mobile: u.mobile || u.phone || '',
        profile_pic: u.profile_pic || u.image || u.avatar || '',
        wallet_balance: u.wallet_balance || 0,
        referral_code: u.referral_code || '',
        createdAt: u.createdAt,
      },
    });
  } catch (error: any) {
    console.error('fetchProfileDetails error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error.message },
      { status: 500 }
    );
  }
}
