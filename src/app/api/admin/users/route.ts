import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query');

    let filter: any = {};
    if (query) {
      filter = {
        $or: [
          { name: new RegExp(query, 'i') },
          { email: new RegExp(query, 'i') },
          { mobile: new RegExp(query, 'i') },
        ],
      };
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .select('-password -otp -otp_expires')
      .lean();

    return NextResponse.json({ success: true, data: users, count: users.length });
  } catch (err: any) {
    console.error('GET /api/admin/users error:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { userId, status, walletBalance } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.is_active = status === 'Active';
    if (walletBalance !== undefined) updateData.wallet_balance = walletBalance;

    const updated = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true })
      .select('-password -otp');

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error('PUT /api/admin/users error:', err);
    return NextResponse.json({ success: false, message: 'Failed to update user' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { userId, action, amount } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
    }

    if (action === 'fund_wallet') {
      const numAmount = Number(amount) || 0;
      const updated = await User.findByIdAndUpdate(
        userId,
        { $inc: { wallet_balance: numAmount } },
        { new: true }
      ).select('-password -otp');
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

