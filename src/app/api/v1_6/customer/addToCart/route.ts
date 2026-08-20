import { NextRequest, NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { user_id, product_id, product_variant_id, quantity, qty } = body;

    if (!product_id) {
      return apiError('Product ID is required', 400);
    }

    return apiSuccess(
      {
        cart_id: Math.floor(Math.random() * 9000 + 1000),
        user_id: user_id || 1,
        product_id,
        product_variant_id: product_variant_id || null,
        quantity: quantity || qty || 1,
      },
      'Item added to cart successfully'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Failed to add item to cart', 500);
  }
}
