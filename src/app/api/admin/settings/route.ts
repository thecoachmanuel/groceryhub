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
  currencySymbol: '\u20a6',
  currencyCode: 'NGN',
  timezone: 'Africa/Lagos (WAT)',
  orderPrefix: 'ORD-',
  defaultRadius: 15,
  minOrderSpend: 2000,
  freeDeliveryThreshold: 15000,
  deliveryFee: 1500,
  platformServiceFee: 500,
  taxRate: 7.5,
  announcementText: '\u26a1 30-Minute Express Grocery Delivery across Lagos! Free shipping over \u20a615,000',
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

    // Use findOneAndUpdate with $set for reliable atomic write.
    // Object.assign + save() doesn't reliably mark all Mongoose fields as
    // modified, causing silent no-ops on certain field types.
    const updated = await SystemSettings.findOneAndUpdate(
      {},           // match the single settings document
      { $set: body },
      {
        new: true,        // return the updated document
        upsert: true,     // create if it doesn't exist yet
        runValidators: true,
        lean: true,
      }
    );

    return apiSuccess(updated, 'System settings updated successfully');
  } catch (error: any) {
    console.error('POST /api/admin/settings error:', error);
    return apiError(error?.message || 'Failed to update system settings', 500);
  }
}
