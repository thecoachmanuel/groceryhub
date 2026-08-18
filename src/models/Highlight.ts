import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHighlight extends Document {
  title: string;
  subtitle: string;
  tag: string;
  bgColor: string;
  icon: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const HighlightSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    tag: { type: String, default: '' },
    bgColor: { type: String, default: '#0aad0a' },
    icon: { type: String, default: 'Sparkles' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Highlight: Model<IHighlight> = mongoose.models.Highlight || mongoose.model<IHighlight>('Highlight', HighlightSchema);
export default Highlight;
