import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find({ order_status: { $ne: 'cancelled' } }).lean();

    let totalOrders = orders.length;
    let totalRevenue = 0;

    const productSalesMap: Record<string, { id: number; name: string; category: string; unitsSold: number; revenue: number }> = {};

    let index = 1;
    orders.forEach((o: any) => {
      const orderTotal = o.total_amount || o.final_total || o.total_payable || 0;
      totalRevenue += orderTotal;

      if (o.items && Array.isArray(o.items)) {
        o.items.forEach((item: any) => {
          const key = item.product_name || item.name || 'Grocery Item';
          if (!productSalesMap[key]) {
            productSalesMap[key] = {
              id: index++,
              name: key,
              category: item.category || 'Vegetables',
              unitsSold: 0,
              revenue: 0,
            };
          }
          const qty = item.quantity || item.qty || 1;
          const price = item.price || item.discounted_price || 0;
          productSalesMap[key].unitsSold += qty;
          productSalesMap[key].revenue += price * qty;
        });
      }
    });

    const avgBasket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10)
      .map((p, idx) => ({ ...p, id: idx + 1, trend: idx % 2 === 0 ? 'up' : 'down' }));

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        avgBasket,
        topProducts,
      },
    });
  } catch (error: any) {
    console.error('AI Insights API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
