import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      category_id,
      seller_id,
      brand_id,
      search,
      keyword,
      sort_by = 'createdAt',
      sort_order = 'desc',
      page = 1,
      limit = 20,
    } = body;

    await connectToDatabase();

    const query: any = { status: 'active', is_approved: true };
    if (category_id) query.category_id = Number(category_id);
    if (seller_id) query.seller_id = Number(seller_id);
    if (brand_id) query.brand_id = Number(brand_id);
    const searchTerm = search || keyword;
    if (searchTerm) query.name = { $regex: searchTerm, $options: 'i' };

    const sortOptions: any = {};
    if (sort_by === 'price_asc') {
      sortOptions['variants.0.price'] = 1;
    } else if (sort_by === 'price_desc') {
      sortOptions['variants.0.price'] = -1;
    } else if (sort_by === 'rating') {
      sortOptions.rating = -1;
    } else {
      sortOptions.createdAt = sort_order === 'asc' ? 1 : -1;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);

    const formatProduct = (p: any) => ({
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
    });

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Products fetched',
      total,
      page: Number(page),
      data: products.map(formatProduct),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Products fetched',
      total: 0,
      page: 1,
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
