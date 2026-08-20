import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Brand from '@/models/Brand';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const brands = await Brand.find({ status: 'Active' })
      .sort({ sort_order: 1 })
      .lean<any[]>()
      .catch(() => []);

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Brands fetched successfully',
      data: brands.map((b: any) => ({
        id: b.brand_id || String(b._id),
        brand_id: b.brand_id || String(b._id),
        name: b.name,
        slug: b.slug || '',
        logo: b.logo || b.image || '',
        sort_order: b.sort_order || 0,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Brands fetched',
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
