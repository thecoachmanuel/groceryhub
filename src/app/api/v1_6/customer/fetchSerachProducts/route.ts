import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { search } = body;

    await connectToDatabase();

    const query: any = { status: 'active', is_approved: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).limit(50).lean();

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Search results',
      data: products.map((p: any) => ({
        id: p.product_id || String(p._id),
        _id: String(p._id),
        name: p.name,
        slug: p.slug,
        image: p.image || '',
        rating: p.rating || 0,
        price: p.variants?.[0]?.price || 0,
        discounted_price: p.variants?.[0]?.discounted_price || 0,
        unit: p.variants?.[0]?.unit || 'pcs',
        stock: p.variants?.[0]?.stock || 0,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, result: 'false', message: error.message }, { status: 500 });
  }
}
