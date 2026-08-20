import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { code, subtotal = 0 } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code required' }, { status: 400 });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode, is_active: true }).lean();

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid or inactive promo code.' }, { status: 404 });
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return NextResponse.json({ success: false, message: 'This promo code has expired.' }, { status: 400 });
    }

    if (coupon.min_purchase && Number(subtotal) < Number(coupon.min_purchase)) {
      return NextResponse.json({
        success: false,
        message: `Minimum order amount of ?${coupon.min_purchase.toLocaleString()} required for this coupon.`,
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (Number(subtotal) * Number(coupon.discount)) / 100;
      if (coupon.max_discount && coupon.max_discount > 0) {
        discountAmount = Math.min(discountAmount, Number(coupon.max_discount));
      }
    } else {
      discountAmount = Number(coupon.discount);
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      title: coupon.title,
      discountAmount,
      message: `Coupon "${coupon.title}" applied successfully!`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
