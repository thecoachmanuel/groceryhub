import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parent_id?: mongoose.Types.ObjectId | null;
  is_featured: boolean;
  status: 'Active' | 'Hidden';
  row_order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    is_featured: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Hidden'], default: 'Active' },
    row_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
