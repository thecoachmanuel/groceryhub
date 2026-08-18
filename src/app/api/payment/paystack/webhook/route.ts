import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackWebhookSignature } from '@/lib/paystack';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature') || '';

    // Verify webhook authenticity
    if (process.env.PAYSTACK_SECRET_KEY && !process.env.PAYSTACK_SECRET_KEY.startsWith('sk_test_groceryhub_')) {
      const isValid = verifyPaystackWebhookSignature(rawBody, signature);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody || '{}');

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data || {};
      const orderId = metadata?.order_id;

      if (orderId) {
        try {
          await connectToDatabase();
          await Order.findOneAndUpdate(
            { order_id: orderId },
            {
              payment_status: 'paid',
              order_status: 'confirmed',
              paystack_reference: reference,
            }
          );
        } catch (dbErr) {
          console.warn('MongoDB webhook order update warning:', dbErr);
        }
      }
    }

    return NextResponse.json({ status: 'success', received: true });
  } catch (error: any) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: error?.message || 'Webhook processing failed' }, { status: 500 });
  }
}
