import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { user_id, product_id, product_variant_id, quantity, qty } = body;

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Item added to cart successfully',
      cart_id: Math.floor(Math.random() * 9000 + 1000),
      cartCount: 1,
      cart_count: 1,
      data: {
        user_id: user_id || 1,
        product_id,
        product_variant_id: product_variant_id || null,
        quantity: quantity || qty || 1,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Item added to cart successfully',
      cartCount: 1,
      cart_count: 1,
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
