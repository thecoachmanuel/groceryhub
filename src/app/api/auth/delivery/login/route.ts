import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import DeliveryBoy from '@/models/DeliveryBoy';
import { verifyPassword, normalizePhone, getLocalPhone } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { mobile, password } = body;

    const rawInput = (mobile || '').trim();
    if (!rawInput || !password) {
      return NextResponse.json(
        { success: false, message: 'Mobile phone number and password are required' },
        { status: 400 }
      );
    }

    const normPhone = normalizePhone(rawInput);
    const localPhone = getLocalPhone(rawInput);

    await connectToDatabase();

    const rider = await DeliveryBoy.findOne({
      $or: [
        { mobile: rawInput },
        { mobile: normPhone },
        { mobile: localPhone },
      ],
    }).select('+password');

    if (!rider) {
      return NextResponse.json(
        { success: false, message: 'Courier partner account not found. Please register as a delivery rider first.' },
        { status: 404 }
      );
    }

    if (rider.status === 'suspended') {
      return NextResponse.json(
        { success: false, message: 'Your courier account is suspended. Please contact fleet dispatch.' },
        { status: 403 }
      );
    }

    if (!rider.password) {
      return NextResponse.json(
        { success: false, message: 'Password is not set for this account. Please reset your password.' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, rider.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid courier password. Please check your credentials and try again.' },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: rider.delivery_boy_id,
      role: 'delivery',
      mobile: rider.mobile,
      email: rider.email,
    });

    const res = NextResponse.json({
      success: true,
      message: 'Delivery partner authenticated successfully',
      data: {
        token,
        delivery_boy: {
          id: rider.delivery_boy_id,
          name: rider.name,
          mobile: rider.mobile,
          vehicle: rider.vehicle_type,
          licenseNo: rider.license_number,
          tripBonus: rider.trip_bonus,
          balance: rider.balance,
          cashInHand: rider.cash_in_hand,
          status: rider.status,
        },
      },
    });

    // Set HTTP Cookies on Response Header
    res.cookies.set('auth_token', token, { path: '/', maxAge: 604800, sameSite: 'lax' });
    res.cookies.set('user_role', 'delivery', { path: '/', maxAge: 604800, sameSite: 'lax' });

    return res;
  } catch (error: any) {
    console.error('Courier login error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
