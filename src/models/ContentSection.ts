import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContentSection extends Document {
  title: string;
  type: string;
  visibility: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ContentSectionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, default: 'Custom' },
    visibility: { type: String, default: 'All Users' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const ContentSection: Model<IContentSection> = mongoose.models.ContentSection || mongoose.model<IContentSection>('ContentSection', ContentSectionSchema);
export default ContentSection;
