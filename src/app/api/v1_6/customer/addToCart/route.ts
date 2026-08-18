import { NextRequest, NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { user_id, product_id, product_variant_id, quantity } = body;

    if (!product_id || !product_variant_id) {
      return apiError('Product ID and Variant ID are required', 400);
    }

    return apiSuccess(
      {
        cart_id: 101,
        user_id: user_id || 1,
        product_id,
        product_variant_id,
        quantity: quantity || 1,
      },
      'Item added to cart successfully'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Failed to add item to cart', 500);
  }
}
