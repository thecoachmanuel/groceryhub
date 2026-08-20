import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DeliveryBoy from '@/models/DeliveryBoy';
import { extractRequestId, buildIdFilter } from '@/lib/mongoose-helpers';

import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const riders = await DeliveryBoy.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Enrich riders with live COD cash calculations
    const enriched = await Promise.all(
      (riders as any[]).map(async (r) => {
        const rid = r.id || r.delivery_boy_id;
        let realCodCollected = r.cash_collected || 0;

        if (rid) {
          const codOrders = await Order.find({
            delivery_boy_id: rid,
            order_status: 'delivered',
            payment_method: { $regex: /^cod$/i },
          }).lean();

          const codTotal = (codOrders as any[]).reduce((sum, o) => sum + (o.total_amount || 0), 0);
          if (codTotal > 0) realCodCollected = codTotal;
        }

        const remitted = r.cash_remitted || 0;
        const pending = Math.max(0, realCodCollected - remitted);

        return {
          ...r,
          cash_collected: realCodCollected,
          cash_remitted: remitted,
          cash_pending: pending,
        };
      })
    );

    return NextResponse.json({ success: true, data: enriched, count: enriched.length });
  } catch (err) {
    console.error('GET /api/admin/delivery-boys:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const count = await DeliveryBoy.countDocuments();
    const rider = await DeliveryBoy.create({ ...body, delivery_boy_id: count + 1 });
    return NextResponse.json({ success: true, data: rider }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, body } = await extractRequestId(req, ['riderId', 'id', '_id', 'delivery_boy_id']);
    if (!id) return NextResponse.json({ success: false, message: 'riderId required' }, { status: 400 });

    const filter = buildIdFilter(id, 'delivery_boy_id');
    const { riderId, id: _i, _id, ...updates } = body;

    const updated = await DeliveryBoy.findOneAndUpdate(filter, { $set: updates }, { new: true }).select('-password');
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await extractRequestId(req, ['riderId', 'id', '_id', 'delivery_boy_id']);
    if (!id) return NextResponse.json({ success: false, message: 'riderId required' }, { status: 400 });

    const filter = buildIdFilter(id, 'delivery_boy_id');
    await DeliveryBoy.findOneAndDelete(filter);
    return NextResponse.json({ success: true, message: 'Rider removed' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
