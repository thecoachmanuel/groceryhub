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
        title: 'Paystack',
        name: 'Paystack',
        slug: 'paystack',
        icon: 'credit-card',
        img: 'https://raw.githubusercontent.com/PaystackHQ/paystack-wordpress/master/assets/icon.png',
        status: 1,
      },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
