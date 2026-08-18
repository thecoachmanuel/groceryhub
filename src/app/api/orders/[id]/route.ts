import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const order = await Order.findOne({
      $or: [{ _id: params.id }, { order_id: params.id }],
    }).lean();

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { order_status, payment_status, delivery_boy_id } = body;

    const updateFields: any = {};
    if (order_status) updateFields.order_status = order_status;
    if (payment_status) updateFields.payment_status = payment_status;
    if (delivery_boy_id !== undefined) updateFields.delivery_boy_id = Number(delivery_boy_id);

    const updated = await Order.findOneAndUpdate(
      { $or: [{ _id: params.id }, { order_id: params.id }] },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
