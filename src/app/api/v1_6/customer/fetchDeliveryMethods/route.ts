import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: 'Delivery methods fetched successfully',
    data: [
      {
        id: 'homeDelivery',
        name: 'Express Home Delivery (30 Mins)',
        description: 'Delivered straight to your doorstep in 30 minutes',
        status: 1,
      },
      {
        id: 'scheduledDelivery',
        name: 'Scheduled Delivery',
        description: 'Choose your preferred date and time slot',
        status: 1,
      },
      {
        id: 'selfPickup',
        name: 'Self Pickup at Store',
        description: 'Pick up directly from seller store address',
        status: 1,
      },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
