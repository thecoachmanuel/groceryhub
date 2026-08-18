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

    // Generate JWT token
    const token = generateToken({
      id: 1,
      role: 'seller',
      mobile,
    });

    return apiSuccess(
      {
        token,
        seller: {
          id: 1,
          name: 'Green Valley Organic Farms',
          store_name: 'Green Valley Store #104',
          mobile,
          status: 1,
          balance: 1420.50,
        },
      },
      'Seller logged in successfully'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Login failed', 500);
  }
}
