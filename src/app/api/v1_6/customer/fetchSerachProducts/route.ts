import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { search, search_text, keyword } = body;
    const searchTerm = search || search_text || keyword;

    await connectToDatabase();

    const query: any = { status: 'active', is_approved: true };
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).limit(50).lean();

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Search results',
      data: products.map((p: any) => ({
        id: p.product_id || String(p._id),
        product_id: p.product_id || String(p._id),
        _id: String(p._id),
        name: p.name,
        slug: p.slug || '',
        image: p.image || '',
        rating: p.rating || 0,
        rating_count: p.rating_count || 0,
        price: p.variants?.[0]?.price || 0,
        discounted_price: p.variants?.[0]?.discounted_price || p.variants?.[0]?.price || 0,
        original_price: p.variants?.[0]?.price || 0,
        unit: p.variants?.[0]?.unit || 'pcs',
        category_id: p.category_id,
        seller_id: p.seller_id,
        stock: p.variants?.[0]?.stock || 0,
        variants: (p.variants || []).map((v: any) => ({
          id: v.variant_id || String(v._id || Math.random()),
          variant_id: v.variant_id || String(v._id),
          title: v.title || v.size || '1 Unit',
          price: v.price || 0,
          discounted_price: v.discounted_price || v.price || 0,
          unit: v.unit || 'pcs',
          stock: v.stock ?? 100,
          cart_quantity: 0,
        })),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Search results',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
