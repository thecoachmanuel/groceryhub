import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Active address fetched',
      data: {
        id: 1,
        address_type: 'Home',
        user_name: 'Chinedu Okafor',
        user_mobile: '+234 802 345 6789',
        flat: 'Plot 14',
        floor: '2nd Floor',
        address: 'Plot 14, Adeola Odeku St, Victoria Island',
        city: 'Lagos',
        state: 'Lagos State',
        landmark: 'Near Eko Hotel',
        latitude: 6.4281,
        longitude: 3.4219,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      data: null,
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
