import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Faq from '@/models/Faq';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const faqs = await Faq.find({ status: 'Active' })
      .sort({ createdAt: 1 })
      .lean<any[]>()
      .catch(() => []);

    const formatted = faqs.map((f: any) => ({
      id: String(f._id),
      question: f.question,
      answer: f.answer,
      category: f.category || 'General',
    }));

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'FAQs fetched successfully',
      data: formatted,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'FAQs fetched',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
