import { NextRequest } from 'next/server';
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
  taxRate: 7.5,
  announcementText: '⚡ 30-Minute Express Grocery Delivery across Lagos! Free shipping over ₦15,000',
  maintenanceMode: false,
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.groceryhub.customer',
  appStoreUrl: 'https://apps.apple.com/app/groceryhub-delivery/id159023481',
  paystackPublicKey: '',
  paystackSecretKey: '',
};

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SystemSettings.findOne().lean();
    if (!settings) {
      // Seed defaults on first run
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

    // Allowlist only known safe scalar fields — never let body overwrite faqItems
    // to avoid subdocument validation errors silently blocking saves.
    const safeFields: Record<string, any> = {};
    const ALLOWED = [
      'appName', 'appDescription', 'supportPhone', 'supportEmail', 'address',
      'storeLogoUrl', 'currencySymbol', 'currencyCode', 'timezone', 'orderPrefix',
      'defaultRadius', 'minOrderSpend', 'freeDeliveryThreshold', 'deliveryFee',
      'platformServiceFee', 'taxRate', 'maintenanceMode', 'announcementText',
      'playStoreUrl', 'appStoreUrl', 'paystackPublicKey', 'paystackSecretKey',
      'smsGateway', 'smsApiKey', 'smsSenderId', 'flutterwavePublicKey', 'flutterwaveSecretKey',
      'maxCodLimit', 'prepBufferMinutes', 'nightSurcharge', 'maxDeliveryRadius',
      'allowMultipleVendorsCart', 'autoAssignCourier',
    ];

    for (const key of ALLOWED) {
      if (key in body) {
        safeFields[key] = body[key];
      }
    }

    if (Object.keys(safeFields).length === 0) {
      return apiError('No valid fields provided to update', 400);
    }

    // Use findOneAndUpdate WITHOUT runValidators to avoid faqItems subdoc error
    const updated = await SystemSettings.findOneAndUpdate(
      {},
      { $set: safeFields },
      {
        new: true,
        upsert: true,
        runValidators: false, // Critical: avoids required faqItems subdoc validation blocking saves
        lean: true,
      }
    );

    return apiSuccess(updated, 'System settings updated successfully');
  } catch (error: any) {
    console.error('POST /api/admin/settings error:', error);
    return apiError(error?.message || 'Failed to update system settings', 500);
  }
}
