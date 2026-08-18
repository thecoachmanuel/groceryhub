import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  title: string;
  discount_type: 'percentage' | 'fixed';
  discount: number;
  min_purchase: number;
  max_discount: number;
  expiry_date: Date;
  is_active: boolean;
  usage_count: number;
  usage_limit: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    discount_type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discount: { type: Number, required: true, default: 0 },
    min_purchase: { type: Number, default: 0 },
    max_discount: { type: Number, default: 0 },
    expiry_date: { type: Date, required: true },
    is_active: { type: Boolean, default: true },
    usage_count: { type: Number, default: 0 },
    usage_limit: { type: Number, default: 0 }, // 0 = unlimited
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
export default Coupon;
