import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeaderCategory extends Document {
  name: string;
  category: string;
  icon: string;
  order: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const HeaderCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: '' },
    icon: { type: String, default: 'Grid' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const HeaderCategory: Model<IHeaderCategory> = mongoose.models.HeaderCategory || mongoose.model<IHeaderCategory>('HeaderCategory', HeaderCategorySchema);
export default HeaderCategory;
