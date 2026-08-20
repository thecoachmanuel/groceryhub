import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductVariant {
  variant_id: number;
  title: string;
  price: number; // in Naira
  discounted_price: number; // in Naira
  stock: number;
  is_unlimited_stock: number;
  min_cart_quantity: number;
  unit: string;
  barcode?: string;
  sku?: string;
}

export interface IProduct extends Document {
  product_id: number;
  seller_id: number;
  brand_id?: number;
  category_id: number;
  category?: string;
  subcategory_id?: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  additional_images: string[];
  variants: IProductVariant[];
  rating: number;
  rating_count: number;
  status: 'active' | 'hidden' | 'out_of_stock';
  is_approved: boolean;
  is_deal_of_the_day: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema({
  variant_id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  discounted_price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  is_unlimited_stock: { type: Number, default: 1 },
  min_cart_quantity: { type: Number, default: 1 },
  unit: { type: String, required: true },
  barcode: { type: String, default: '' },
  sku: { type: String, default: '' },
});

const ProductSchema: Schema = new Schema(
  {
    product_id: { type: Number, required: true, unique: true, index: true },
    seller_id: { type: Number, required: true, index: true },
    brand_id: { type: Number, default: 0, index: true },
    category_id: { type: Number, default: 1, index: true },
    category: { type: String, default: 'Vegetables' },
    subcategory_id: { type: Number, default: 0 },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    additional_images: [{ type: String }],
    variants: [ProductVariantSchema],
    rating: { type: Number, default: 5.0 },
    rating_count: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'hidden', 'out_of_stock'], default: 'active' },
    is_approved: { type: Boolean, default: true },
    is_deal_of_the_day: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
