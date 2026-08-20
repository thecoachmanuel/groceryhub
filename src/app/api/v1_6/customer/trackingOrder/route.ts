import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { order_id, user_id } = body;

    if (!order_id && !user_id) {
      return NextResponse.json(
        { status: 400, result: 'false', message: 'order_id or user_id required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let order: any = null;

    if (order_id) {
      const isMongoId = typeof order_id === 'string' && order_id.length === 24;
      order = await Order.findOne({
        $or: [
          ...(isMongoId ? [{ _id: order_id }] : []),
          { order_id: order_id },
          { order_id: String(order_id) },
        ],
      }).lean();
    }

    if (!order && user_id) {
      // Return latest order for this user
      order = await Order.findOne({ user_id: Number(user_id) })
        .sort({ createdAt: -1 })
        .lean();
    }

    if (!order) {
      // Return a placeholder so the app doesn't crash
      return NextResponse.json({
        status: 200,
        result: 'true',
        message: 'Order tracking data',
        data: {
          order_id: order_id || 'N/A',
          order_status: 'placed',
          grand_total: 0,
          delivery_charge: 0,
          total: 0,
          items: [],
          delivery_address: {},
          payment_method: 'cod',
          delivery_boy_name: null,
          delivery_boy_phone: null,
          delivery_boy_latitude: null,
          delivery_boy_longitude: null,
          delivery_pin: null,
        },
      });
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
        grand_total: o.grand_total || o.total_amount || 0,
        delivery_charge: o.delivery_charge || 0,
        total: o.total || o.total_amount || 0,
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
    console.error('trackingOrder error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error.message },
      { status: 500 }
    );
  }
}
