import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token, user_id, status, page = 1, limit = 20 } = body;

    await connectToDatabase();

    const query: any = {};
    if (user_id) query.user_id = Number(user_id);
    if (status && status !== 'all') query.order_status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Orders fetched',
      total,
      data: orders.map((o: any) => ({
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
        delivery_pin: o.delivery_pin || null,
        createdAt: o.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, result: 'false', message: error.message }, { status: 500 });
  }
}
