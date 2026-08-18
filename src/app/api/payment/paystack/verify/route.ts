import { NextRequest } from 'next/server';
import { verifyPaystackTransaction } from '@/lib/paystack';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { reference, order_id } = body;

    if (!reference) {
      return apiError('Paystack reference is required', 400);
    }

    const verifyRes = await verifyPaystackTransaction(reference);

    if (!verifyRes.status || !verifyRes.data) {
      return apiError(verifyRes.message || 'Payment verification failed', 400);
    }

    const isPaid = verifyRes.data.status === 'success';

    if (isPaid && order_id) {
      try {
        await connectToDatabase();
        await Order.findOneAndUpdate(
          { order_id },
          {
            payment_status: 'paid',
            order_status: 'confirmed',
            paystack_reference: reference,
          }
        );
      } catch (dbErr) {
        console.warn('MongoDB order update warning in payment verify:', dbErr);
      }
    }

    return apiSuccess(
      {
        verified: isPaid,
        status: verifyRes.data.status,
        reference: verifyRes.data.reference,
        amount_naira: verifyRes.data.amount / 100,
        gateway_response: verifyRes.data.gateway_response,
        paid_at: verifyRes.data.paid_at,
        channel: verifyRes.data.channel,
      },
      isPaid ? 'Payment verified successfully' : 'Payment pending or failed'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Paystack verification failed', 500);
  }
}
