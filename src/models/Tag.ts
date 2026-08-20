import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITag extends Document {
  name: string;
  slug: string;
  type: 'dietary' | 'badge' | 'promo' | 'label' | 'general';
  emoji: string;
  color: string;
  bg_color: string;
  status: 'Active' | 'Inactive';
  sort_order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true, default: '' },
    type: { type: String, enum: ['dietary', 'badge', 'promo', 'label', 'general'], default: 'general' },
    emoji: { type: String, default: '' },
    color: { type: String, default: '#0aad0a' },
    bg_color: { type: String, default: '#e8f5e9' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Tag: Model<ITag> = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
export default Tag;
