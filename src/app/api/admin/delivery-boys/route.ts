import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DeliveryBoy from '@/models/DeliveryBoy';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const riders = await DeliveryBoy.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: riders, count: riders.length });
  } catch (err) {
    console.error('GET /api/admin/delivery-boys:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const count = await DeliveryBoy.countDocuments();
    const rider = await DeliveryBoy.create({ ...body, delivery_boy_id: count + 1 });
    return NextResponse.json({ success: true, data: rider }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { riderId, ...updates } = body;
    if (!riderId) return NextResponse.json({ success: false, message: 'riderId required' }, { status: 400 });
    const updated = await DeliveryBoy.findByIdAndUpdate(riderId, { $set: updates }, { new: true }).select('-password');
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { riderId } = await req.json();
    if (!riderId) return NextResponse.json({ success: false, message: 'riderId required' }, { status: 400 });
    await DeliveryBoy.findByIdAndDelete(riderId);
    return NextResponse.json({ success: true, message: 'Rider removed' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
