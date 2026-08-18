import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  user_id: number;
  name: string;
  email: string;
  mobile: string;
  password?: string;
  profile_pic?: string;
  wallet_balance: number; // in Naira
  referral_code?: string;
  referred_by?: string;
  status: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    user_id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    mobile: { type: String, required: true, unique: true, trim: true, index: true },
    password: { type: String, select: false },
    profile_pic: { type: String, default: '' },
    wallet_balance: { type: Number, default: 0 },
    referral_code: { type: String, unique: true, sparse: true },
    referred_by: { type: String, default: '' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
