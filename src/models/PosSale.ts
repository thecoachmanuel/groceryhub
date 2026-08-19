import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPosSaleItem {
  product_id: string;
  product_name: string;
  variant_title: string;
  price: number;
  discounted_price: number;
  quantity: number;
  image?: string;
  barcode?: string;
}

export interface IPosSale extends Document {
  pos_order_id: string;       // e.g. POS17234567890123
  seller_id: number;
  terminal_name: string;      // e.g. "Counter 1 (Main Register)"
  customer_name: string;
  customer_mobile: string;
  items: IPosSaleItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  additional_charges: number;
  total: number;
  payment_method: string;     // cash | card | transfer | wallet
  status: 'completed' | 'voided';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PosSaleItemSchema = new Schema({
  product_id: { type: String, default: '' },
  product_name: { type: String, required: true },
  variant_title: { type: String, default: 'Default' },
  price: { type: Number, required: true },
  discounted_price: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  image: { type: String, default: '' },
  barcode: { type: String, default: '' },
});

const PosSaleSchema: Schema = new Schema(
  {
    pos_order_id: { type: String, required: true, unique: true, index: true },
    seller_id: { type: Number, default: 1, index: true },
    terminal_name: { type: String, default: 'Counter 1' },
    customer_name: { type: String, default: 'Walk-in Customer' },
    customer_mobile: { type: String, default: '' },
    items: [PosSaleItemSchema],
    subtotal: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    additional_charges: { type: Number, default: 0 },
    total: { type: Number, required: true },
    payment_method: { type: String, default: 'cash' },
    status: { type: String, enum: ['completed', 'voided'], default: 'completed' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const PosSale: Model<IPosSale> =
  mongoose.models.PosSale || mongoose.model<IPosSale>('PosSale', PosSaleSchema);
export default PosSale;
