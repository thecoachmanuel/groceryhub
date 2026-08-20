import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import WithdrawalRequest from '@/models/WithdrawalRequest';

export const dynamic = 'force-dynamic';

const PLATFORM_FEE_RATE = 0.05; // 5%

import Seller from '@/models/Seller';

/** Compute seller gross from delivered online orders or seller model balance */
async function computeSellerGross(sellerId: number): Promise<number> {
  const orders = await Order.find({
    seller_id: sellerId,
    order_status: 'delivered',
    is_pos_order: { $ne: true },
  }).lean();
  const grossFromOrders = (orders as any[]).reduce((sum, o) => sum + (o.total_amount || 0), 0);
  if (grossFromOrders > 0) return grossFromOrders;

  // Fallback to Seller model balance if orders aren't marked delivered yet
  const seller = await Seller.findOne({ $or: [{ id: sellerId }, { seller_id: sellerId }] }).lean();
  return (seller as any)?.balance || 50000; // default 50k for demo seller
}

/** Compute total non-rejected withdrawals for a seller */
async function computeWithdrawn(sellerId: number): Promise<number> {
  const settled = await WithdrawalRequest.find({
    requester_id: sellerId,
    requester_type: 'seller',
    status: { $ne: 'rejected' },
  }).lean();
  return (settled as any[]).reduce((sum, w) => sum + (w.amount || 0), 0);
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const sellerIdParam = searchParams.get('seller_id') || '1';
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
    const { seller_id = 1, seller_name, amount, bank_name, account_number, account_name } = body;

    if (!amount || !bank_name || !account_number || !account_name) {
      return NextResponse.json({ success: false, message: 'Missing required bank details or amount' }, { status: 400 });
    }

    const sId = Number(seller_id) || 1;
    const gross = await computeSellerGross(sId);
    const netEarnings = gross * (1 - PLATFORM_FEE_RATE);
    const alreadyWithdrawn = await computeWithdrawn(sId);
    const withdrawable = Math.max(0, netEarnings - alreadyWithdrawn);

    if (Number(amount) > withdrawable && withdrawable > 0) {
      return NextResponse.json({ success: false, message: `Amount exceeds withdrawable balance of ₦${withdrawable.toFixed(2)}` }, { status: 400 });
    }

    const requestId = `REQ-WDR-${Date.now()}`;
    const newRequest = await WithdrawalRequest.create({
      request_id: requestId,
      requester_type: 'seller',
      requester_id: sId,
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
