import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('seller_id');
    const range = searchParams.get('range') || 'month';

    // Date range filter
    const now = new Date();
    let dateFilter: any = {};
    if (range === 'today') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } };
    } else if (range === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (range === 'month') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
    } else if (range === 'year') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
    }

    // Only online orders (exclude POS)
    const baseFilter: any = { ...dateFilter, is_pos_order: { $ne: true } };
    if (sellerId) baseFilter.seller_id = Number(sellerId);

    const orders = await Order.find(baseFilter).sort({ createdAt: -1 }).lean();

    // ── Daily Sales Aggregation ──
    const dailyMap: Record<string, { date: string; orders: number; grossSales: number; platformFee: number; netPayout: number }> = {};
    for (const o of orders as any[]) {
      const dateKey = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { date: dateKey, orders: 0, grossSales: 0, platformFee: 0, netPayout: 0 };
      }
      const gross = o.total_amount || 0;
      const fee = gross * 0.05;
      dailyMap[dateKey].orders += 1;
      dailyMap[dateKey].grossSales += gross;
      dailyMap[dateKey].platformFee += fee;
      dailyMap[dateKey].netPayout += gross - fee;
    }
    const daily_sales = Object.values(dailyMap).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // ── Product Sales Aggregation ──
    const productMap: Record<string, { id: string; name: string; category: string; unitsSold: number; revenue: number; prices: number[]; inStock: number }> = {};
    for (const o of orders as any[]) {
      const items = Array.isArray(o.items) ? o.items : [];
      for (const item of items) {
        const key = String(item.product_id || item._id || item.product_name);
        if (!productMap[key]) {
          productMap[key] = {
            id: key,
            name: item.product_name || 'Product',
            category: item.category || 'General',
            unitsSold: 0,
            revenue: 0,
            prices: [],
            inStock: 0,
          };
        }
        const qty = item.quantity || 1;
        const price = item.price || item.discounted_price || 0;
        productMap[key].unitsSold += qty;
        productMap[key].revenue += price * qty;
        productMap[key].prices.push(price);
      }
    }
    const product_sales = Object.values(productMap)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        unitsSold: p.unitsSold,
        revenue: p.revenue,
        avgPrice: p.prices.length > 0 ? p.prices.reduce((a, b) => a + b, 0) / p.prices.length : 0,
        rating: 4.8,
        inStock: p.inStock,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold);

    return NextResponse.json({ success: true, daily_sales, product_sales });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
