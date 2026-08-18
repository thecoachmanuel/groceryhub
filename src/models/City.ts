import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICity extends Document {
  name: string;
  state: string;
  country: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    state: { type: String, default: 'Lagos' },
    country: { type: String, default: 'Nigeria' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const City: Model<ICity> = mongoose.models.City || mongoose.model<ICity>('City', CitySchema);
export default City;
