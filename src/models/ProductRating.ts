import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductRating extends Document {
  product_id: string | number;
  user_id: number;
  user_name?: string;
  order_id?: string;
  rating: number;
  title?: string;
  review?: string;
  images?: string[];
  is_verified_buyer?: boolean;
  is_approved?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductRatingSchema: Schema = new Schema(
  {
    product_id: { type: Schema.Types.Mixed, required: true, index: true },
    user_id: { type: Number, required: true, index: true },
    user_name: { type: String, default: '' },
    order_id: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '' },
    review: { type: String, default: '' },
    images: [{ type: String }],
    is_verified_buyer: { type: Boolean, default: true },
    is_approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductRating: Model<IProductRating> =
  mongoose.models.ProductRating ||
  mongoose.model<IProductRating>('ProductRating', ProductRatingSchema);
export default ProductRating;
