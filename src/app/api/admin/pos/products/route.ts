import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('seller_id');
    const keyword = searchParams.get('keyword');

    let query: any = {};
    if (sellerId && sellerId !== 'all') {
      const parsed = parseInt(sellerId, 10);
      query.seller_id = isNaN(parsed) ? sellerId : parsed;
    }
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { barcode: { $regex: keyword, $options: 'i' } },
      ];
    }

    const rawProducts = await Product.find(query).sort({ createdAt: -1 }).lean();

    const mappedProducts = rawProducts.map((p: any) => {
      const variants: any[] = Array.isArray(p.variants) ? p.variants : [];
      const firstVariant = variants[0] || {};
      const regPrice = firstVariant.price ?? p.price ?? 0;
      const salePrice = firstVariant.discounted_price ?? firstVariant.price ?? p.price ?? 0;
      const totalStock = variants.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0);

      return {
        _id: String(p._id),
        product_id: p.product_id || p.id,
        seller_id: p.seller_id || 1,
        name: p.name || 'Grocery Product',
        category_name: p.category || 'Vegetables',
        price: regPrice,
        special_price: salePrice,
        stock: totalStock,
        barcode: firstVariant.barcode || p.barcode || '',
        image: p.image || '',
      };
    });

    return NextResponse.json({ success: true, data: mappedProducts, products: mappedProducts });
  } catch (error: any) {
    console.error('POS products API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
