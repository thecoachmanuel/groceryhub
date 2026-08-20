import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SystemSettings from '@/models/SystemSettings';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const settings = await SystemSettings.findOne().lean<any>().catch(() => null);

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Settings fetched successfully',
      customerSettings: {
        app_name: settings?.appName || 'GroceryHub',
        currency_symbol: settings?.currencySymbol || '₦',
        currency: settings?.currencyCode || 'NGN',
        country_code: '+234',
        logo: settings?.storeLogoUrl || '',
        delivery_charge_standard: settings?.deliveryFee ?? 500,
        min_order_free_delivery: settings?.freeDeliveryThreshold ?? 15000,
        enable_wallet: settings?.enableWallet ?? true,
        support_phone: settings?.supportPhone || '+234 (800) 123-4567',
        support_email: settings?.supportEmail || 'support@groceryhub.ng',
        tax_percentage: settings?.taxPercentage ?? 0,
        google_api_key: settings?.googleMapsApiKey || '',
        app_color: settings?.appColor || '#4CAF50',
        light_color: settings?.lightColor || '#E8F5E9',
        dark_color: settings?.darkColor || '#388E3C',
        minimum_order_amount: settings?.minOrderAmount ?? 1000,
      },
      countrySettings: {
        currency_symbol: settings?.currencySymbol || '₦',
        country_code: '+234',
        currency: settings?.currencyCode || 'NGN',
        country_name: 'Nigeria',
        currency_symbol_position: 'left',
        validation_no: 10,
      },
    });
  } catch (error: any) {
    console.error('fetchCustomerSettings error:', error);
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Settings fetched',
      customerSettings: {
        app_name: 'GroceryHub',
        currency_symbol: '₦',
        currency: 'NGN',
        country_code: '+234',
        delivery_charge_standard: 500,
        min_order_free_delivery: 15000,
        enable_wallet: true,
      },
      countrySettings: {
        currency_symbol: '₦',
        country_code: '+234',
        currency: 'NGN',
        country_name: 'Nigeria',
      },
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
