import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import WithdrawalRequest from '@/models/WithdrawalRequest';

export const dynamic = 'force-dynamic';

const PLATFORM_FEE_RATE = 0.05; // 5%

/** Compute seller gross from delivered online orders (excluding POS) */
async function computeSellerGross(sellerId: number): Promise<number> {
  const orders = await Order.find({
    seller_id: sellerId,
    order_status: 'delivered',
    is_pos_order: { $ne: true },
  }).lean();
  return (orders as any[]).reduce((sum, o) => sum + (o.total_amount || 0), 0);
}

/** Compute total approved/transferred withdrawals for a seller */
async function computeWithdrawn(sellerId: number): Promise<number> {
  const settled = await WithdrawalRequest.find({
    requester_id: sellerId,
    requester_type: 'seller',
    status: { $in: ['approved', 'transferred'] },
  }).lean();
  return (settled as any[]).reduce((sum, w) => sum + (w.amount || 0), 0);
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const sellerIdParam = searchParams.get('seller_id');
    if (!sellerIdParam) return NextResponse.json({ success: false, message: 'seller_id required' }, { status: 400 });
    const sellerId = Number(sellerIdParam);

    const gross = await computeSellerGross(sellerId);
    const netEarnings = gross * (1 - PLATFORM_FEE_RATE);
    const alreadyWithdrawn = await computeWithdrawn(sellerId);
    const withdrawableBalance = Math.max(0, netEarnings - alreadyWithdrawn);

    const history = await WithdrawalRequest.find({
      requester_id: sellerId,
      requester_type: 'seller',
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, withdrawableBalance, netEarnings, alreadyWithdrawn, history });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { seller_id, seller_name, amount, bank_name, account_number, account_name } = body;

    if (!seller_id || !amount || !bank_name || !account_number || !account_name) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const withdrawable = Math.max(0, (await computeSellerGross(Number(seller_id))) * (1 - PLATFORM_FEE_RATE) - (await computeWithdrawn(Number(seller_id))));
    if (Number(amount) > withdrawable) {
      return NextResponse.json({ success: false, message: `Amount exceeds withdrawable balance of ₦${withdrawable.toFixed(2)}` }, { status: 400 });
    }

    const requestId = `REQ-WDR-${Date.now()}`;
    const newRequest = await WithdrawalRequest.create({
      request_id: requestId,
      requester_type: 'seller',
      requester_id: Number(seller_id),
      requester_name: seller_name || 'Seller',
      amount: Number(amount),
      bank_name,
      account_number,
      account_name,
      status: 'pending',
    });

    return NextResponse.json({ success: true, data: newRequest, message: 'Withdrawal request submitted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
