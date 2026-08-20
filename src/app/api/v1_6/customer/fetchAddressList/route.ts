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
      return NextResponse.json({ status: 'success', code: 200, result: 'true', data: [] });
    }

    const addresses = await Address.find({ user_id: userId }).sort({ is_default: -1 }).lean<any[]>();

    const formatted = addresses.map((a: any, idx: number) => ({
      id: String(a._id),
      address_id: String(a._id),
      address_type: a.address_type || 'Home',
      user_name: a.user_name || '',
      user_mobile: a.user_mobile || '',
      flat: a.flat || '',
      floor: a.floor || '',
      address: a.address || '',
      city: a.city || 'Lagos',
      state: a.state || '',
      landmark: a.landmark || '',
      latitude: a.latitude || 0,
      longitude: a.longitude || 0,
      is_default: a.is_default || 0,
    }));

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Addresses fetched successfully',
      data: formatted,
    });
  } catch (error: any) {
    console.error('fetchAddressList error:', error);
    return NextResponse.json({ status: 'success', code: 200, result: 'true', data: [] });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
