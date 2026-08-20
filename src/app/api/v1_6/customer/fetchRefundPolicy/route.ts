import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const page = await Page.findOne({ slug: 'refund-policy' }).lean().catch(() => null);

    const defaultHtml = `
      <div style="font-family: sans-serif; padding: 16px; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #16a34a; font-size: 22px;">Refund Policy</h2>
        <p>If you receive damaged, expired, or missing produce, we offer 100% instant refunds directly to your GroceryHub wallet or original payment method.</p>
      </div>
    `;

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Refund policy fetched',
      data: page?.content || defaultHtml,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      data: `<div><h2>Refund Policy</h2><p>100% money back guarantee on unsatisfactory items.</p></div>`,
    });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
