import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITax extends Document {
  title: string;
  percentage: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const TaxSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    percentage: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Tax: Model<ITax> = mongoose.models.Tax || mongoose.model<ITax>('Tax', TaxSchema);
export default Tax;
