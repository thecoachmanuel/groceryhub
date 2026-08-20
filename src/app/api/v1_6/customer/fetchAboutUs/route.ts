import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const page = await Page.findOne({ slug: 'about-us' }).lean().catch(() => null);

    const defaultHtml = `
      <div style="font-family: sans-serif; padding: 16px; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #16a34a; font-size: 22px;">Welcome to GroceryHub Nigeria</h2>
        <p>GroceryHub is Nigeria's leading farm-to-table digital grocery marketplace. We bring fresh, organic produce, farm dairy, bakery essentials, and household goods straight from local African farms to your doorstep in 30 minutes.</p>
        <h3 style="color: #0f172a; margin-top: 20px;">Our Promise</h3>
        <ul>
          <li><strong>100% Farm Fresh Guarantee:</strong> Handpicked daily directly from verified organic farms in Lagos & Ogun state.</li>
          <li><strong>Cold Chain Delivery:</strong> Temperature-controlled delivery fleet ensuring maximum freshness.</li>
          <li><strong>Fast 30-Minute Dispatch:</strong> Rapid order fulfillment from neighborhood micro-hubs.</li>
        </ul>
      </div>
    `;

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'About us fetched',
      data: page?.content || defaultHtml,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      data: `<div><h2>About GroceryHub</h2><p>Farm fresh groceries delivered fast across Nigeria.</p></div>`,
    });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
