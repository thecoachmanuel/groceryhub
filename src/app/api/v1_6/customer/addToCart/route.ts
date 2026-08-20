import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getUserIdFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { guest_id, product_id, variant_id, quantity, qty } = body;

    const authHeader = req.headers.get('authorization');
    const userId = getUserIdFromHeader(authHeader);

    // Cart key: logged-in user takes priority over guest
    const cartKey = userId ? `user_${userId}` : `guest_${guest_id || 'anon'}`;
    const addQty = Number(quantity || qty || 1);

    // Fetch product details for name/image/price
    let productData: any = null;
    if (product_id) {
      const pid = Number(product_id);
      if (!isNaN(pid)) {
        productData = await Product.findOne({ product_id: pid }).lean<any>();
      }
      if (!productData) {
        productData = await Product.findById(String(product_id)).lean<any>().catch(() => null);
      }
    }

    const variantData = productData?.variants?.find(
      (v: any) => String(v.variant_id) === String(variant_id || '')
    ) || productData?.variants?.[0] || null;

    const cartItem = {
      product_id: String(product_id),
      variant_id: String(variant_id || variantData?.variant_id || '101'),
      product_name: productData?.name || 'Product',
      image: productData?.image || '',
      price: variantData?.price || productData?.price || 0,
      discounted_price: variantData?.discounted_price || variantData?.price || 0,
      qty: addQty,
      unit: variantData?.unit || productData?.unit || 'pcs',
      seller_id: productData?.seller_id || 1,
    };

    // Upsert cart: merge qty if same product+variant exists
    const cart = await Cart.findOne({ cart_key: cartKey });
    if (cart) {
      const existingIndex = cart.items.findIndex(
        (i: any) =>
          String(i.product_id) === String(product_id) &&
          String(i.variant_id) === String(cartItem.variant_id)
      );
      if (existingIndex >= 0) {
        cart.items[existingIndex].qty += addQty;
      } else {
        cart.items.push(cartItem);
      }
      if (userId) cart.user_id = userId;
      await cart.save();
    } else {
      await Cart.create({
        cart_key: cartKey,
        user_id: userId || 0,
        items: [cartItem],
      });
    }

    const updatedCart = await Cart.findOne({ cart_key: cartKey }).lean<any>();
    const cartCount = updatedCart?.items?.length || 1;

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Item added to cart successfully',
      cartCount,
      cart_count: cartCount,
    });
  } catch (error: any) {
    console.error('addToCart error:', error);
    return NextResponse.json({
      status: 'error',
      result: 'false',
      message: 'Failed to add to cart: ' + (error?.message || 'unknown error'),
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
