import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITag extends Document {
  name: string;
  type: 'dietary' | 'promo' | 'general';
  color: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['dietary', 'promo', 'general'], default: 'general' },
    color: { type: String, default: '#0aad0a' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Tag: Model<ITag> = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
export default Tag;
