import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // Return orders that have a return_request flag or active_status = 'returned'/'return_requested'
    const returns = await Order.find({
      $or: [
        { active_status: { $in: ['returned', 'return_requested', 'refund_requested'] } },
        { return_requested: true },
      ],
    })
      .sort({ created_at: -1 })
      .lean();
    return NextResponse.json({ success: true, data: returns, count: returns.length });
  } catch (err) {
    console.error('GET /api/admin/return-requests:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { orderId, active_status, return_status } = body;
    if (!orderId) return NextResponse.json({ success: false, message: 'orderId required' }, { status: 400 });
    const updated = await Order.findByIdAndUpdate(
      orderId,
      { $set: { active_status, return_status } },
      { new: true }
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
