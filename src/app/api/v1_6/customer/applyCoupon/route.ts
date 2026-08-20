import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { coupon_code, code, cart_total, subtotal, seller_id } = body;
    const couponCode = (coupon_code || code || '').toUpperCase().trim();
    const orderAmount = Number(cart_total || subtotal || 0);

    if (!couponCode) {
      return NextResponse.json({
        status: 'error', code: 400, result: 'false',
        message: 'Please enter a coupon code',
      });
    }

    // Find active coupon in DB
    const coupon = await Coupon.findOne({ code: couponCode, is_active: true }).lean<any>();

    if (!coupon) {
      return NextResponse.json({
        status: 'error', code: 404, result: 'false',
        message: `Coupon "${couponCode}" is invalid or has been deactivated`,
      });
    }

    // Check expiry
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return NextResponse.json({
        status: 'error', code: 400, result: 'false',
        message: `Coupon "${couponCode}" has expired on ${new Date(coupon.expiry_date).toLocaleDateString('en-NG')}`,
      });
    }

    // Check usage limit
    if (coupon.usage_limit > 0 && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({
        status: 'error', code: 400, result: 'false',
        message: `Coupon "${couponCode}" has reached its maximum usage limit`,
      });
    }

    // Check minimum purchase
    if (coupon.min_purchase > 0 && orderAmount < coupon.min_purchase) {
      return NextResponse.json({
        status: 'error', code: 400, result: 'false',
        message: `Minimum order amount of ₦${coupon.min_purchase.toLocaleString()} required to apply this coupon. Your total is ₦${orderAmount.toLocaleString()}`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderAmount * coupon.discount) / 100;
      if (coupon.max_discount > 0 && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else {
      discountAmount = coupon.discount;
    }
    discountAmount = Math.min(discountAmount, orderAmount);

    // Increment usage count
    await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usage_count: 1 } });

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: `🎉 Coupon "${couponCode}" applied! You saved ₦${discountAmount.toLocaleString()}`,
      discount_amount: discountAmount,
      data: {
        id: String(coupon._id),
        code: coupon.code,
        title: coupon.title,
        coupon_type: coupon.discount_type === 'percentage' ? '1' : '2',
        value: coupon.discount,
        discount_amount: discountAmount,
        discount_type: coupon.discount_type,
      },
    });
  } catch (error: any) {
    console.error('applyCoupon error:', error);
    return NextResponse.json({
      status: 'error', code: 500, result: 'false',
      message: 'Unable to apply coupon. Please try again.',
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
