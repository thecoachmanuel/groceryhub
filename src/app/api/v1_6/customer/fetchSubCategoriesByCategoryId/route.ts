import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { category_id } = body;

    const parentId = category_id ? Number(category_id) : null;
    const query: any = { status: 'Active' };
    if (parentId) query.parent_id = parentId;

    const subcategories = await Category.find(query)
      .sort({ sort_order: 1 })
      .lean<any[]>();

    const formattedList = (subcategories.length > 0 ? subcategories : [
      {
        id: 1,
        category_id: 1,
        name: 'All Items',
        subcategory_img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200',
      }
    ]).map((c: any) => ({
      id: c.category_id || String(c._id),
      name: c.name,
      subcategory_img: c.icon || c.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200',
      image: c.icon || c.image || '',
    }));

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Subcategories fetched successfully',
      data: formattedList,
      category: {
        is_it_have_warning: 0,
        warning_content: '',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Subcategories fetched',
      data: [
        {
          id: 1,
          name: 'All Items',
          subcategory_img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200',
        }
      ],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
