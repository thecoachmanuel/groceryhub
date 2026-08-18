import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  category: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Faq: Model<IFaq> = mongoose.models.Faq || mongoose.model<IFaq>('Faq', FaqSchema);
export default Faq;
