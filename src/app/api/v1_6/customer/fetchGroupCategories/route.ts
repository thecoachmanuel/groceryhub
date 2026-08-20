import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const categories = await Category.find({ status: 'Active' })
      .sort({ sort_order: 1 })
      .lean<any[]>();

    const formattedCategories = categories.map((c: any) => ({
      id: c.category_id || String(c._id),
      category_id: c.category_id || String(c._id),
      name: c.name,
      category_name: c.name,
      slug: c.slug || '',
      image: c.icon || c.image || '',
      category_img: c.icon || c.image || '',
      parent_id: c.parent_id || 0,
    }));

    // Group categories under section titles
    const groupData = [
      {
        id: 1,
        title: 'All Categories',
        categories: formattedCategories,
      },
    ];

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Group categories fetched successfully',
      data: groupData,
    });
  } catch (error: any) {
    console.error('fetchGroupCategories error:', error);
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Group categories fetched',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
