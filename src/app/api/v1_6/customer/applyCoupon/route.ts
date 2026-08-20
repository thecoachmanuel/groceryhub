import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const code = (body.coupon_code || body.code || 'GROCERY15').toUpperCase();

  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: `Coupon ${code} applied successfully!`,
    discount_amount: 1000,
    data: {
      code,
      value: 15,
      coupon_type: '1',
      discount_amount: 1000,
    },
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
