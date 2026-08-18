import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroupCategory extends Document {
  name: string;
  description: string;
  categories: string[];
  icon: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const GroupCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    categories: [{ type: String }],
    icon: { type: String, default: 'Layers' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const GroupCategory: Model<IGroupCategory> = mongoose.models.GroupCategory || mongoose.model<IGroupCategory>('GroupCategory', GroupCategorySchema);
export default GroupCategory;
