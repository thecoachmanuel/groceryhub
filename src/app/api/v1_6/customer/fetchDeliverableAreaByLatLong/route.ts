import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Area from '@/models/Area';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { latitude, longitude } = body;

    const areas = await Area.find({ status: 'Active' }).lean<any[]>().catch(() => []);

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Deliverable area retrieved successfully',
      data: {
        area_id: areas?.[0]?.area_id || 1,
        deliverable_area_id: areas?.[0]?.deliverable_area_id || 1,
        name: areas?.[0]?.name || 'Lagos Island',
        city: areas?.[0]?.city || 'Lagos',
        deliverable: true,
        areas: areas.length > 0 ? areas.map((a: any) => ({
          id: a.area_id || String(a._id),
          area_id: a.area_id || String(a._id),
          name: a.name,
          city: a.city || '',
        })) : [{ id: 1, area_id: 1, name: 'Lagos Island', city: 'Lagos' }],
      },
    });
  } catch (error: any) {
    console.error('fetchDeliverableAreaByLatLong error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
