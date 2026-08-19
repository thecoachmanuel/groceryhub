import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import WithdrawalRequest from '@/models/WithdrawalRequest';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

const PLATFORM_FEE_RATE = 0.05;

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const filter: any = {};
    if (status) filter.status = status;

    const requests = await WithdrawalRequest.find(filter).sort({ createdAt: -1 }).lean();

    // Enrich each request with current withdrawable balance for the requester
    const enriched = await Promise.all(
      (requests as any[]).map(async (r) => {
        const orders = await Order.find({
          seller_id: r.requester_id,
          order_status: 'delivered',
          is_pos_order: { $ne: true },
        }).lean();
        const gross = (orders as any[]).reduce((s, o) => s + (o.total_amount || 0), 0);
        const netEarnings = gross * (1 - PLATFORM_FEE_RATE);
        const otherWithdrawn = await WithdrawalRequest.find({
          requester_id: r.requester_id,
          requester_type: r.requester_type,
          status: { $in: ['approved', 'transferred'] },
          _id: { $ne: r._id },
        }).lean();
        const alreadyWithdrawn = (otherWithdrawn as any[]).reduce((s, w) => s + (w.amount || 0), 0);
        const withdrawableBalance = Math.max(0, netEarnings - alreadyWithdrawn);
        return { ...r, withdrawableBalance, netEarnings };
      })
    );

    return NextResponse.json({ success: true, data: enriched });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { request_id, status, transfer_reference, rejection_reason } = body;

    if (!request_id || !status) {
      return NextResponse.json({ success: false, message: 'request_id and status required' }, { status: 400 });
    }

    const validStatuses = ['approved', 'transferred', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    const update: any = { status };
    if (transfer_reference) update.transfer_reference = transfer_reference;
    if (rejection_reason) update.rejection_reason = rejection_reason;

    const updated = await WithdrawalRequest.findOneAndUpdate(
      { request_id },
      { $set: update },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Withdrawal request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated, message: `Withdrawal ${status} successfully` });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
