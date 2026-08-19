import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Seller from '@/models/Seller';
import { extractRequestId, buildIdFilter } from '@/lib/mongoose-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const sellers = await Seller.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: sellers, count: sellers.length });
  } catch (err) {
    console.error('GET /api/admin/sellers:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const count = await Seller.countDocuments();
    const seller = await Seller.create({ ...body, seller_id: count + 1 });
    return NextResponse.json({ success: true, data: seller }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, body } = await extractRequestId(req, ['sellerId', 'id', '_id', 'seller_id']);
    if (!id) return NextResponse.json({ success: false, message: 'sellerId required' }, { status: 400 });

    const filter = buildIdFilter(id, 'seller_id');
    const { sellerId, id: _i, _id, ...updates } = body;

    const updated = await Seller.findOneAndUpdate(filter, { $set: updates }, { new: true }).select('-password');
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await extractRequestId(req, ['sellerId', 'id', '_id', 'seller_id']);
    if (!id) return NextResponse.json({ success: false, message: 'sellerId required' }, { status: 400 });

    const filter = buildIdFilter(id, 'seller_id');
    await Seller.findOneAndDelete(filter);
    return NextResponse.json({ success: true, message: 'Seller deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
