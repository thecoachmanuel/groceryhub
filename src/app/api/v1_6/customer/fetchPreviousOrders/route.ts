import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getUserIdFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    const authHeader = req.headers.get('authorization');
    const tokenUserId = getUserIdFromHeader(authHeader);
    const userId = Number(tokenUserId || body.user_id || 0);

    if (!userId) {
      return NextResponse.json({ status: 'success', code: 200, result: 'true', data: [] });
    }

    const orders = await Order.find({
      user_id: userId,
      order_status: { $in: ['delivered', 'cancelled', 'returned'] },
    }).sort({ createdAt: -1 }).lean<any[]>().catch(() => []);

    const formattedOrders = orders.map((o: any) => ({
      id: String(o._id),
      order_id: o.order_id || String(o._id),
      my_order_id: o.order_id || String(o._id),
      user_id: o.user_id,
      order_date: new Date(o.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      subtotal: o.subtotal || o.total_amount || 0,
      delivery_charge: o.delivery_charge || 0,
      payment: o.total_amount || o.subtotal || 0,
      payment_status: o.payment_status || 'Paid',
      status: o.order_status || 'delivered',
      delivery_method: 'homeDelivery',
      timeslot: o.delivery_timeslot || 'Express Delivery',
      delivery_date: 'Completed',
      items: (o.items || []).map((item: any) => ({
        product_name: item.product_name || '',
        image: item.image || '',
        qty: item.quantity || 1,
        price: item.price || 0,
        variant_title: item.variant_title || '',
      })),
      delivery_address: o.delivery_address || {},
      bg_color: '#D1FAE5',
      text_color: '#059669',
    }));

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Previous orders fetched successfully',
      data: formattedOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'success', code: 200, result: 'true', data: [] });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
