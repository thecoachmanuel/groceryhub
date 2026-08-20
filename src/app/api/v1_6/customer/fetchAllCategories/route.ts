import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import GroupCategory from '@/models/GroupCategory';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Fetch all categories sorted by sort_order
    const allCategories = await Category.find({ status: 'Active' })
      .sort({ sort_order: 1, createdAt: 1 })
      .lean<any[]>();

    // Separate root categories (parent_id === 0 or undefined) from subcategories
    const rootCats = allCategories.filter(c => !c.parent_id || c.parent_id === 0);
    const subCats = allCategories.filter(c => c.parent_id && c.parent_id !== 0);

    // Build subcategory map by parent_id
    const subMap: Record<string, any[]> = {};
    subCats.forEach(sc => {
      const pid = String(sc.parent_id);
      if (!subMap[pid]) subMap[pid] = [];
      subMap[pid].push({
        id: sc.category_id || String(sc._id),
        subcategory_id: sc.category_id || String(sc._id),
        name: sc.name,
        slug: sc.slug || '',
        image: sc.icon || sc.image || '',
        category_id: sc.parent_id,
        sort_order: sc.sort_order || 0,
      });
    });

    // Attach subcategories to parents
    const formattedCategories = rootCats.map(c => ({
      id: c.category_id || String(c._id),
      category_id: c.category_id || String(c._id),
      name: c.name,
      slug: c.slug || '',
      image: c.icon || c.image || '',
      parent_id: 0,
      is_featured: c.is_featured || false,
      sort_order: c.sort_order || 0,
      subcategories: subMap[String(c.category_id || c._id)] || [],
    }));

    // Also fetch group categories for grouped display
    const groups = await GroupCategory.find({ status: 'Active' }).sort({ createdAt: 1 }).lean<any[]>();
    const groupedCategories = groups.map(g => ({
      group_id: String(g._id),
      group_name: g.name,
      icon: g.icon || 'Layers',
      categories: formattedCategories.filter(c =>
        Array.isArray(g.categories) && g.categories.includes(String(c.category_id))
      ),
    }));

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Categories fetched',
      data: formattedCategories,
      groups: groupedCategories,
    });
  } catch (error: any) {
    console.error('fetchAllCategories error:', error);
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Categories fetched',
      data: [],
      groups: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
