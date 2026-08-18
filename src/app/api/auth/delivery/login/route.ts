import { NextRequest } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import DeliveryBoy from '@/models/DeliveryBoy';
import { verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { mobile, password } = body;

    if (!mobile || !password) {
      return apiError('Mobile phone number and password are required', 400);
    }

    await connectToDatabase();

    const rider = await DeliveryBoy.findOne({ mobile: mobile.trim() }).select('+password');

    if (!rider) {
      return apiError('Courier partner account not found. Please register as a delivery rider first.', 404);
    }

    if (rider.status === 'suspended') {
      return apiError('Your courier account is suspended. Please contact fleet dispatch.', 403);
    }

    if (!rider.password) {
      return apiError('Password is not set for this account. Please reset your password.', 401);
    }

    const isMatch = await verifyPassword(password, rider.password);
    if (!isMatch) {
      return apiError('Invalid courier password. Please check your credentials and try again.', 401);
    }

    const token = generateToken({
      id: rider.delivery_boy_id,
      role: 'delivery',
      mobile: rider.mobile,
      email: rider.email,
    });

    return apiSuccess(
      {
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
      'Delivery partner authenticated successfully'
    );
  } catch (error: any) {
    console.error('Courier login error:', error);
    return apiError(error?.message || 'Login failed', 500);
  }
}
