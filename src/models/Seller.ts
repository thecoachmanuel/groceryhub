import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISeller extends Document {
  seller_id: number;
  name: string;
  store_name: string;
  email: string;
  mobile: string;
  password?: string;
  logo?: string;
  banner?: string;
  address?: string;
  city?: string;
  city_id?: number;
  tax_id_ein?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_routing_number?: string;
  commission_rate: number; // percentage (e.g. 5%)
  requires_product_approval: boolean;
  balance: number; // wallet in Naira
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  status_reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema: Schema = new Schema(
  {
    seller_id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    store_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, select: false },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: 'Lagos' },
    city_id: { type: Number, default: 1 },
    tax_id_ein: { type: String, default: '' },
    bank_name: { type: String, default: '' },
    bank_account_number: { type: String, default: '' },
    bank_routing_number: { type: String, default: '' },
    commission_rate: { type: Number, default: 5 },
    requires_product_approval: { type: Boolean, default: true },
    balance: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'approved' },
    status_reason: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Seller: Model<ISeller> = mongoose.models.Seller || mongoose.model<ISeller>('Seller', SellerSchema);
export default Seller;
