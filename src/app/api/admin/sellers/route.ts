import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Seller from '@/models/Seller';
import { extractRequestId, buildIdFilter } from '@/lib/mongoose-helpers';

import Order from '@/models/Order';
import WithdrawalRequest from '@/models/WithdrawalRequest';

export const dynamic = 'force-dynamic';

const PLATFORM_FEE_RATE = 0.05;

export async function GET() {
  try {
    await connectToDatabase();
    const sellers = await Seller.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Enrich each vendor with computed live withdrawable wallet balance
    const enriched = await Promise.all(
      (sellers as any[]).map(async (s) => {
        const sid = s.id || s.seller_id;
        let withdrawableBalance = 0;
        let totalGross = 0;
        let totalWithdrawn = 0;

        if (sid) {
          const orders = await Order.find({
            seller_id: sid,
            order_status: 'delivered',
            is_pos_order: { $ne: true },
          }).lean();

          totalGross = (orders as any[]).reduce((sum, o) => sum + (o.total_amount || 0), 0);
          const netEarnings = totalGross * (1 - PLATFORM_FEE_RATE);

          const existingWithdrawn = await WithdrawalRequest.find({
            requester_id: sid,
            requester_type: 'seller',
            status: { $in: ['approved', 'transferred'] },
          }).lean();

          totalWithdrawn = (existingWithdrawn as any[]).reduce((sum, w) => sum + (w.amount || 0), 0);
          withdrawableBalance = Math.max(0, netEarnings - totalWithdrawn);
        }

        return {
          ...s,
          balance: withdrawableBalance,
          wallet_balance: withdrawableBalance,
          total_gross: totalGross,
          total_withdrawn: totalWithdrawn,
        };
      })
    );

    return NextResponse.json({ success: true, data: enriched, count: enriched.length });
  } catch (err) {
    console.error('GET /api/admin/sellers:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const count = await Seller.countDocuments();
    const seller = await Seller.create({ ...body, seller_id: count + 1 });
    return NextResponse.json({ success: true, data: seller }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, body } = await extractRequestId(req, ['sellerId', 'id', '_id', 'seller_id']);
    if (!id) return NextResponse.json({ success: false, message: 'sellerId required' }, { status: 400 });

    const filter = buildIdFilter(id, 'seller_id');
    const { sellerId, id: _i, _id, ...updates } = body;

    const updated = await Seller.findOneAndUpdate(filter, { $set: updates }, { new: true }).select('-password');
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await extractRequestId(req, ['sellerId', 'id', '_id', 'seller_id']);
    if (!id) return NextResponse.json({ success: false, message: 'sellerId required' }, { status: 400 });

    const filter = buildIdFilter(id, 'seller_id');
    await Seller.findOneAndDelete(filter);
    return NextResponse.json({ success: true, message: 'Seller deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
