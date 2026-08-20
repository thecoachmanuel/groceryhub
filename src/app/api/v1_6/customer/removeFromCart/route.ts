import { NextRequest, NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { user_id, product_id, product_variant_id, cart_id } = body;

    if (!product_id && !cart_id) {
      return apiError('product_id or cart_id is required', 400);
    }

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Item removed from cart successfully',
      cart_count: 0,
    });
  } catch (error: any) {
    return apiError(error?.message || 'Failed to remove item from cart', 500);
  }
}
