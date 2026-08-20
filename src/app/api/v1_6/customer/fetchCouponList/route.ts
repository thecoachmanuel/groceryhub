import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: 'Coupons fetched successfully',
    data: [
      {
        id: 1,
        code: 'GROCERY15',
        title: '15% Off Your First Order',
        description: 'Get 15% discount on all organic fruits & vegetables.',
        coupon_type: '1',
        value: 15,
        min_order_amount: 5000,
        valid_until: '2026-12-31',
      },
      {
        id: 2,
        code: 'FREEDEL2026',
        title: 'Free Express Delivery',
        description: 'Free delivery on orders above ₦10,000.',
        coupon_type: '2',
        value: 500,
        min_order_amount: 10000,
        valid_until: '2026-12-31',
      },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
