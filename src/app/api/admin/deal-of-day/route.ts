import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// GET all products with deal_of_the_day flag
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const dealsOnly = searchParams.get('deals_only') === 'true';

    const query: any = { status: 'active', is_approved: true };
    if (dealsOnly) query.is_deal_of_the_day = true;

    const products = await Product.find(query)
      .sort({ is_deal_of_the_day: -1, createdAt: -1 })
      .select('product_id name image is_deal_of_the_day category rating variants status')
      .lean();

    return NextResponse.json({ success: true, data: products, count: products.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT — toggle deal of the day for a product
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { product_id, id, _id, is_deal_of_the_day } = body;

    // Accept product by MongoDB _id or numeric product_id
    let filter: any = {};
    if (_id || id) {
      filter._id = _id || id;
    } else if (product_id !== undefined) {
      filter.product_id = Number(product_id);
    } else {
      return NextResponse.json({ success: false, message: 'product_id or _id required' }, { status: 400 });
    }

    const updated = await Product.findOneAndUpdate(
      filter,
      { is_deal_of_the_day: Boolean(is_deal_of_the_day) },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Product ${updated.is_deal_of_the_day ? 'added to' : 'removed from'} Deal of the Day`,
      data: { product_id: updated.product_id, name: updated.name, is_deal_of_the_day: updated.is_deal_of_the_day },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
