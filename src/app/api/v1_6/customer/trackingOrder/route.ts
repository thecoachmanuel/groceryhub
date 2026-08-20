import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ status: 400, result: 'false', message: 'order_id required' }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findOne({
      $or: [
        { _id: order_id.length === 24 ? order_id : null },
        { order_id: order_id },
      ],
    }).lean();

    if (!order) {
      return NextResponse.json({ status: 404, result: 'false', message: 'Order not found' }, { status: 404 });
    }

    const o = order as any;

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Order tracking data',
      data: {
        id: String(o._id),
        order_id: o.order_id || String(o._id),
        order_status: o.order_status || 'placed',
        grand_total: o.grand_total || 0,
        delivery_charge: o.delivery_charge || 0,
        total: o.total || 0,
        items: o.items || [],
        delivery_address: o.delivery_address || {},
        payment_method: o.payment_method || 'cod',
        delivery_boy_name: o.delivery_boy_name || null,
        delivery_boy_phone: o.delivery_boy_phone || null,
        delivery_boy_latitude: o.delivery_boy_latitude || null,
        delivery_boy_longitude: o.delivery_boy_longitude || null,
        delivery_pin: o.delivery_pin || null,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, result: 'false', message: error.message }, { status: 500 });
  }
}
