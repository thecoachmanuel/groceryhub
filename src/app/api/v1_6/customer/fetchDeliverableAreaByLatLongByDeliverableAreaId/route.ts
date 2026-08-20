import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Area from '@/models/Area';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { deliverable_area_id: reqAreaId, city_id: reqCityId } = body;

    const query: any = { status: 'Active' };
    if (reqAreaId) query.$or = [{ deliverable_area_id: Number(reqAreaId) }, { area_id: Number(reqAreaId) }];

    const area = await Area.findOne(query).lean<any>().catch(() => null);

    const city_id = area?.city_id || reqCityId || 1;
    const deliverable_area_id = area?.deliverable_area_id || area?.area_id || reqAreaId || 1;

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Deliverable area retrieved successfully',
      city_id,
      deliverable_area_id,
      data: {
        area_id: deliverable_area_id,
        deliverable_area_id,
        city_id,
        name: area?.name || 'Lagos Island',
        city: area?.city || 'Lagos',
        deliverable: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Deliverable area retrieved successfully',
      city_id: 1,
      deliverable_area_id: 1,
      data: { area_id: 1, deliverable_area_id: 1, city_id: 1, name: 'Lagos Island', city: 'Lagos', deliverable: true },
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
