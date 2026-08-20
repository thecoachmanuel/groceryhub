import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const page = await Page.findOne({ slug: 'terms-conditions' }).lean().catch(() => null);

    const defaultHtml = `
      <div style="font-family: sans-serif; padding: 16px; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #16a34a; font-size: 22px;">Terms & Conditions</h2>
        <p>These terms and conditions outline the rules for using GroceryHub Nigeria's mobile application and website.</p>
        <h3 style="color: #0f172a; margin-top: 20px;">Order Fulfillment & Delivery</h3>
        <p>GroceryHub guarantees product quality upon delivery. Orders may be cancelled prior to dispatch with instant wallet refund.</p>
      </div>
    `;

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Terms & conditions fetched',
      data: page?.content || defaultHtml,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      data: `<div><h2>Terms & Conditions</h2><p>Usage of GroceryHub platform is subject to standard terms of service.</p></div>`,
    });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
