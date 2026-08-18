import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Brand from '@/models/Brand';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const brands = await Brand.find().sort({ row_order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: brands, count: brands.length });
  } catch (err) {
    console.error('GET /api/admin/brands:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    if (!body.slug) {
      body.slug = body.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `brand-${Date.now()}`;
    }
    const count = await Brand.countDocuments();
    const brand = await Brand.create({ ...body, brand_id: count + 1 });
    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { brandId, ...updates } = body;
    if (!brandId) return NextResponse.json({ success: false, message: 'brandId required' }, { status: 400 });
    const updated = await Brand.findByIdAndUpdate(brandId, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { brandId } = await req.json();
    if (!brandId) return NextResponse.json({ success: false, message: 'brandId required' }, { status: 400 });
    await Brand.findByIdAndDelete(brandId);
    return NextResponse.json({ success: true, message: 'Brand deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
