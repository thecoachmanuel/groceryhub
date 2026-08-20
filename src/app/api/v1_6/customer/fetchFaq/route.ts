import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SystemSettings from '@/models/SystemSettings';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const settings = await SystemSettings.findOne().lean<any>();
    const faqItems = settings?.faqItems || [];

    const formatted = faqItems.map((f: any, index: number) => ({
      id: index + 1,
      question: f.q,
      answer: f.a,
      q: f.q,
      a: f.a,
    }));

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'FAQ fetched',
      data: formatted,
    });
  } catch (error: any) {
    console.error('fetchFaq error:', error);
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'FAQ fetched',
      data: [
        { id: 1, question: 'How fast is GroceryHub delivery?', answer: 'We deliver in 30 minutes or less via our hyper-local farm hubs in Lagos.' },
        { id: 2, question: 'Are products fresh?', answer: 'Yes — all produce is harvested daily from certified organic farms and quality-checked before dispatch.' },
        { id: 3, question: 'How do I return an item?', answer: 'Go to My Orders, select the item, and tap "Request Return/Refund". Instant wallet credit within 24hrs.' },
      ],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
