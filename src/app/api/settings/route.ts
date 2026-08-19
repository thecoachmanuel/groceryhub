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
  taxRate: 7.5,
  maxCodLimit: 100000,
  prepBufferMinutes: 20,
  nightSurcharge: 1000,
  maxDeliveryRadius: 25,
  allowMultipleVendorsCart: true,
  autoAssignCourier: true,
  announcementText: '⚡ 30-Minute Express Grocery Delivery across Lagos! Free shipping over ₦15,000',
  maintenanceMode: false,
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.groceryhub.customer',
  appStoreUrl: 'https://apps.apple.com/app/groceryhub-delivery/id159023481',
  faqItems: [
    {
      q: 'How fast is GroceryHub delivery?',
      a: 'We deliver in 30 minutes or less! Our hyper-local distribution network and certified neighborhood vendor hubs ensure your fresh groceries reach your doorstep in record time.',
    },
    {
      q: 'Are the fruits and vegetables 100% fresh and organic?',
      a: 'Yes, all our produce is harvested and sourced daily from certified local organic farms. We perform multi-stage quality checks before packing every order.',
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support all major Nigerian payment methods including Paystack (Debit/Credit Cards, Bank Transfer, USSD), Store Wallet, and Cash on Delivery (COD).',
    },
    {
      q: 'How do I return or replace a damaged product?',
      a: 'We have a hassle-free, no-questions-asked refund & replacement guarantee. Simply navigate to My Orders, select the item, and click "Request Return/Refund", or reach out to our 24/7 support.',
    },
    {
      q: 'Is there a minimum order amount for free delivery?',
      a: 'Orders above ₦15,000 qualify for free express delivery. For orders below ₦15,000, a nominal delivery fee is applied based on your delivery zone.',
    },
    {
      q: 'How do I become a vendor / sell on GroceryHub?',
      a: 'Click on "Sell on GroceryHub" in the top bar or visit /seller/login. Submit your business verification documents and our partner onboarding team will activate your store in under 24 hours.',
    },
  ],
  smsGateway: 'termii',
  smsApiKey: '',
  smsSenderId: 'GroceryHub',
  paystackPublicKey: '',
  paystackSecretKey: '',
  flutterwavePublicKey: '',
  flutterwaveSecretKey: '',
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
