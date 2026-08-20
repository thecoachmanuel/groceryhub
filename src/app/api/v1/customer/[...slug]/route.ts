import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const url = new URL(req.url);
  url.pathname = url.pathname.replace('/api/v1/customer', '/api/v1_6/customer');
  return NextResponse.rewrite(url);
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const url = new URL(req.url);
  url.pathname = url.pathname.replace('/api/v1/customer', '/api/v1_6/customer');
  return NextResponse.rewrite(url);
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const url = new URL(req.url);
  url.pathname = url.pathname.replace('/api/v1/customer', '/api/v1_6/customer');
  return NextResponse.rewrite(url);
}
