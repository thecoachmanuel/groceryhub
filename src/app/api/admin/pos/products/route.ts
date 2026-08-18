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

    let query: any = { status: 1 };
    if (sellerId) {
      query.seller_id = Number(sellerId);
    }
    if (keyword) {
      query.$or = [
        { product_name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { barcode: { $regex: keyword, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ popular: -1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
