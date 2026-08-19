import { NextRequest } from 'next/server';
import { initializePaystackTransaction } from '@/lib/paystack';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, amount, reference, callback_url, metadata } = body;

    const numAmount = parseFloat(amount || '0');
    if (isNaN(numAmount) || numAmount <= 0) {
      return apiError('Total order amount must be greater than ₦0.00 to process online checkout', 400);
    }

    const cleanEmail =
      email && typeof email === 'string' && email.includes('@')
        ? email.trim()
        : 'customer@groceryhub.ng';

    const paystackRes = await initializePaystackTransaction({
      email: cleanEmail,
      amount: numAmount,
      reference: reference || `ORD_NG_${Date.now()}`,
      callback_url: callback_url || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/order-history`,
      metadata,
      currency: 'NGN',
    });

    if (!paystackRes.status || !paystackRes.data) {
      return apiError(paystackRes.message || 'Failed to initialize Paystack checkout. Please try again or select Cash on Delivery.', 400);
    }

    return apiSuccess(
      {
        authorization_url: paystackRes.data.authorization_url,
        access_code: paystackRes.data.access_code,
        reference: paystackRes.data.reference,
        amount_naira: numAmount,
        currency: 'NGN',
      },
      'Paystack transaction initialized successfully'
    );
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    return apiError(error?.message || 'Paystack initialization failed', 500);
  }
}
