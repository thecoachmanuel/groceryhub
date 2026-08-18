import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ProductRating from '@/models/ProductRating';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const reviews = await ProductRating.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: reviews, count: reviews.length });
  } catch (err) {
    console.error('GET /api/admin/feedback:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { reviewId } = await req.json();
    if (!reviewId) return NextResponse.json({ success: false, message: 'reviewId required' }, { status: 400 });
    await ProductRating.findByIdAndDelete(reviewId);
    return NextResponse.json({ success: true, message: 'Review removed' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
