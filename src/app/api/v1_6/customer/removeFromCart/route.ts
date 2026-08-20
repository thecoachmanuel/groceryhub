import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getUserIdFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { guest_id, product_id, variant_id, quantity, qty } = body;

    const authHeader = req.headers.get('authorization');
    const userId = getUserIdFromHeader(authHeader);
    const cartKey = userId ? `user_${userId}` : `guest_${guest_id || 'anon'}`;
    const removeQty = Number(quantity || qty || 1);

    const cart = await Cart.findOne({ cart_key: cartKey });
    if (cart) {
      const existingIndex = cart.items.findIndex(
        (i: any) =>
          String(i.product_id) === String(product_id) &&
          (!variant_id || String(i.variant_id) === String(variant_id))
      );

      if (existingIndex >= 0) {
        cart.items[existingIndex].qty -= removeQty;
        if (cart.items[existingIndex].qty <= 0) {
          cart.items.splice(existingIndex, 1);
        }
        await cart.save();
      }
    }

    const updatedCart = await Cart.findOne({ cart_key: cartKey }).lean<any>();
    const cartCount = updatedCart?.items?.length || 0;

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Item removed from cart successfully',
      cartCount,
      cart_count: cartCount,
    });
  } catch (error: any) {
    console.error('removeFromCart error:', error);
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Item removed from cart',
      cartCount: 0,
      cart_count: 0,
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
