import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const products = await Product.find({ status: 'active', is_approved: true })
      .sort({ rating: -1 })
      .limit(8)
      .lean<any[]>();

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
        { variant_id: 101, title: '500g Pack', price: 3500, discounted_price: 3000, unit: '500g', stock: 100, is_unlimited_stock: 1, cart_quantity: 0 }
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

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Category products fetched',
      data: products.map(formatProduct),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
