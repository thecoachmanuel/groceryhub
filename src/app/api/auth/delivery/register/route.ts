import { NextRequest } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import DeliveryBoy from '@/models/DeliveryBoy';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, mobile, email, password, vehicle_type, license_number, city } = body;

    if (!name || !mobile || !password) {
      return apiError('Name, mobile phone number, and password are required', 400);
    }

    const cleanMobile = mobile.trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    await connectToDatabase();

    const existing = await DeliveryBoy.findOne({ mobile: cleanMobile });
    if (existing) {
      return apiError('A courier account with this mobile number already exists. Please log in.', 409);
    }

    const hashedPassword = await hashPassword(password);
    const deliveryBoyId = Date.now();

    const newRider = await DeliveryBoy.create({
      delivery_boy_id: deliveryBoyId,
      name: name.trim(),
      mobile: cleanMobile,
      email: cleanEmail,
      password: hashedPassword,
      vehicle_type: vehicle_type || 'Motorcycle / Scooter',
      license_number: license_number || '',
      city: city || 'Lagos',
      trip_bonus: 500.00, // ₦500 / trip
      balance: 0,
      cash_in_hand: 0,
      status: 'on_duty',
    });

    const token = generateToken({
      id: newRider.delivery_boy_id,
      role: 'delivery',
      mobile: newRider.mobile,
      email: newRider.email,
    });

    return apiSuccess(
      {
        token,
        delivery_boy: {
          id: newRider.delivery_boy_id,
          name: newRider.name,
          mobile: newRider.mobile,
          vehicle: newRider.vehicle_type,
          licenseNo: newRider.license_number,
          tripBonus: newRider.trip_bonus,
          balance: newRider.balance,
          cashInHand: newRider.cash_in_hand,
          status: newRider.status,
        },
      },
      'Delivery partner registered successfully!'
    );
  } catch (error: any) {
    console.error('Delivery registration error:', error);
    return apiError(error?.message || 'Delivery registration failed', 500);
  }
}
