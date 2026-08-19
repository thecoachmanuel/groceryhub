import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
  token: string;
  user_id: number;
  role: 'user' | 'seller' | 'delivery' | 'admin';
  email?: string;
  mobile?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    user_id: { type: Number, required: true, index: true },
    role: { type: String, enum: ['user', 'seller', 'delivery', 'admin'], required: true },
    email: { type: String, default: '' },
    mobile: { type: String, default: '' },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;
