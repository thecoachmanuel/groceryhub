import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHomeScreen extends Document {
  screenId: string;
  title: string;
  type: string;
  order: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const HomeScreenSchema: Schema = new Schema(
  {
    screenId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, default: 'Custom' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const HomeScreen: Model<IHomeScreen> = mongoose.models.HomeScreen || mongoose.model<IHomeScreen>('HomeScreen', HomeScreenSchema);
export default HomeScreen;
