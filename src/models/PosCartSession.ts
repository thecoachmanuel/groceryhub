import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPosCartItem {
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_title: string;
  price: number;
  discounted_price: number;
  quantity: number;
  barcode?: string;
}

export interface IPosCartSession extends Document {
  session_id: string; // e.g. TERM-1, TERM-2
  terminal_name: string; // e.g. Terminal 1 (Counter Main)
  seller_id: number;
  customer_name?: string;
  customer_mobile?: string;
  items: IPosCartItem[];
  applied_discount: number;
  discount_type: 'percentage' | 'fixed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PosCartItemSchema = new Schema({
  product_id: { type: Number, required: true },
  variant_id: { type: Number, required: true },
  product_name: { type: String, required: true },
  variant_title: { type: String, required: true },
  price: { type: Number, required: true },
  discounted_price: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  barcode: { type: String, default: '' },
});

const PosCartSessionSchema: Schema = new Schema(
  {
    session_id: { type: String, required: true, unique: true, index: true },
    terminal_name: { type: String, required: true },
    seller_id: { type: Number, default: 1, index: true },
    customer_name: { type: String, default: 'Walk-in Customer' },
    customer_mobile: { type: String, default: '' },
    items: [PosCartItemSchema],
    applied_discount: { type: Number, default: 0 },
    discount_type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const PosCartSession: Model<IPosCartSession> =
  mongoose.models.PosCartSession || mongoose.model<IPosCartSession>('PosCartSession', PosCartSessionSchema);
export default PosCartSession;
