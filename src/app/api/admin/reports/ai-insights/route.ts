import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    // Aggregate top products from orders
    const orders = await Order.find({ order_status: { $ne: 'cancelled' } }).lean();

    const productSalesMap: Record<string, { id: number; name: string; category: string; unitsSold: number; revenue: number }> = {};

    let index = 1;
    orders.forEach((o: any) => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach((item: any) => {
          const key = item.product_name || 'Item';
          if (!productSalesMap[key]) {
            productSalesMap[key] = {
              id: index++,
              name: key,
              category: item.category || 'General',
              unitsSold: 0,
              revenue: 0,
            };
          }
          const qty = item.quantity || 1;
          const price = item.discounted_price || item.price || 0;
          productSalesMap[key].unitsSold += qty;
          productSalesMap[key].revenue += price * qty;
        });
      }
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10)
      .map((p, idx) => ({ ...p, id: idx + 1, trend: idx % 2 === 0 ? 'up' : 'down' }));

    return NextResponse.json({ success: true, data: topProducts });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
