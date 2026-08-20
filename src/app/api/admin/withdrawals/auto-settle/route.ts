import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Seller from '@/models/Seller';
import Order from '@/models/Order';
import WithdrawalRequest from '@/models/WithdrawalRequest';

export const dynamic = 'force-dynamic';

const PLATFORM_FEE_RATE = 0.05;

/** Auto-settle withdrawable balances for all vendors (or a single vendor) */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { seller_id } = body;

    const sellerFilter = seller_id ? { $or: [{ id: Number(seller_id) }, { seller_id: Number(seller_id) }] } : {};
    const sellers = await Seller.find(sellerFilter).lean();

    const settledResults = [];

    for (const s of sellers as any[]) {
      const sid = s.id || s.seller_id;
      if (!sid) continue;

      // Compute gross from delivered online orders
      const orders = await Order.find({
        seller_id: sid,
        order_status: 'delivered',
        is_pos_order: { $ne: true },
      }).lean();

      const gross = (orders as any[]).reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const netEarnings = gross * (1 - PLATFORM_FEE_RATE);

      const existingWithdrawn = await WithdrawalRequest.find({
        requester_id: sid,
        requester_type: 'seller',
        status: { $in: ['approved', 'transferred'] },
      }).lean();

      const alreadyWithdrawn = (existingWithdrawn as any[]).reduce((sum, w) => sum + (w.amount || 0), 0);
      const withdrawable = Math.max(0, netEarnings - alreadyWithdrawn);

      if (withdrawable > 0) {
        const requestId = `AUTO-SETTLE-${Date.now()}-${sid}`;
        const created = await WithdrawalRequest.create({
          request_id: requestId,
          requester_type: 'seller',
          requester_id: sid,
          requester_name: s.store_name || s.name || `Vendor #${sid}`,
          amount: Math.round(withdrawable * 100) / 100,
          bank_name: s.bank_name || 'Zenith Bank PLC',
          account_number: s.account_number || '0000000000',
          account_name: s.account_name || s.name || 'Store Partner',
          status: 'transferred',
          transfer_reference: `NIP-AUTO-${Math.floor(100000 + Math.random() * 900000)}`,
          rejection_reason: 'Automated platform weekly payout settlement',
        });
        settledResults.push(created);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Auto-settlement completed. ${settledResults.length} vendor payout(s) executed.`,
      settlements: settledResults,
    });
  } catch (err: any) {
    console.error('Auto-settle error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
