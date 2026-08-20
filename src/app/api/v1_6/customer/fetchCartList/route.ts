import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Cart fetched successfully',
      subtotal: '7000',
      discountedPricesaving: '1000',
      data: [
        {
          id: 1,
          product_id: 1,
          product_name: 'Fresh Organic Farm Broccoli (500g)',
          image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800',
          price: 3500,
          discounted_price: 3000,
          qty: 1,
          unit: '500g',
          seller_id: 1,
        },
        {
          id: 2,
          product_id: 3,
          product_name: 'Artisanal Sourdough Country Loaf (750g)',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
          price: 4800,
          discounted_price: 4000,
          qty: 1,
          unit: '750g',
          seller_id: 1,
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      subtotal: '0',
      discountedPricesaving: '0',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
