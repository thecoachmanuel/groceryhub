import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { product_id } = body;

    if (!product_id) {
      return NextResponse.json({
        status: 'success',
        result: 'true',
        data: [],
      });
    }

    const product = await Product.findOne({ product_id: Number(product_id) }).lean<any>();

    if (!product) {
      return NextResponse.json({
        status: 'success',
        result: 'true',
        data: [],
      });
    }

    const variants = (product.variants || []).map((v: any) => ({
      id: v.variant_id || String(v._id),
      variant_id: v.variant_id || String(v._id),
      product_id: product.product_id || String(product._id),
      title: v.title || v.size || '1 Unit',
      price: v.price || 0,
      discounted_price: v.discounted_price || v.price || 0,
      unit: v.unit || 'pcs',
      stock: v.stock ?? 100,
      sku: v.sku || '',
      weight: v.weight || '',
      cart_quantity: 0,
    }));

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Product variants fetched',
      data: variants,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Product variants fetched',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
