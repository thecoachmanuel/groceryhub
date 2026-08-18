import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_groceryhub_paystack_secret_key';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaystackInitParams {
  email: string;
  amount: number; // in Naira (will be converted to kobo)
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  currency?: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number; // in kobo
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
    };
    metadata?: Record<string, any>;
  };
}

/**
 * Initialize a Paystack transaction in Naira (NGN)
 */
export async function initializePaystackTransaction(params: PaystackInitParams): Promise<PaystackInitResponse> {
  const reference = params.reference || `GROCERY_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const amountInKobo = Math.round(params.amount * 100);

  // If running in development without valid live key, return mock fallback
  if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY.startsWith('sk_test_groceryhub_')) {
    return {
      status: true,
      message: 'Authorization URL created (Test Mode)',
      data: {
        authorization_url: `https://checkout.paystack.com/${reference}`,
        access_code: `mock_code_${Date.now()}`,
        reference,
      },
    };
  }

  try {
    const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        amount: amountInKobo,
        reference,
        callback_url: params.callback_url,
        metadata: params.metadata,
        currency: params.currency || 'NGN',
      }),
    });

    const data: PaystackInitResponse = await res.json();
    return data;
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    return {
      status: false,
      message: error?.message || 'Failed to initialize Paystack payment',
    };
  }
}

/**
 * Verify a Paystack transaction by reference
 */
export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResponse> {
  // If running in mock test mode
  if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY.startsWith('sk_test_groceryhub_')) {
    return {
      status: true,
      message: 'Verification successful (Test Mode)',
      data: {
        id: Date.now(),
        status: 'success',
        reference,
        amount: 500000,
        gateway_response: 'Successful',
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        channel: 'card',
        currency: 'NGN',
        customer: {
          id: 1,
          email: 'customer@groceryhub.ng',
          customer_code: 'CUS_mock',
        },
      },
    };
  }

  try {
    const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data: PaystackVerifyResponse = await res.json();
    return data;
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    return {
      status: false,
      message: error?.message || 'Failed to verify Paystack payment',
    };
  }
}

/**
 * Verify Paystack webhook signature
 */
export function verifyPaystackWebhookSignature(body: string, signature: string): boolean {
  if (!PAYSTACK_SECRET_KEY) return false;
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(body).digest('hex');
  return hash === signature;
}
