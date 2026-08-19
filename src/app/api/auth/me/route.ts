import { NextRequest } from 'next/server';
import { requireAuth, extractAuthToken } from '@/lib/auth-guard';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Seller from '@/models/Seller';
import DeliveryBoy from '@/models/DeliveryBoy';
import Session from '@/models/Session';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    let authContext: any = null;

    // Step 1: Attempt standard JWT verification
    const { error, auth } = requireAuth(req);
    if (!error && auth) {
      authContext = auth;
    } else {
      // Step 2: Fallback to MongoDB direct Session registry
      // This prevents logged-in users from being logged out after new Vercel deployments
      const token = extractAuthToken(req);
      if (token) {
        const dbSession: any = await Session.findOne({
          token,
          expiresAt: { $gt: new Date() },
        }).lean();

        if (dbSession) {
          authContext = {
            userId: dbSession.user_id,
            role: dbSession.role,
            email: dbSession.email,
            mobile: dbSession.mobile,
          };
        }
      }
    }

    if (!authContext) {
      return apiError('Authentication required. Session expired or invalid.', 401);
    }

    let fullProfile: any = {
      id: authContext.userId,
      role: authContext.role,
      email: authContext.email,
      mobile: authContext.mobile,
    };

    if (authContext.role === 'user') {
      const orConditions: any[] = [];
      if (authContext.userId) orConditions.push({ user_id: authContext.userId });
      if (authContext.email) orConditions.push({ email: authContext.email });
      if (authContext.mobile) orConditions.push({ mobile: authContext.mobile });

      const dbUser: any = orConditions.length > 0
        ? await User.findOne({ $or: orConditions }).lean()
        : null;

      if (dbUser) {
        fullProfile = {
          id: dbUser.user_id || authContext.userId,
          name: dbUser.name || 'Customer',
          email: dbUser.email || authContext.email || '',
          mobile: dbUser.mobile || authContext.mobile || '',
          walletBalance: dbUser.wallet_balance ?? 0,
          referralCode: dbUser.referral_code || '',
          role: 'user',
        };
      }
    } else if (authContext.role === 'seller') {
      const orConditions: any[] = [];
      if (authContext.userId) orConditions.push({ seller_id: authContext.userId });
      if (authContext.email) orConditions.push({ email: authContext.email });

      const dbSeller: any = orConditions.length > 0
        ? await Seller.findOne({ $or: orConditions }).lean()
        : null;

      if (dbSeller) {
        fullProfile = {
          id: dbSeller.seller_id || authContext.userId,
          name: dbSeller.name || 'Store Partner',
          storeName: dbSeller.store_name || dbSeller.name || 'My Store',
          email: dbSeller.email || authContext.email || '',
          mobile: dbSeller.mobile || authContext.mobile || '',
          walletBalance: dbSeller.balance ?? 0,
          role: 'seller',
        };
      }
    } else if (authContext.role === 'delivery') {
      const orConditions: any[] = [];
      if (authContext.userId) orConditions.push({ delivery_boy_id: authContext.userId });
      if (authContext.mobile) orConditions.push({ mobile: authContext.mobile });

      const dbRider: any = orConditions.length > 0
        ? await DeliveryBoy.findOne({ $or: orConditions }).lean()
        : null;

      if (dbRider) {
        fullProfile = {
          id: dbRider.delivery_boy_id || authContext.userId,
          name: dbRider.name || 'Courier Rider',
          mobile: dbRider.mobile || authContext.mobile || '',
          vehicle: dbRider.vehicle_type || 'Delivery Bike',
          cashInHand: dbRider.cash_in_hand ?? 0,
          role: 'delivery',
        };
      }
    }

    return apiSuccess({ user: fullProfile }, 'Current authenticated profile synced from MongoDB');
  } catch (error: any) {
    console.error('GET /api/auth/me error:', error);
    return apiError(error?.message || 'Failed to fetch auth profile', 500);
  }
}
