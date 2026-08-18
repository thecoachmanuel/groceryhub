import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const requests = await Product.find({ is_approved: false }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, action } = body;
    if (action === 'approve') {
      const updated = await Product.findByIdAndUpdate(id, { is_approved: true, status: 'active' }, { new: true });
      return NextResponse.json({ success: true, data: updated });
    } else if (action === 'reject') {
      const updated = await Product.findByIdAndUpdate(id, { is_approved: false, status: 'hidden' }, { new: true });
      return NextResponse.json({ success: true, data: updated });
    }
    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
