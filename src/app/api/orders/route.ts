import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const status = searchParams.get('status');
    const userId = searchParams.get('user_id');

    let filter: any = {};
    if (status && status !== 'all') {
      filter.order_status = new RegExp(status, 'i');
    }
    if (userId) {
      // Match by numeric user_id OR by string
      const numId = parseInt(userId, 10);
      if (!isNaN(numId)) {
        filter.user_id = numId;
      } else {
        filter.user_id = userId;
      }
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: orders, count: orders.length });
  } catch (err: any) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { orderId, active_status } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'orderId is required' }, { status: 400 });
    }

    const updated = await Order.findOneAndUpdate(
      { $or: [{ order_id: orderId }, { _id: orderId }] },
      { $set: { active_status } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error('PUT /api/orders error:', err);
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
  }
}
