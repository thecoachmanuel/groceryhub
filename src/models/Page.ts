import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPage extends Document {
  slug: string; // 'about-us', 'privacy-policy', 'terms-conditions', 'refund-policy', 'contact-us'
  title: string;
  content: string; // HTML or Markdown content
  meta_data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    meta_data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
export default Page;
