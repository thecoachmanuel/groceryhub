import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArea extends Document {
  name: string;
  city: string;
  extraCharge: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const AreaSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    extraCharge: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Area: Model<IArea> = mongoose.models.Area || mongoose.model<IArea>('Area', AreaSchema);
export default Area;
