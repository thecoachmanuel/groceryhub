import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const banners = await Banner.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: banners, count: banners.length });
  } catch (err) {
    console.error('GET /api/admin/banners:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    if (!body.title || !body.image) {
      return NextResponse.json({ success: false, message: 'title and image are required' }, { status: 400 });
    }
    const banner = await Banner.create(body);
    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { bannerId, ...updates } = body;
    if (!bannerId) return NextResponse.json({ success: false, message: 'bannerId required' }, { status: 400 });
    const updated = await Banner.findByIdAndUpdate(bannerId, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { bannerId } = await req.json();
    if (!bannerId) return NextResponse.json({ success: false, message: 'bannerId required' }, { status: 400 });
    await Banner.findByIdAndDelete(bannerId);
    return NextResponse.json({ success: true, message: 'Banner deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
