import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrand extends Document {
  brand_id: number;
  name: string;
  slug: string;
  logo: string;
  banner?: string;
  description?: string;
  website_url?: string;
  support_email?: string;
  is_certified_partner: boolean;
  is_featured_on_home: boolean;
  row_order: number;
  status: 'Active' | 'Hidden';
  products_count: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema: Schema = new Schema(
  {
    brand_id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String, required: true },
    banner: { type: String, default: '' },
    description: { type: String, default: '' },
    website_url: { type: String, default: '' },
    support_email: { type: String, default: '' },
    is_certified_partner: { type: Boolean, default: true },
    is_featured_on_home: { type: Boolean, default: false },
    row_order: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Hidden'], default: 'Active' },
    products_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Brand: Model<IBrand> = mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);
export default Brand;
