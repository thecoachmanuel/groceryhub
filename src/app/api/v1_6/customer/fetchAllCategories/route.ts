import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const categories = await Category.find({ status: 'Active' })
      .sort({ sort_order: 1 })
      .lean();

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Categories fetched',
      data: categories.map((c: any) => ({
        id: c.category_id || String(c._id),
        category_id: c.category_id || String(c._id),
        name: c.name,
        slug: c.slug,
        image: c.icon || c.image || '',
        parent_id: c.parent_id || 0,
        subcategories: [],
      })),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Categories fetched',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
