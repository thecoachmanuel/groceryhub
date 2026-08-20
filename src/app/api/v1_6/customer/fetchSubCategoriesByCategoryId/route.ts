import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { category_id } = body;

    let subcategories: any[] = [];

    if (category_id) {
      // First try to find the parent category by category_id (numeric) or _id
      let parentDoc: any = null;

      // Try numeric category_id field first
      const numId = Number(category_id);
      if (!isNaN(numId) && numId > 0) {
        // Check if Category model has a numeric category_id field
        parentDoc = await Category.findOne({ category_id: numId }).lean().catch(() => null);
      }

      // Fallback to MongoDB ObjectId lookup
      if (!parentDoc && typeof category_id === 'string' && category_id.length === 24) {
        parentDoc = await Category.findById(category_id).lean().catch(() => null);
      }

      if (parentDoc) {
        // Find all categories whose parent_id equals this category's _id
        subcategories = await Category.find({
          parent_id: parentDoc._id,
          status: 'Active',
        }).sort({ row_order: 1 }).lean().catch(() => []);
      }

      // If no children found, return all sibling categories at same level
      if (!subcategories.length) {
        subcategories = await Category.find({
          status: 'Active',
          parent_id: null,
        }).sort({ row_order: 1 }).lean().catch(() => []);
      }
    } else {
      // No category_id — return all top-level categories
      subcategories = await Category.find({ status: 'Active', parent_id: null })
        .sort({ row_order: 1 }).lean().catch(() => []);
    }

    const formattedList = subcategories.map((c: any) => ({
      id: c.category_id ? Number(c.category_id) : String(c._id),
      _id: String(c._id),
      name: c.name,
      subcategory_name: c.name,
      subcategory_img: c.icon || c.image || '',
      image: c.icon || c.image || '',
      slug: c.slug || '',
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
    console.error('fetchSubCategoriesByCategoryId error:', error);
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Subcategories fetched',
      data: [],
      category: { is_it_have_warning: 0, warning_content: '' },
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
