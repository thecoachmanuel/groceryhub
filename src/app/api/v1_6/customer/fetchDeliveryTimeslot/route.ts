import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: 'Timeslots fetched',
    data: [
      { id: 1, timeslot: '09:00 AM - 12:00 PM' },
      { id: 2, timeslot: '12:00 PM - 03:00 PM' },
      { id: 3, timeslot: '03:00 PM - 06:00 PM' },
      { id: 4, timeslot: '06:00 PM - 09:00 PM' },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
