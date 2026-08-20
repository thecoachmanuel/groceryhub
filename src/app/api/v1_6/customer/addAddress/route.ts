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
      return NextResponse.json(
        { status: 'error', code: 401, result: 'false', message: 'Please log in to save addresses' },
        { status: 401 }
      );
    }

    const {
      address_type = 'Home',
      user_name = '',
      user_mobile = '',
      flat = '',
      floor = '',
      address = '',
      city = 'Lagos',
      state = 'Lagos State',
      landmark = '',
      latitude = 6.5244,
      longitude = 3.3792,
      is_default = 0,
    } = body;

    // If marking as default, clear previous default
    if (Number(is_default) === 1) {
      await Address.updateMany({ user_id: userId }, { is_default: 0 });
    }

    // Upsert: if body.address_id provided, update; otherwise create
    let savedAddress: any;
    if (body.address_id) {
      savedAddress = await Address.findByIdAndUpdate(
        body.address_id,
        { address_type, user_name, user_mobile, flat, floor, address, city, state, landmark, latitude, longitude, is_default },
        { new: true }
      );
    } else {
      savedAddress = await Address.create({
        user_id: userId,
        address_type,
        user_name,
        user_mobile,
        flat,
        floor,
        address,
        city,
        state,
        landmark,
        latitude,
        longitude,
        is_default,
      });
    }

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Address saved successfully',
      address_id: String(savedAddress._id),
      data: savedAddress,
    });
  } catch (error: any) {
    console.error('addAddress error:', error);
    return NextResponse.json(
      { status: 'error', code: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
