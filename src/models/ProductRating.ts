import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductRating extends Document {
  product_id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  rating: number; // 1 to 5
  title: string;
  review: string;
  is_verified_buyer: boolean;
  is_approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductRatingSchema: Schema = new Schema(
  {
    product_id: { type: Number, required: true, index: true },
    user_id: { type: Number, required: true, index: true },
    user_name: { type: String, required: true, trim: true },
    user_avatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    review: { type: String, required: true, trim: true },
    is_verified_buyer: { type: Boolean, default: true },
    is_approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductRating: Model<IProductRating> =
  mongoose.models.ProductRating || mongoose.model<IProductRating>('ProductRating', ProductRatingSchema);
export default ProductRating;
