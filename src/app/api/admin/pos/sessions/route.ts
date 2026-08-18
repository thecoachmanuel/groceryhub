import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PosCartSession from '@/models/PosCartSession';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('seller_id');
    let query: any = {};
    if (sellerId) query.seller_id = Number(sellerId);
    const sessions = await PosCartSession.find(query).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, sessions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { session_id, terminal_name, seller_id, customer_name, customer_mobile, items, applied_discount, discount_type, notes } = body;

    const session = await PosCartSession.findOneAndUpdate(
      { session_id },
      { terminal_name, seller_id, customer_name, customer_mobile, items, applied_discount, discount_type, notes },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    if (!sessionId) return NextResponse.json({ success: false, message: 'session_id required' }, { status: 400 });
    await PosCartSession.deleteOne({ session_id: sessionId });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
