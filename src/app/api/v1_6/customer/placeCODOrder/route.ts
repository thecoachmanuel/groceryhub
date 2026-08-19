import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { 
      user_id, 
      seller_id, 
      items, 
      subtotal, 
      delivery_charge, 
      service_fee, 
      tax_amount, 
      discount_amount, 
      wallet_amount_used, 
      total_amount, 
      payment_method, 
      delivery_timeslot, 
      delivery_address 
    } = body;

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    let newDbOrder = null;
    try {
      await connectToDatabase();
      newDbOrder = await Order.create({
        order_id: orderId,
        user_id: user_id || Date.now(),
        customer_name: delivery_address?.name || body.customer_name || 'Valued Customer',
        customer_phone: delivery_address?.mobile || delivery_address?.phone || body.customer_phone || '',
        customer_email: body.customer_email || body.email || '',
        seller_id: seller_id || 1,
        items: Array.isArray(items) ? items : [],
        subtotal: subtotal || total_amount || 0,
        delivery_charge: delivery_charge || 0,
        service_fee: service_fee || 500,
        tax_amount: tax_amount || 0,
        discount_amount: discount_amount || 0,
        wallet_amount_used: wallet_amount_used || 0,
        total_amount: total_amount || 0,
        payment_method: payment_method || 'cod',
        payment_status: payment_method === 'wallet' ? 'paid' : 'pending',
        order_status: 'placed',
        delivery_timeslot: delivery_timeslot || 'Express (30 Mins)',
        delivery_address: {
          title: delivery_address?.type || delivery_address?.title || 'Delivery Address',
          address_line: delivery_address?.flat ? `${delivery_address.flat}, ${delivery_address.area || ''}` : (delivery_address?.address || delivery_address?.address_line || 'Delivery Location'),
          city: delivery_address?.city || 'Lagos',
          phone: delivery_address?.mobile || delivery_address?.phone || '',
        },
        delivery_pin: `${Math.floor(1000 + Math.random() * 9000)}`,
      });

      // Decrement product stock in MongoDB
      if (Array.isArray(items)) {
        for (const item of items) {
          const pId = item.product_id || item.id;
          const qty = item.quantity || item.qty || 1;
          if (pId) {
            const prod = await Product.findOne({
              $or: [{ product_id: pId }, { _id: pId }, { 'variants.variant_id': pId }],
            });
            if (prod && prod.variants && prod.variants.length > 0) {
              const currentStock = prod.variants[0].stock || 0;
              prod.variants[0].stock = Math.max(0, currentStock - qty);
              if (prod.variants[0].stock === 0) {
                prod.status = 'out_of_stock';
              }
              await prod.save();
            }
          }
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB order creation warning:', dbErr);
    }

    return apiSuccess(
      {
        order_id: orderId,
        total_amount: total_amount || 0,
        payment_method: payment_method || 'cod',
        order_status: 'placed',
        db_id: newDbOrder?._id,
      },
      'Order placed successfully'
    );
  } catch (error: any) {
    console.error('placeCODOrder error:', error);
    return apiError(error?.message || 'Failed to place order', 500);
  }
}
