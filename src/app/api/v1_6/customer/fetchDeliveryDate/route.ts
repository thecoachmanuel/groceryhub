import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: 'Delivery dates fetched',
    data: [
      {
        date: today.toISOString().split('T')[0],
        title: 'Today',
      },
      {
        date: tomorrow.toISOString().split('T')[0],
        title: 'Tomorrow',
      },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
