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
    const { order_status, payment_status, delivery_boy_id, delivery_boy_name, delivery_boy_phone, delivery_pin_verify } = body;

    const existingOrder = await Order.findOne({
      $or: [{ _id: params.id }, { order_id: params.id }],
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // PIN Verification for Delivery Handover
    if (delivery_pin_verify !== undefined) {
      const pinStr = String(delivery_pin_verify).trim();
      const expectedPin = String(existingOrder.delivery_pin).trim();
      if (pinStr !== expectedPin) {
        return NextResponse.json(
          { success: false, message: `Invalid Delivery PIN code (${pinStr}). Please ask customer for the 4-digit PIN on their order screen.` },
          { status: 400 }
        );
      }
      existingOrder.order_status = 'delivered';
      existingOrder.payment_status = 'paid';
      await existingOrder.save();
      return NextResponse.json({
        success: true,
        message: 'Delivery PIN verified successfully! Order marked as DELIVERED.',
        data: existingOrder,
      });
    }

    const updateFields: any = {};
    if (order_status) updateFields.order_status = order_status;
    if (payment_status) updateFields.payment_status = payment_status;
    if (delivery_boy_id !== undefined) updateFields.delivery_boy_id = Number(delivery_boy_id);
    if (delivery_boy_name) updateFields.delivery_boy_name = delivery_boy_name;
    if (delivery_boy_phone) updateFields.delivery_boy_phone = delivery_boy_phone;

    const updated = await Order.findOneAndUpdate(
      { $or: [{ _id: params.id }, { order_id: params.id }] },
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
