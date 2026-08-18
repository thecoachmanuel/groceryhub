import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_title: string;
  price: number;
  discounted_price: number;
  quantity: number;
  image: string;
  seller_id: number;
}

export interface IOrder extends Document {
  order_id: string; // e.g. ORD-2026-9812
  user_id: number;
  seller_id: number;
  delivery_boy_id?: number;
  items: IOrderItem[];
  subtotal: number; // Naira
  delivery_charge: number; // Naira
  service_fee: number; // Naira
  tax_amount: number; // Naira
  discount_amount: number; // Naira
  wallet_amount_used: number; // Naira
  total_amount: number; // Final Naira charged
  payment_method: 'paystack' | 'cod' | 'wallet' | 'card';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  paystack_reference?: string;
  order_status: 'placed' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  delivery_timeslot: string;
  delivery_address: {
    title?: string;
    address_line: string;
    city: string;
    phone: string;
  };
  delivery_pin: string; // 4 digit verification PIN
  order_notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  product_id: { type: Number, required: true },
  variant_id: { type: Number, required: true },
  product_name: { type: String, required: true },
  variant_title: { type: String, required: true },
  price: { type: Number, required: true },
  discounted_price: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  image: { type: String, default: '' },
  seller_id: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
  {
    order_id: { type: String, required: true, unique: true, index: true },
    user_id: { type: Number, required: true, index: true },
    seller_id: { type: Number, required: true, index: true },
    delivery_boy_id: { type: Number, default: 0, index: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    delivery_charge: { type: Number, default: 0 },
    service_fee: { type: Number, default: 500 },
    tax_amount: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    wallet_amount_used: { type: Number, default: 0 },
    total_amount: { type: Number, required: true },
    payment_method: { type: String, enum: ['paystack', 'cod', 'wallet', 'card'], default: 'paystack' },
    payment_status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paystack_reference: { type: String, default: '' },
    order_status: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
    },
    delivery_timeslot: { type: String, default: 'Express 30 Mins' },
    delivery_address: {
      title: { type: String, default: 'Home' },
      address_line: { type: String, required: true },
      city: { type: String, default: 'Lagos' },
      phone: { type: String, required: true },
    },
    delivery_pin: { type: String, default: '4892' },
    order_notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
