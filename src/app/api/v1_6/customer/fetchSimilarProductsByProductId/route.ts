import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { product_id } = body;

    await connectToDatabase();

    let targetBrand: number | null = null;
    let targetCategory: number | null = null;
    let targetId: any = null;

    if (product_id) {
      const numId = Number(product_id);
      const isMongoId = typeof product_id === 'string' && mongoose.Types.ObjectId.isValid(product_id) && product_id.length === 24;

      let p: any = null;
      if (isMongoId) p = await Product.findById(product_id).lean();
      else if (!isNaN(numId)) p = await Product.findOne({ product_id: numId }).lean();

      if (p) {
        targetBrand = p.brand_id;
        targetCategory = p.category_id;
        targetId = p.product_id || p._id;
      }
    }

    const query: any = { status: 'active', is_approved: true };
    if (targetId != null) query.product_id = { $ne: targetId };
    if (targetCategory != null) query.category_id = targetCategory;

    let products = await Product.find(query).limit(10).lean<any[]>();

    if (products.length < 4) {
      delete query.category_id;
      products = await Product.find(query).limit(10).lean<any[]>();
    }

    const formatProduct = (p: any) => {
      const pid = p.product_id || String(p._id);
      return {
        id: pid,
        product_id: pid,
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
      };
    };

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Similar products fetched',
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
