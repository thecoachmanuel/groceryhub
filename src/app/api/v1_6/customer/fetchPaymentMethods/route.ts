import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: 'Payment methods fetched successfully',
    data: [
      {
        id: 4,
        title: 'Paystack (Card / Bank / USSD / Transfer)',
        name: 'Paystack (Card / Bank / USSD / Transfer)',
        slug: 'paystack',
        icon: 'credit-card',
        img: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=100',
        status: 1,
      },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
