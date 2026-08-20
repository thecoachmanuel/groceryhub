import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const userId = Number(body.user_id || 101);

    const orders = await Order.find({
      user_id: userId,
      order_status: { $in: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'Out for Delivery'] },
    }).sort({ createdAt: -1 }).lean<any[]>().catch(() => []);

    const formattedOrders = orders.map((o: any) => ({
      id: String(o._id),
      order_id: o.order_id || String(o._id),
      my_order_id: o.order_id || String(o._id),
      user_id: o.user_id,
      order_date: new Date(o.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      subtotal: o.subtotal || o.total_amount || 0,
      tax: o.tax || 0,
      delivery_charge: o.delivery_charge || 0,
      payment: o.total_amount || o.subtotal || 0,
      payment_status: o.payment_status || 'Pending',
      status: o.order_status || o.status || 'placed',
      delivery_method: 'homeDelivery',
      timeslot: o.delivery_timeslot || 'Express Delivery',
      delivery_date: 'Today',
      items: o.items || [],
      bg_color: '#FEF3C7',
      text_color: '#D97706',
    }));

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Running orders fetched successfully',
      data: formattedOrders,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Running orders fetched',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
