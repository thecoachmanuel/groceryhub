import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ row_order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: categories, count: categories.length });
  } catch (err) {
    console.error('GET /api/admin/categories:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    if (!body.slug) {
      body.slug = body.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `cat-${Date.now()}`;
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
    const { categoryId, ...updates } = body;
    if (!categoryId) return NextResponse.json({ success: false, message: 'categoryId required' }, { status: 400 });
    const updated = await Category.findByIdAndUpdate(categoryId, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { categoryId } = await req.json();
    if (!categoryId) return NextResponse.json({ success: false, message: 'categoryId required' }, { status: 400 });
    await Category.findByIdAndDelete(categoryId);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
