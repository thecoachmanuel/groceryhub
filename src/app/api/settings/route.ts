import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SystemSettings from '@/models/SystemSettings';
import { apiSuccess } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  appName: 'GroceryHub',
  appDescription: 'Hyper-local 30-minute grocery delivery platform in Nigeria',
  supportPhone: '+234 (800) 123-4567',
  supportEmail: 'support@groceryhub.ng',
  address: 'Plot 14, Adeola Odeku St, Victoria Island, Lagos, Nigeria',
  storeLogoUrl: '',
  currencySymbol: '₦',
  currencyCode: 'NGN',
  timezone: 'Africa/Lagos (WAT)',
  orderPrefix: 'ORD-',
  defaultRadius: 15,
  minOrderSpend: 2000,
  freeDeliveryThreshold: 15000,
  deliveryFee: 1500,
  platformServiceFee: 500,
  announcementText: '⚡ 30-Minute Express Grocery Delivery across Lagos! Free shipping over ₦15,000',
  maintenanceMode: false,
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.groceryhub.customer',
  appStoreUrl: 'https://apps.apple.com/app/groceryhub-delivery/id159023481',
};

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SystemSettings.findOne().lean();
    if (!settings) {
      settings = await SystemSettings.create(DEFAULT_SETTINGS);
    }
    return apiSuccess(settings, 'Platform settings loaded');
  } catch (error: any) {
    return apiSuccess(DEFAULT_SETTINGS, 'Fallback settings loaded');
  }
}
