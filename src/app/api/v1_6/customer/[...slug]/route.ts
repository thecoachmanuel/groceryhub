import { NextRequest } from 'next/server';
import { handleCustomerEndpoint } from '@/lib/customer-handler';

export const dynamic = 'force-dynamic';

async function handleCustomerRequest(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const endpoint = params.slug?.[0] || '';
  return handleCustomerEndpoint(req, endpoint);
}

export async function GET(req: NextRequest, ctx: { params: { slug: string[] } }) {
  return handleCustomerRequest(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: { slug: string[] } }) {
  return handleCustomerRequest(req, ctx);
}

export async function PUT(req: NextRequest, ctx: { params: { slug: string[] } }) {
  return handleCustomerRequest(req, ctx);
}
