import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { mobile, password } = body;

    if (!mobile || !password) {
      return apiError('Mobile and password are required', 400);
    }

    const token = generateToken({
      id: 1,
      role: 'delivery',
      mobile,
    });

    return apiSuccess(
      {
        token,
        delivery_boy: {
          id: 1,
          name: 'Marcus Vance',
          mobile,
          vehicle: 'White Honda Scooter (NY-8429)',
          is_available: 1,
          status: 1,
        },
      },
      'Delivery partner logged in successfully'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Login failed', 500);
  }
}
