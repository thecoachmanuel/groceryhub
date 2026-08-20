import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Address from '@/models/Address';
import { getUserIdFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    const authHeader = req.headers.get('authorization');
    const tokenUserId = getUserIdFromHeader(authHeader);
    const userId = Number(tokenUserId || body.user_id || 0);

    if (!userId) {
      return NextResponse.json({ status: 'success', code: 200, result: 'true', data: null });
    }

    // Get the default address, fallback to the most recent one
    const address = await Address.findOne({ user_id: userId, is_default: 1 }).lean<any>()
      || await Address.findOne({ user_id: userId }).sort({ createdAt: -1 }).lean<any>();

    if (!address) {
      return NextResponse.json({ status: 'success', code: 200, result: 'true', data: null });
    }

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Active address fetched',
      data: {
        id: String(address._id),
        address_id: String(address._id),
        address_type: address.address_type || 'Home',
        user_name: address.user_name || '',
        user_mobile: address.user_mobile || '',
        flat: address.flat || '',
        floor: address.floor || '',
        address: address.address || '',
        city: address.city || 'Lagos',
        state: address.state || '',
        landmark: address.landmark || '',
        latitude: address.latitude || 6.5244,
        longitude: address.longitude || 3.3792,
        is_default: address.is_default || 1,
        min_amount_for_free_delivery: 15000,
        delivery_charge: 500,
      },
    });
  } catch (error: any) {
    console.error('fetchActiveAddress error:', error);
    return NextResponse.json({ status: 'success', code: 200, result: 'true', data: null });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
