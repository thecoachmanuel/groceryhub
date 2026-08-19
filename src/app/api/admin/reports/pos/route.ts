import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const posOrders = await Order.find({
      $or: [
        { is_pos_order: true },
        { order_id: /^POS/ },
        { payment_method: 'pos' },
        { delivery_timeslot: /Counter Pickup/i },
      ],
    }).sort({ createdAt: -1 }).lean();

    const formatted = posOrders.map((o: any) => {
      const itemsCount = o.items ? o.items.reduce((s: number, i: any) => s + (i.quantity || i.qty || 1), 0) : 0;
      return {
        id: o.order_id || `POS-${o._id.toString().slice(-6)}`,
        registerId: o.seller_id ? `Register #${o.seller_id} (Counter)` : 'Register #1 (Main Counter)',
        cashierName: o.delivery_address?.title || 'Admin Cashier',
        itemsCount,
        paymentMethod: (o.payment_method || 'CASH').toUpperCase(),
        tenderedAmount: o.total_amount || o.final_total || 0,
        changeGiven: 0,
        total: o.total_amount || o.final_total || 0,
        timestamp: o.createdAt
          ? new Date(o.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          : '—',
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error('GET /api/admin/reports/pos error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
