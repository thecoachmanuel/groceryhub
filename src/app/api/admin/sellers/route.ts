import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Seller from '@/models/Seller';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
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
    const body = await req.json();
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
    const body = await req.json();
    const { sellerId, ...updates } = body;
    if (!sellerId) return NextResponse.json({ success: false, message: 'sellerId required' }, { status: 400 });
    const updated = await Seller.findByIdAndUpdate(sellerId, { $set: updates }, { new: true }).select('-password');
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { sellerId } = await req.json();
    if (!sellerId) return NextResponse.json({ success: false, message: 'sellerId required' }, { status: 400 });
    await Seller.findByIdAndDelete(sellerId);
    return NextResponse.json({ success: true, message: 'Seller deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
