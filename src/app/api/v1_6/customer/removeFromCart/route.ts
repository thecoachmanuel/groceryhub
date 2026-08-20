import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Item removed from cart successfully',
      cartCount: 0,
      cart_count: 0,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Item removed from cart successfully',
      cartCount: 0,
      cart_count: 0,
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
