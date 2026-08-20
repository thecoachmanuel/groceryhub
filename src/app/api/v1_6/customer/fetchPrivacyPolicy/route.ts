import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const page = await Page.findOne({ slug: 'privacy-policy' }).lean().catch(() => null);

    const defaultHtml = `
      <div style="font-family: sans-serif; padding: 16px; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #16a34a; font-size: 22px;">GroceryHub Privacy Policy</h2>
        <p>At GroceryHub Nigeria, accessible from groceryhub-ng.vercel.app, your privacy is our top priority. We collect user name, mobile number, delivery address, and order history strictly to fulfill grocery orders and provide cold-chain delivery service.</p>
        <h3 style="color: #0f172a; margin-top: 20px;">Data Protection</h3>
        <p>We do not share or sell your personal data to third parties. All financial transactions are secured using SSL encryption via Paystack and secure banking partners.</p>
      </div>
    `;

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Privacy policy fetched',
      data: page?.content || defaultHtml,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      data: `<div><h2>Privacy Policy</h2><p>Your privacy and data security are guaranteed on GroceryHub.</p></div>`,
    });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
