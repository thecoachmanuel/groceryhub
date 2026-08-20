import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: 'Addresses fetched successfully',
    data: [
      {
        id: 1,
        address_id: 1,
        address_type: 'Home',
        user_name: 'Chinedu Okafor',
        user_mobile: '+234 802 345 6789',
        flat: 'Plot 14',
        floor: '2nd Floor',
        address: 'Plot 14, Adeola Odeku St, Victoria Island',
        city: 'Lagos',
        state: 'Lagos State',
        landmark: 'Near Eko Hotel',
        is_default: 1,
      },
      {
        id: 2,
        address_id: 2,
        address_type: 'Work',
        user_name: 'Chinedu Okafor',
        user_mobile: '+234 802 345 6789',
        flat: 'Suite 402',
        floor: '4th Floor',
        address: 'Commercial Avenue, Sabo Yaba',
        city: 'Lagos',
        state: 'Lagos State',
        landmark: 'Opposite Ozone Cinemas',
        is_default: 0,
      },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
