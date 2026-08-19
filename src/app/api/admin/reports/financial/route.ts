import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Seller from '@/models/Seller';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'month';

    let dateFilter = {};
    const now = new Date();
    if (range === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { createdAt: { $gte: startOfDay } };
    } else if (range === 'week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { createdAt: { $gte: startOfWeek } };
    } else if (range === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { createdAt: { $gte: startOfMonth } };
    } else if (range === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = { createdAt: { $gte: startOfYear } };
    }

    const orders = await Order.find({ ...dateFilter, is_pos_order: { $ne: true } }).sort({ createdAt: -1 }).lean();

    // Map sellers
    const sellers = await Seller.find().lean();
    const sellerMap: Record<number, string> = {};
    sellers.forEach((s: any) => {
      sellerMap[s.id || s.seller_id] = s.store_name || s.name || 'Vendor';
    });

    const reportData = orders.map((o: any) => {
      const gross = o.total_amount || 0;
      const commission = gross * 0.05; // 5% platform commission
      const tax = gross * 0.075; // 7.5% VAT
      const netVendor = Math.max(0, gross - commission - tax);
      return {
        id: o.order_id || `ORD-${o._id.toString().slice(-6)}`,
        date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        customer: o.delivery_address?.title || 'Customer',
        vendor: sellerMap[o.seller_id] || 'Direct Store',
        gross,
        commission,
        tax,
        netVendor,
        status: o.order_status || 'Completed',
      };
    });

    return NextResponse.json({ success: true, data: reportData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
