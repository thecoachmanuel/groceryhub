import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import User from '@/models/User';
import { getUserIdFromHeader, getUserFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    const authHeader = req.headers.get('authorization');
    const tokenUser = getUserFromHeader(authHeader);
    const tokenUserId = getUserIdFromHeader(authHeader);
    const userId = Number(tokenUserId || body.user_id || 0);

    let userName = tokenUser?.name || body.customer_name || '';
    let userPhone = tokenUser?.mobile || body.customer_phone || '';
    let userEmail = tokenUser?.email || body.customer_email || '';

    if (userId && (!userName || !userPhone)) {
      const user = await User.findOne({ user_id: userId }).lean<any>();
      if (user) {
        userName = user.name || userName;
        userPhone = user.mobile || userPhone;
        userEmail = user.email || userEmail;
      }
    }

    let items = body.items || body.cartitem || [];
    const cartKey = userId ? `user_${userId}` : `guest_${body.guest_id || 'anon'}`;

    if (!items.length) {
      const cart = await Cart.findOne({ cart_key: cartKey }).lean<any>();
      items = (cart?.items || []).map((i: any) => ({
        product_id: i.product_id,
        variant_id: i.variant_id,
        product_name: i.product_name || '',
        variant_title: i.unit || 'Standard',
        price: i.price || 0,
        discounted_price: i.discounted_price || i.price || 0,
        quantity: i.qty || 1,
        image: i.image || '',
        seller_id: i.seller_id || 1,
      }));
    }

    const itemsSubtotal = items.reduce(
      (sum: number, i: any) =>
        sum + ((i.discounted_price || i.price || 0) * (i.quantity || i.qty || 1)),
      0
    );

    const subtotal = Number(body.subtotal || itemsSubtotal || 0);
    const deliveryCharge = Number(body.delivery_fee || body.delivery_charge || 0);
    const discount = Number(body.discount || body.discount_amount || 0);
    const totalAmount = Number(body.total_amount || body.amount || subtotal + deliveryCharge - discount || 0);

    const orderId = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 100)}`;

    const newOrder = await Order.create({
      order_id: orderId,
      user_id: userId,
      customer_name: userName,
      customer_phone: userPhone,
      customer_email: userEmail,
      seller_id: Number(body.seller_id || items[0]?.seller_id || 1),
      items,
      subtotal,
      delivery_charge: deliveryCharge,
      service_fee: Number(body.service_fee || 0),
      tax_amount: Number(body.tax_amount || 0),
      discount_amount: discount,
      wallet_amount_used: Number(body.usedWalletAmount || body.wallet_amount || 0),
      total_amount: totalAmount,
      payment_method: 'paystack',
      payment_status: 'pending',
      order_status: 'placed',
      delivery_address: {
        title: body.address_type || 'Home',
        address_line: typeof body.address === 'string' ? body.address : (body.delivery_address?.address_line || 'Default Address'),
        city: body.city || body.delivery_address?.city || 'Lagos',
        phone: userPhone,
      },
      delivery_timeslot: body.delivery_timeslot || body.timeslot || 'Express 30 Mins',
      delivery_pin: String(Math.floor(1000 + Math.random() * 9000)),
      order_notes: body.deliveryInstructions || body.order_notes || '',
    });

    const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_groceryhub_demo_2026';

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Paystack order created',
      order_id: orderId,
      orderId: orderId,
      amount: totalAmount,
      paystack_public_key: paystackPublicKey,
      data: {
        order_id: orderId,
        amount: totalAmount,
        paystack_public_key: paystackPublicKey,
      },
    });
  } catch (error: any) {
    console.error('createPaystackOrder error:', error);
    return NextResponse.json(
      { status: 'error', code: 500, result: 'false', message: error?.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
