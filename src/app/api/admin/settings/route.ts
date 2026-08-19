import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SystemSettings from '@/models/SystemSettings';
import { apiSuccess, apiError } from '@/lib/api-response';

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
    return apiSuccess(settings, 'System settings loaded');
  } catch (error: any) {
    console.error('GET /api/admin/settings error:', error);
    return apiSuccess(DEFAULT_SETTINGS, 'Fallback system settings');
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    let settings = await SystemSettings.findOne();
    if (settings) {
      Object.assign(settings, body);
      await settings.save();
    } else {
      settings = await SystemSettings.create({ ...DEFAULT_SETTINGS, ...body });
    }

    return apiSuccess(settings, 'System settings updated successfully');
  } catch (error: any) {
    console.error('POST /api/admin/settings error:', error);
    return apiError(error?.message || 'Failed to update system settings', 500);
  }
}
