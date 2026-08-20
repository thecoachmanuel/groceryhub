import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Faq from '@/models/Faq';
import SystemSettings from '@/models/SystemSettings';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Try fetching from Faq collection first
    let dbFaqs = await Faq.find({ status: { $ne: 'Inactive' } })
      .sort({ createdAt: -1 })
      .lean<any[]>()
      .catch(() => []);

    // If Faq collection is empty, check SystemSettings.faqItems
    if (dbFaqs.length === 0) {
      const settings = await SystemSettings.findOne().lean<any>();
      dbFaqs = settings?.faqItems || [];
    }

    const formatted = dbFaqs.map((f: any, index: number) => ({
      id: f.faq_id || index + 1,
      _id: String(f._id || index + 1),
      question: f.question || f.q || 'Question',
      answer: f.answer || f.a || 'Answer',
      q: f.question || f.q || 'Question',
      a: f.answer || f.a || 'Answer',
      title: f.question || f.q || 'Question',
      content: f.answer || f.a || 'Answer',
    }));

    // Fallbacks if empty
    const defaults = [
      { id: 1, question: 'How fast is GroceryHub delivery?', answer: 'We deliver in 30 minutes or less via our hyper-local farm hubs in Lagos.', q: 'How fast is GroceryHub delivery?', a: 'We deliver in 30 minutes or less via our hyper-local farm hubs in Lagos.' },
      { id: 2, question: 'Are products fresh & organic?', answer: 'Yes — all produce is harvested daily from certified organic farms and quality-checked before dispatch.', q: 'Are products fresh & organic?', a: 'Yes — all produce is harvested daily from certified organic farms and quality-checked before dispatch.' },
      { id: 3, question: 'How do I return an item?', answer: 'Go to My Orders in the app menu, select the item, and tap Request Refund within 24 hours of delivery.', q: 'How do I return an item?', a: 'Go to My Orders in the app menu, select the item, and tap Request Refund within 24 hours of delivery.' },
    ];

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'FAQ fetched successfully',
      data: formatted.length > 0 ? formatted : defaults,
    });
  } catch (error: any) {
    console.error('fetchFaq error:', error);
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'FAQ fetched',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
