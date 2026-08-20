import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import WalletTransaction from '@/models/WalletTransaction';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const userId = Number(body.user_id);

    if (!userId) {
      return NextResponse.json(
        { status: 401, result: 'false', message: 'user_id is required' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ user_id: userId }).lean<any>();
    const transactions = await WalletTransaction.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean<any[]>()
      .catch(() => []);

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Wallet history fetched',
      wallet_balance: user?.wallet_balance || 0,
      data: transactions.map((t: any) => ({
        id: String(t._id),
        transaction_id: t.transaction_id || String(t._id),
        amount: t.amount,
        type: t.type || 'credit',
        description: t.description || t.message || '',
        createdAt: t.createdAt || new Date().toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('fetchWalletHistory error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
