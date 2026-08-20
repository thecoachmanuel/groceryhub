import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token } = body;

    if (!token) {
      return NextResponse.json({ status: 401, result: 'false', message: 'Token required' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ status: 401, result: 'false', message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return NextResponse.json({ status: 404, result: 'false', message: 'User not found' }, { status: 404 });
    }

    const u = user as any;

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Profile fetched',
      data: {
        id: String(u._id),
        name: u.name || '',
        email: u.email || '',
        mobile: u.mobile || u.phone || '',
        image: u.image || u.avatar || '',
        wallet_balance: u.wallet_balance || 0,
        referral_code: u.referral_code || '',
        createdAt: u.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, result: 'false', message: error.message }, { status: 500 });
  }
}
