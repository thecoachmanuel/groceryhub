import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// In-memory cart store for demo — swap for a Cart model if you have one
const cartStore: Map<string, any[]> = new Map();

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { user_id, product_id, product_variant_id } = body;

    if (!user_id || !product_id) {
      return NextResponse.json(
        { status: 400, result: 'false', message: 'user_id and product_id are required' },
        { status: 400 }
      );
    }

    const key = String(user_id);
    const cart = cartStore.get(key) || [];
    const inCart = cart.some(
      (item: any) =>
        item.product_id === product_id &&
        (!product_variant_id || item.product_variant_id === product_variant_id)
    );

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Cart status fetched',
      in_cart: inCart,
      cart_count: cart.length,
      qty: inCart ? (cart.find((i: any) => i.product_id === product_id)?.qty || 1) : 0,
    });
  } catch (error: any) {
    console.error('isItemInCart error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
