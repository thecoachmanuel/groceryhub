import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { product_varient_id, product_id } = body;

    await connectToDatabase();

    let product: any = null;
    if (product_id) {
      product = await Product.findOne({
        $or: [
          { _id: product_id },
          { product_id: Number(product_id) || 0 },
        ],
      }).lean();
    }

    if (!product && product_varient_id) {
      product = await Product.findOne({
        'variants.variant_id': Number(product_varient_id) || product_varient_id,
      }).lean();
    }

    const realImages: string[] = [
      product?.image,
      ...(product?.additional_images || []),
    ].filter(Boolean);

    const variant = product?.variants?.find(
      (v: any) => String(v.variant_id || v.id) === String(product_varient_id)
    ) || product?.variants?.[0];

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Variant details fetched',
      data: {
        id: variant?.variant_id || product_varient_id || '101',
        variant_id: variant?.variant_id || product_varient_id || 101,
        title: variant?.title || variant?.size || 'Standard Pack',
        price: variant?.price || product?.price || 3500,
        discounted_price: variant?.discounted_price || product?.discounted_price || 3000,
        unit: variant?.unit || product?.unit || '500g',
        stock: variant?.stock ?? 100,
        is_unlimited_stock: variant?.is_unlimited_stock ?? 1,
        cart_quantity: 0,
        images: realImages.length > 0 ? realImages : (product?.image ? [product.image] : []),
        image: product?.image || '',
        main_img: product?.image || '',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      data: {},
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
