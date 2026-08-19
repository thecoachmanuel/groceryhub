import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Tax from '@/models/Tax';
import { extractRequestId, buildIdFilter } from '@/lib/mongoose-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const items = await Tax.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const created = await Tax.create(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, body } = await extractRequestId(req, ['id', '_id', 'taxId']);
    if (!id) return NextResponse.json({ success: false, message: 'id required' }, { status: 400 });

    const filter = buildIdFilter(id);
    const { id: _i, _id, taxId, ...updateData } = body;
    const updated = await Tax.findOneAndUpdate(filter, { $set: updateData }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await extractRequestId(req, ['id', '_id', 'taxId']);
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    const filter = buildIdFilter(id);
    await Tax.findOneAndDelete(filter);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
