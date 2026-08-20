import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: 'Order summary fetched',
    subtotal: '7000.00',
    tax: '0.00',
    deliveryCharge: '500.00',
    additional_charge: '0.00',
    total_amount: '7500.00',
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
