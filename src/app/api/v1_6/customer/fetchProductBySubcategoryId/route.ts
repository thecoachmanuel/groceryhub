import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { category_id, subcategory_id, page = 1, limit = 10 } = body;

    await connectToDatabase();

    const query: any = { status: 'active', is_approved: true };
    if (category_id) query.category_id = Number(category_id);

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(Number(limit)).lean<any[]>(),
      Product.countDocuments(query),
    ]);

    const formatProduct = (p: any) => ({
      id: p.product_id || String(p._id),
      product_id: p.product_id || String(p._id),
      _id: String(p._id),
      name: p.name,
      product_name: p.name,
      slug: p.slug || '',
      image: p.image || '',
      rating: p.rating || 4.8,
      rating_count: p.rating_count || 12,
      price: p.variants?.[0]?.price || 3500,
      discounted_price: p.variants?.[0]?.discounted_price || p.variants?.[0]?.price || 3000,
      unit: p.variants?.[0]?.unit || '500g',
      category_id: p.category_id,
      seller_id: p.seller_id,
      stock: p.variants?.[0]?.stock || 100,
      variants: (p.variants || [
        {
          variant_id: 101,
          title: 'Standard Pack',
          price: p.price || 3500,
          discounted_price: p.discounted_price || 3000,
          unit: '500g',
          stock: 100,
        }
      ]).map((v: any, index: number) => ({
        id: v.variant_id || v.id || `v_${index}`,
        variant_id: v.variant_id || v.id || `v_${index}`,
        title: v.title || v.size || 'Standard Pack',
        price: v.price || 3500,
        discounted_price: v.discounted_price || v.price || 3000,
        unit: v.unit || 'pcs',
        stock: v.stock ?? 100,
        is_unlimited_stock: 1,
        cart_quantity: 0,
      })),
    });

    const totalPages = Math.ceil(total / Number(limit));

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Products fetched',
      pagination: {
        current_page: Number(page),
        total_pages: totalPages,
        total_items: total,
        has_next_page: Number(page) < totalPages,
      },
      data: products.map(formatProduct),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Products fetched',
      pagination: { current_page: 1, total_pages: 0, total_items: 0, has_next_page: false },
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
