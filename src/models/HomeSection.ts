import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHomeSection extends Document {
  title: string;
  type: string;
  categoryRef?: string;
  order: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const HomeSectionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, default: 'ProductGrid' },
    categoryRef: { type: String, default: '' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const HomeSection: Model<IHomeSection> = mongoose.models.HomeSection || mongoose.model<IHomeSection>('HomeSection', HomeSectionSchema);
export default HomeSection;
