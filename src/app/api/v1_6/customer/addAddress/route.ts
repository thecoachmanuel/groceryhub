import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: 'Address saved successfully',
    address_id: Math.floor(Math.random() * 9000 + 1000),
    data: body,
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
