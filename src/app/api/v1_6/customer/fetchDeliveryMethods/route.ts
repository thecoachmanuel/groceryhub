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
        title: 'Express Home Delivery (30 Mins)',
        name: 'Express Home Delivery (30 Mins)',
        description: 'Delivered straight to your doorstep in 30 minutes',
        image: 'https://images.unsplash.com/photo-1513885011494-df8612ca4937?w=100',
        status: 1,
      },
      {
        id: 'scheduledDelivery',
        title: 'Scheduled Delivery',
        name: 'Scheduled Delivery',
        description: 'Choose your preferred date and time slot',
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=100',
        status: 1,
      },
      {
        id: 'selfPickup',
        title: 'Self Pickup at Store',
        name: 'Self Pickup at Store',
        description: 'Pick up directly from seller store address',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100',
        status: 1,
      },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
