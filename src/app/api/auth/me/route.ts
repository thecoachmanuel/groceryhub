import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { error, auth } = requireAuth(req);
    if (error) return error;

    return apiSuccess(
      {
        user: {
          id: auth.userId,
          role: auth.role,
          email: auth.email,
          mobile: auth.mobile,
          sellerId: auth.sellerId,
          deliveryBoyId: auth.deliveryBoyId,
        },
      },
      'Current authenticated identity profile'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Failed to fetch auth profile', 500);
  }
}
