import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// In-memory cart store for demo
const cartStore: Map<string, any[]> = new Map();

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { user_id, guest_id, product_id, product_variant_id } = body;

    const key = String(user_id || guest_id || 'guest');
    const cart = cartStore.get(key) || [];
    const inCart = product_id
      ? cart.some(
          (item: any) =>
            item.product_id === product_id &&
            (!product_variant_id || item.product_variant_id === product_variant_id)
        )
      : false;

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Cart status fetched',
      in_cart: inCart,
      cartCount: cart.length,
      cart_count: cart.length,
      data: cart.map(item => item.image || '').filter(Boolean),
      qty: inCart ? (cart.find((i: any) => i.product_id === product_id)?.qty || 1) : 0,
    });
  } catch (error: any) {
    console.error('isItemInCart error:', error);
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Cart status fetched',
      in_cart: false,
      cartCount: 0,
      cart_count: 0,
      data: [],
      qty: 0,
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
