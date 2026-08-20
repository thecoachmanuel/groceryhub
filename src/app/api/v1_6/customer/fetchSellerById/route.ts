import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Seller from '@/models/Seller';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { seller_id } = body;

    if (!seller_id) {
      return NextResponse.json(
        { status: 400, result: 'false', message: 'seller_id is required' },
        { status: 400 }
      );
    }

    const seller = await Seller.findOne({ seller_id: Number(seller_id) }).lean<any>();

    if (!seller) {
      return NextResponse.json(
        { status: 404, result: 'false', message: 'Seller not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Seller fetched successfully',
      data: {
        seller_id: seller.seller_id,
        name: seller.name || seller.store_name,
        store_name: seller.store_name || seller.name,
        logo: seller.logo || seller.profile_pic || '',
        banner: seller.banner_image || '',
        rating: seller.rating || 4.5,
        rating_count: seller.rating_count || 0,
        address: seller.address || '',
        city: seller.city || '',
        is_open: seller.is_open ?? true,
        minimum_order_amount: seller.minimum_order_amount || 500,
        delivery_charge: seller.delivery_charge || 0,
        description: seller.description || '',
      },
    });
  } catch (error: any) {
    console.error('fetchSellerById error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
