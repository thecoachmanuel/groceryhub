import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'success',
    result: 'true',
    message: 'Sorting options fetched',
    data: [
      { id: 1, title: 'Relevance / Recommended', slug: 'relevance' },
      { id: 2, title: 'Price: Low to High', slug: 'price_asc' },
      { id: 3, title: 'Price: High to Low', slug: 'price_desc' },
      { id: 4, title: 'Rating: High to Low', slug: 'rating_desc' },
      { id: 5, title: 'Newest First', slug: 'newest' },
    ],
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
