import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITimeslot extends Document {
  title: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const TimeslotSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    maxOrders: { type: Number, default: 50 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Timeslot: Model<ITimeslot> = mongoose.models.Timeslot || mongoose.model<ITimeslot>('Timeslot', TimeslotSchema);
export default Timeslot;
