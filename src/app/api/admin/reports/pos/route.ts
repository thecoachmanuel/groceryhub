import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const posOrders = await Order.find({
      $or: [{ is_pos_order: true }, { payment_method: 'pos' }]
    }).sort({ createdAt: -1 }).lean();

    const formatted = posOrders.map((o: any) => {
      const itemsCount = o.items ? o.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0) : 0;
      return {
        id: o.order_id || `POS-${o._id.toString().slice(-6)}`,
        registerId: 'Register #1 (Main Counter)',
        cashierName: 'Admin Cashier',
        itemsCount,
        paymentMethod: (o.payment_method || 'CASH').toUpperCase(),
        tenderedAmount: o.total_amount || 0,
        changeGiven: 0,
        total: o.total_amount || 0,
        timestamp: new Date(o.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
