import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { product_varient_id } = body;

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Variant details fetched',
      data: {
        id: product_varient_id || '101',
        variant_id: product_varient_id || 101,
        title: '500g Pack',
        price: 3500,
        discounted_price: 3000,
        unit: '500g',
        stock: 100,
        is_unlimited_stock: 1,
        cart_quantity: 0,
        images: [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      data: {},
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
