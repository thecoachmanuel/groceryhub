import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  product_id: string | number;
  variant_id: string | number;
  product_name: string;
  image: string;
  price: number;
  discounted_price: number;
  qty: number;
  unit: string;
  seller_id: number;
}

export interface ICart extends Document {
  cart_key: string; // guest_id or user_id as string
  user_id?: number;
  items: ICartItem[];
  updatedAt: Date;
}

const CartItemSchema = new Schema({
  product_id: { type: Schema.Types.Mixed, required: true },
  variant_id: { type: Schema.Types.Mixed, default: 1 },
  product_name: { type: String, default: '' },
  image: { type: String, default: '' },
  price: { type: Number, default: 0 },
  discounted_price: { type: Number, default: 0 },
  qty: { type: Number, default: 1 },
  unit: { type: String, default: 'pcs' },
  seller_id: { type: Number, default: 1 },
});

const CartSchema: Schema = new Schema(
  {
    cart_key: { type: String, required: true, unique: true, index: true },
    user_id: { type: Number, default: 0 },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
export default Cart;
