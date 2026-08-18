import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
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
    const body = await req.json();
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
    const body = await req.json();
    const { couponId, ...updates } = body;
    if (!couponId) return NextResponse.json({ success: false, message: 'couponId required' }, { status: 400 });
    const updated = await Coupon.findByIdAndUpdate(couponId, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { couponId } = await req.json();
    if (!couponId) return NextResponse.json({ success: false, message: 'couponId required' }, { status: 400 });
    await Coupon.findByIdAndDelete(couponId);
    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
