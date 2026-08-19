import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Seller from '@/models/Seller';
import { buildIdFilter } from '@/lib/mongoose-helpers';

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

    // Enrich orders with real seller store names
    const uniqueSellerIds = [...new Set(orders.map((o: any) => o.seller_id).filter(Boolean))];
    let sellerMap: Record<number, string> = {};
    if (uniqueSellerIds.length > 0) {
      const sellers = await Seller.find({ seller_id: { $in: uniqueSellerIds } })
        .select('seller_id store_name name')
        .lean();
      sellers.forEach((s: any) => {
        sellerMap[s.seller_id] = s.store_name || s.name || `Store #${s.seller_id}`;
      });
    }

    const enriched = orders.map((o: any) => ({
      ...o,
      seller_store_name: sellerMap[o.seller_id] || (o.seller_id ? `Store #${o.seller_id}` : 'GroceryHub Direct'),
    }));

    return NextResponse.json({ success: true, data: enriched, count: enriched.length });
  } catch (err: any) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { orderId, id, active_status, order_status } = body;
    const targetId = orderId || id;

    if (!targetId) {
      return NextResponse.json({ success: false, message: 'orderId is required' }, { status: 400 });
    }

    const filter = buildIdFilter(targetId, 'order_id');
    const updateStatus = active_status || order_status;

    const updated = await Order.findOneAndUpdate(
      filter,
      { $set: { active_status: updateStatus, order_status: updateStatus } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error('PUT /api/orders error:', err);
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
  }
}
