import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { buildIdFilter } from '@/lib/mongoose-helpers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // Return orders that have a return_request flag or active_status = 'returned'/'return_requested'
    const returns = await Order.find({
      $or: [
        { active_status: { $in: ['returned', 'return_requested', 'refund_requested'] } },
        { return_status: { $in: ['Pending', 'Approved', 'Rejected', 'Requested'] } },
        { return_requested: true },
      ],
    })
      .sort({ createdAt: -1 })
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
    const body = await req.json().catch(() => ({}));
    const { orderId, id, active_status, return_status, status } = body;
    const targetId = orderId || id;
    if (!targetId) return NextResponse.json({ success: false, message: 'orderId is required' }, { status: 400 });

    const filter = buildIdFilter(targetId, 'order_id');
    const newStatus = return_status || status || active_status;

    const updated = await Order.findOneAndUpdate(
      filter,
      {
        $set: {
          return_status: newStatus,
          active_status: newStatus === 'Approved' ? 'returned' : newStatus === 'Rejected' ? 'delivered' : 'return_requested',
          order_status: newStatus === 'Approved' ? 'returned' : undefined,
        },
      },
      { new: true }
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
