import { NextRequest } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import Seller from '@/models/Seller';
import { verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, mobile, password } = body;

    const identifier = (email || mobile || '').trim().toLowerCase();
    if (!identifier || !password) {
      return apiError('Email/Mobile and password are required', 400);
    }

    await connectToDatabase();

    const seller = await Seller.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    }).select('+password');

    if (!seller) {
      return apiError('Vendor account not found. Please register as a vendor partner first.', 404);
    }

    if (seller.status === 'suspended' || seller.status === 'rejected') {
      return apiError(`Your vendor account status is '${seller.status}'. Please contact vendor support.`, 403);
    }

    if (!seller.password) {
      return apiError('Password is not configured for this account. Please reset your password.', 401);
    }

    const isMatch = await verifyPassword(password, seller.password);
    if (!isMatch) {
      return apiError('Invalid vendor password. Please check your credentials and try again.', 401);
    }

    const token = generateToken({
      id: seller.seller_id,
      role: 'seller',
      email: seller.email,
      mobile: seller.mobile,
    });

    return apiSuccess(
      {
        token,
        seller: {
          id: seller.seller_id,
          name: seller.name,
          store_name: seller.store_name,
          email: seller.email,
          mobile: seller.mobile,
          balance: seller.balance,
          commission_rate: seller.commission_rate,
          status: seller.status,
        },
      },
      'Vendor authenticated successfully'
    );
  } catch (error: any) {
    console.error('Seller login error:', error);
    return apiError(error?.message || 'Vendor login failed', 500);
  }
}
