import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'success',
    code: 200,
    result: 'true',
    message: 'Address deleted successfully',
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
