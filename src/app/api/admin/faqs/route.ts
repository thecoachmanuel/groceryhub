import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Faq from '@/models/Faq';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const faqs = await Faq.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newFaq = await Faq.create(body);
    return NextResponse.json({ success: true, data: newFaq });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updateData } = body;
    const updated = await Faq.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    await Faq.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
