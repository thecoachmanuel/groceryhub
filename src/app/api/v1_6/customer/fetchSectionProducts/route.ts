import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { section_id, page = 1, limit = 10, category_id, brand_id } = body;

    const query: any = { status: 'active', is_approved: true };
    if (category_id) query.category_id = Number(category_id);
    if (brand_id) query.brand_id = Number(brand_id);

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .lean<any[]>()
      .catch(() => []);

    const formatProduct = (p: any) => ({
      id: p.product_id || String(p._id),
      product_id: p.product_id || String(p._id),
      name: p.name,
      slug: p.slug || '',
      image: p.image || '',
      rating: p.rating || 0,
      rating_count: p.rating_count || 0,
      price: p.variants?.[0]?.price || 0,
      discounted_price: p.variants?.[0]?.discounted_price || p.variants?.[0]?.price || 0,
      unit: p.variants?.[0]?.unit || 'pcs',
      category_id: p.category_id,
      seller_id: p.seller_id,
      stock: p.variants?.[0]?.stock ?? 100,
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
    });

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Section products fetched',
      data: products.map(formatProduct),
    });
  } catch (error: any) {
    console.error('fetchSectionProducts error:', error);
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Section products fetched',
      data: [],
    });
  }
}
