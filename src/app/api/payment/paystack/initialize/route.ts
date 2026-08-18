import { NextRequest } from 'next/server';
import { initializePaystackTransaction } from '@/lib/paystack';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, amount, reference, callback_url, metadata } = body;

    if (!email || !amount || amount <= 0) {
      return apiError('Valid customer email and positive amount (in Naira) are required', 400);
    }

    const paystackRes = await initializePaystackTransaction({
      email,
      amount,
      reference,
      callback_url: callback_url || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/order-history`,
      metadata,
      currency: 'NGN',
    });

    if (!paystackRes.status || !paystackRes.data) {
      return apiError(paystackRes.message || 'Failed to initialize Paystack checkout', 400);
    }

    return apiSuccess(
      {
        authorization_url: paystackRes.data.authorization_url,
        access_code: paystackRes.data.access_code,
        reference: paystackRes.data.reference,
        amount_naira: amount,
        currency: 'NGN',
      },
      'Paystack transaction initialized successfully'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Paystack initialization failed', 500);
  }
}
