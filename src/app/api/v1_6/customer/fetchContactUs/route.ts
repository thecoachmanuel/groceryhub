import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const page = await Page.findOne({ slug: 'contact-us' }).lean().catch(() => null);
    const meta = page?.meta_data || {};

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Contact us fetched',
      data: {
        business_name: meta.business_name || 'GroceryHub Nigeria Ltd',
        logo: meta.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
        phone: meta.phone || '+234 800 476 2379',
        email: meta.email || 'support@groceryhub.ng',
        address: meta.address || 'Plot 18, Agro Industrial Estate, Epe, Lagos',
        social_link: meta.social_link || [
          { link: 'https://instagram.com/groceryhub_ng', appIcon: 'logo-instagram' },
          { link: 'https://twitter.com/groceryhub_ng', appIcon: 'logo-twitter' },
          { link: 'https://facebook.com/groceryhubng', appIcon: 'logo-facebook' },
          { link: 'https://wa.me/2348004762379', appIcon: 'logo-whatsapp' },
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      data: {
        business_name: 'GroceryHub Nigeria Ltd',
        logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
        phone: '+234 800 476 2379',
        email: 'support@groceryhub.ng',
        social_link: [],
      },
    });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
