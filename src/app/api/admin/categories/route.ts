import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  { name: 'Vegetables', slug: 'vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300', is_featured: true, status: 'Active', category_id: 1, row_order: 1 },
  { name: 'Fruits', slug: 'fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300', is_featured: true, status: 'Active', category_id: 2, row_order: 2 },
  { name: 'Dairy & Eggs', slug: 'dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300', is_featured: true, status: 'Active', category_id: 3, row_order: 3 },
  { name: 'Bakery & Breads', slug: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', is_featured: true, status: 'Active', category_id: 4, row_order: 4 },
  { name: 'Beverages & Juices', slug: 'beverages', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=300', is_featured: true, status: 'Active', category_id: 5, row_order: 5 },
  { name: 'Snacks & Munchies', slug: 'snacks', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300', is_featured: true, status: 'Active', category_id: 6, row_order: 6 },
  { name: 'Pantry Staples', slug: 'pantry', image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=300', is_featured: true, status: 'Active', category_id: 7, row_order: 7 },
];

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    let categories = await Category.find().sort({ row_order: 1, createdAt: -1 }).lean();

    if (!categories || categories.length === 0) {
      const created = await Category.insertMany(DEFAULT_CATEGORIES);
      categories = created.map((c) => c.toObject());
    }

    return NextResponse.json({ success: true, data: categories, count: categories.length });
  } catch (err) {
    console.error('GET /api/admin/categories:', err);
    return NextResponse.json({ success: true, data: DEFAULT_CATEGORIES, count: DEFAULT_CATEGORIES.length });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    if (!body.slug) {
      body.slug = body.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `cat-${Date.now()}`;
    }
    if (!body.category_id) {
      body.category_id = Date.now();
    }
    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { categoryId, id, ...updates } = body;
    const targetId = categoryId || id;
    if (!targetId) return NextResponse.json({ success: false, message: 'categoryId required' }, { status: 400 });

    const updated = await Category.findByIdAndUpdate(targetId, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { categoryId, id } = body;
    const targetId = categoryId || id;
    if (!targetId) return NextResponse.json({ success: false, message: 'categoryId required' }, { status: 400 });
    await Category.findByIdAndDelete(targetId);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
