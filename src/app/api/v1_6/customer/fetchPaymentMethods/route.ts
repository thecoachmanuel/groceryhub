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
        name: 'Paystack (Card / Bank Transfer / USSD)',
        slug: 'paystack',
        icon: 'credit-card',
        status: 1,
      },
      {
        id: 1,
        name: 'Cash on Delivery (COD)',
        slug: 'cod',
        icon: 'cash',
        status: 1,
      },
      {
        id: 2,
        name: 'GroceryHub Wallet Balance',
        slug: 'wallet',
        icon: 'wallet',
        status: 1,
      },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
