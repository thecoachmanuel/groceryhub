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
    const type = searchParams.get('type'); // 'seller' | 'delivery'

    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.requester_type = type;

    const requests = await WithdrawalRequest.find(filter).sort({ createdAt: -1 }).lean();

    // Enrich each request with current withdrawable balance for the requester
    const enriched = await Promise.all(
      (requests as any[]).map(async (r) => {
        let gross = 0;
        let netEarnings = 0;

        if (r.requester_type === 'delivery') {
          // Rider earnings from delivered runs
          const orders = await Order.find({
            delivery_boy_id: r.requester_id,
            order_status: 'delivered',
          }).lean();
          netEarnings = (orders as any[]).reduce((s, o) => s + (o.delivery_charge || 1500), 0);
          gross = netEarnings;
        } else {
          // Seller earnings from delivered online orders
          const orders = await Order.find({
            seller_id: r.requester_id,
            order_status: 'delivered',
            is_pos_order: { $ne: true },
          }).lean();
          gross = (orders as any[]).reduce((s, o) => s + (o.total_amount || 0), 0);
          netEarnings = gross * (1 - PLATFORM_FEE_RATE);
        }

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

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { requester_type = 'seller', requester_id, requester_name, amount, bank_name, account_number, account_name, transfer_reference, notes } = body;

    if (!requester_id || !amount || !bank_name) {
      return NextResponse.json({ success: false, message: 'requester_id, amount, and bank_name required' }, { status: 400 });
    }

    const requestId = `TXN-PAY-${Date.now()}`;
    const newRequest = await WithdrawalRequest.create({
      request_id: requestId,
      requester_type,
      requester_id: Number(requester_id),
      requester_name: requester_name || (requester_type === 'delivery' ? 'Rider' : 'Vendor'),
      amount: Number(amount),
      bank_name,
      account_number: account_number || '0000000000',
      account_name: account_name || requester_name || 'Partner',
      status: 'transferred',
      transfer_reference: transfer_reference || `NIP-${Math.floor(100000 + Math.random() * 900000)}`,
      rejection_reason: notes || '',
    });

    return NextResponse.json({ success: true, data: newRequest, message: 'Payout recorded successfully' });
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
