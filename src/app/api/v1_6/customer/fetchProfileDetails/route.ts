import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { getUserIdFromHeader, getUserFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    const authHeader = req.headers.get('authorization');
    const tokenUser = getUserFromHeader(authHeader);
    const tokenUserId = tokenUser?.user_id;

    // Priority: token user_id > body user_id > body email/mobile
    const userId = tokenUserId || body.user_id;
    const { email, mobile } = body;

    let user: any = null;

    if (userId) {
      const numId = Number(userId);
      if (!isNaN(numId) && numId > 0) {
        user = await User.findOne({ user_id: numId }).lean();
      }
    }

    if (!user && (email || mobile)) {
      user = await User.findOne({
        $or: [
          ...(email ? [{ email: String(email).toLowerCase() }] : []),
          ...(mobile ? [{ mobile: String(mobile) }] : []),
        ],
      }).lean();
    }

    if (!user) {
      return NextResponse.json({
        status: 'error',
        code: 401,
        result: 'false',
        message: 'User not found. Please log in again.',
      }, { status: 401 });
    }

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Profile fetched successfully',
      data: {
        id: String(user._id),
        user_id: user.user_id || String(user._id),
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || user.phone || '',
        profile_pic: user.profile_pic || user.image || '',
        wallet_balance: user.wallet_balance ?? 0,
        referral_code: user.referral_code || '',
        createdAt: user.createdAt || new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('fetchProfileDetails error:', error);
    return NextResponse.json({
      status: 'error',
      code: 500,
      result: 'false',
      message: 'Server error',
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
