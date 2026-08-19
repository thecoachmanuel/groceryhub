import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Seller from '@/models/Seller';
import DeliveryBoy from '@/models/DeliveryBoy';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { error, auth } = requireAuth(req);
    if (error) return error;

    await connectToDatabase();

    let fullProfile: any = {
      id: auth.userId,
      role: auth.role,
      email: auth.email,
      mobile: auth.mobile,
    };

    if (auth.role === 'user') {
      const orConditions: any[] = [];
      if (auth.userId) orConditions.push({ user_id: auth.userId });
      if (auth.email) orConditions.push({ email: auth.email });
      if (auth.mobile) orConditions.push({ mobile: auth.mobile });

      const dbUser: any = orConditions.length > 0
        ? await User.findOne({ $or: orConditions }).lean()
        : null;

      if (dbUser) {
        fullProfile = {
          id: dbUser.user_id || auth.userId,
          name: dbUser.name || 'Customer',
          email: dbUser.email || auth.email || '',
          mobile: dbUser.mobile || auth.mobile || '',
          walletBalance: dbUser.wallet_balance ?? 0,
          referralCode: dbUser.referral_code || '',
          role: 'user',
        };
      }
    } else if (auth.role === 'seller') {
      const orConditions: any[] = [];
      if (auth.userId) orConditions.push({ seller_id: auth.userId });
      if (auth.email) orConditions.push({ email: auth.email });

      const dbSeller: any = orConditions.length > 0
        ? await Seller.findOne({ $or: orConditions }).lean()
        : null;

      if (dbSeller) {
        fullProfile = {
          id: dbSeller.seller_id || auth.userId,
          name: dbSeller.name || 'Store Partner',
          storeName: dbSeller.store_name || dbSeller.name || 'My Store',
          email: dbSeller.email || auth.email || '',
          mobile: dbSeller.mobile || auth.mobile || '',
          walletBalance: dbSeller.balance ?? 0,
          role: 'seller',
        };
      }
    } else if (auth.role === 'delivery') {
      const orConditions: any[] = [];
      if (auth.userId) orConditions.push({ delivery_boy_id: auth.userId });
      if (auth.mobile) orConditions.push({ mobile: auth.mobile });

      const dbRider: any = orConditions.length > 0
        ? await DeliveryBoy.findOne({ $or: orConditions }).lean()
        : null;

      if (dbRider) {
        fullProfile = {
          id: dbRider.delivery_boy_id || auth.userId,
          name: dbRider.name || 'Courier Rider',
          mobile: dbRider.mobile || auth.mobile || '',
          vehicle: dbRider.vehicle_type || 'Delivery Bike',
          cashInHand: dbRider.cash_in_hand ?? 0,
          role: 'delivery',
        };
      }
    }

    return apiSuccess({ user: fullProfile }, 'Current authenticated profile synced');
  } catch (error: any) {
    return apiError(error?.message || 'Failed to fetch auth profile', 500);
  }
}
