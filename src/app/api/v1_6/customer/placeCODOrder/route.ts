import { NextRequest, NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { user_id, address_id, total_amount, payment_method, delivery_date, delivery_time } = body;

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    return apiSuccess(
      {
        order_id: orderId,
        user_id: user_id || 1,
        address_id: address_id || 1,
        total_amount: total_amount || 45.00,
        payment_method: payment_method || 'COD',
        order_status: 1, // Placed
        delivery_date: delivery_date || new Date().toISOString().split('T')[0],
        delivery_time: delivery_time || '10:00 AM - 12:00 PM',
        created_at: new Date().toISOString(),
      },
      'Order placed successfully'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Failed to place order', 500);
  }
}
