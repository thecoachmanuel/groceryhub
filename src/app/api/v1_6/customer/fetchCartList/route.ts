import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getUserIdFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { guest_id } = body;

    const authHeader = req.headers.get('authorization');
    const userId = getUserIdFromHeader(authHeader);
    const cartKey = userId ? `user_${userId}` : `guest_${guest_id || 'anon'}`;

    const cart = await Cart.findOne({ cart_key: cartKey }).lean<any>();
    const items: any[] = cart?.items || [];

    let subtotal = 0;
    let savingsTotal = 0;

    const formattedItems = items.map((item: any, index: number) => {
      const price = Number(item.price || 0);
      const discounted = Number(item.discounted_price || item.price || 0);
      const qty = Number(item.qty || 1);
      const effectivePrice = discounted > 0 && discounted < price ? discounted : price;
      subtotal += effectivePrice * qty;
      savingsTotal += (price - effectivePrice) * qty;

      return {
        id: index + 1,
        cart_id: index + 1,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product_name || 'Product',
        image: item.image || '',
        price: price,
        discounted_price: discounted,
        qty,
        unit: item.unit || 'pcs',
        seller_id: item.seller_id || 1,
        is_unlimited_stock: 1,
        stock: 100,
        variants: [
          {
            id: item.variant_id,
            variant_id: item.variant_id,
            title: item.unit || 'Standard',
            price,
            discounted_price: discounted,
            unit: item.unit || 'pcs',
            stock: 100,
            is_unlimited_stock: 1,
            cart_quantity: qty,
          },
        ],
      };
    });

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Cart fetched successfully',
      subtotal: subtotal.toFixed(2),
      discountedPricesaving: savingsTotal.toFixed(2),
      total: subtotal.toFixed(2),
      data: formattedItems,
    });
  } catch (error: any) {
    console.error('fetchCartList error:', error);
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      subtotal: '0',
      discountedPricesaving: '0',
      total: '0',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
