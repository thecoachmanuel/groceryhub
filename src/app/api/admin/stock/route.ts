import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const products = await Product.find()
      .select('name category stock current_stock available_quantity price')
      .sort({ name: 1 })
      .lean();
    return NextResponse.json({ success: true, data: products, count: products.length });
  } catch (err) {
    console.error('GET /api/admin/stock:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { productId, stock, current_stock } = body;
    if (!productId) return NextResponse.json({ success: false, message: 'productId required' }, { status: 400 });
    const updated = await Product.findByIdAndUpdate(
      productId,
      { $set: { stock, current_stock } },
      { new: true }
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
