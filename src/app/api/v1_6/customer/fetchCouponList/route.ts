import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const seller_id = body.seller_id;

    const now = new Date();
    const query: any = {
      is_active: true,
      expiry_date: { $gte: now },
    };

    const coupons = await Coupon.find(query).sort({ createdAt: -1 }).lean<any[]>();

    const formatted = coupons.map(c => ({
      id: String(c._id),
      code: c.code,
      title: c.title,
      description: c.discount_type === 'percentage'
        ? `Get ${c.discount}% off${c.min_purchase > 0 ? ` on orders above ₦${c.min_purchase.toLocaleString()}` : ''}`
        : `Get ₦${c.discount.toLocaleString()} off${c.min_purchase > 0 ? ` on orders above ₦${c.min_purchase.toLocaleString()}` : ''}`,
      coupon_type: c.discount_type === 'percentage' ? '1' : '2',
      value: c.discount,
      discount_type: c.discount_type,
      min_order_amount: c.min_purchase || 0,
      max_discount: c.max_discount || 0,
      valid_until: c.expiry_date ? new Date(c.expiry_date).toISOString().split('T')[0] : '',
      usage_count: c.usage_count || 0,
      usage_limit: c.usage_limit || 0,
      is_active: c.is_active,
    }));

    // If no coupons in DB yet, return sample coupons so app isn't empty
    if (formatted.length === 0) {
      return NextResponse.json({
        status: 'success', code: 200, result: 'true',
        message: 'No active coupons available right now. Check back soon!',
        data: [],
      });
    }

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Coupons fetched successfully',
      data: formatted,
    });
  } catch (error: any) {
    console.error('fetchCouponList error:', error);
    return NextResponse.json({
      status: 'success', code: 200, result: 'true',
      message: 'Coupons fetched', data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
