import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getUserIdFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { guest_id, product_id, product_variant_id, variant_id } = body;

    const authHeader = req.headers.get('authorization');
    const userId = getUserIdFromHeader(authHeader);
    const cartKey = userId ? `user_${userId}` : `guest_${guest_id || 'anon'}`;

    const cart = await Cart.findOne({ cart_key: cartKey }).lean<any>();
    const items = cart?.items || [];
    const vId = product_variant_id || variant_id;

    const found = product_id
      ? items.find(
          (i: any) =>
            String(i.product_id) === String(product_id) &&
            (!vId || String(i.variant_id) === String(vId))
        )
      : null;

    const cartImages = items.slice(0, 5).map((i: any) => i.image || '').filter(Boolean);

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Cart status fetched',
      in_cart: !!found,
      cartCount: items.length,
      cart_count: items.length,
      qty: found?.qty || 0,
      data: cartImages,
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
      qty: 0,
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
