import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { extractRequestId, buildIdFilter } from '@/lib/mongoose-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
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
    const body = await req.json().catch(() => ({}));
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
    const { id, body } = await extractRequestId(req, ['bannerId', 'id', '_id', 'banner_id']);
    if (!id) return NextResponse.json({ success: false, message: 'bannerId required' }, { status: 400 });

    const filter = buildIdFilter(id, 'banner_id');
    const { bannerId, id: _i, _id, ...updates } = body;

    const updated = await Banner.findOneAndUpdate(filter, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await extractRequestId(req, ['bannerId', 'id', '_id', 'banner_id']);
    if (!id) return NextResponse.json({ success: false, message: 'bannerId required' }, { status: 400 });

    const filter = buildIdFilter(id, 'banner_id');
    await Banner.findOneAndDelete(filter);
    return NextResponse.json({ success: true, message: 'Banner deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
