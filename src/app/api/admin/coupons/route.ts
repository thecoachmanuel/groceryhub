import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { extractRequestId, buildIdFilter } from '@/lib/mongoose-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: coupons, count: coupons.length });
  } catch (err) {
    console.error('GET /api/admin/coupons:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    if (!body.code || !body.discount || !body.expiry_date) {
      return NextResponse.json({ success: false, message: 'code, discount, and expiry_date are required' }, { status: 400 });
    }
    const coupon = await Coupon.create(body);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, body } = await extractRequestId(req, ['couponId', 'id', '_id']);
    if (!id) return NextResponse.json({ success: false, message: 'couponId required' }, { status: 400 });

    const filter = buildIdFilter(id);
    const { couponId, id: _i, _id, ...updates } = body;

    const updated = await Coupon.findOneAndUpdate(filter, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await extractRequestId(req, ['couponId', 'id', '_id']);
    if (!id) return NextResponse.json({ success: false, message: 'couponId required' }, { status: 400 });

    const filter = buildIdFilter(id);
    await Coupon.findOneAndDelete(filter);
    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
