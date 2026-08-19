import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PosSale from '@/models/PosSale';

export const dynamic = 'force-dynamic';

/** POS-only sales ledger — completely separate from online orders */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('seller_id');
    const range = searchParams.get('range') || 'month';

    let dateFilter: any = {};
    const now = new Date();
    if (range === 'today') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } };
    } else if (range === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (range === 'month') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
    } else if (range === 'year') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
    }

    const filter: any = { status: 'completed', ...dateFilter };
    if (sellerId) filter.seller_id = Number(sellerId);

    const sales = await PosSale.find(filter).sort({ createdAt: -1 }).lean();

    const totalRevenue = sales.reduce((s: number, r: any) => s + (r.total || 0), 0);
    const totalTransactions = sales.length;
    const totalItems = sales.reduce((s: number, r: any) => s + (r.items?.reduce((is: number, i: any) => is + (i.quantity || 0), 0) || 0), 0);

    return NextResponse.json({
      success: true,
      data: sales,
      summary: { totalRevenue, totalTransactions, totalItems },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
