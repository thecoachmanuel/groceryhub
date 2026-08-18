import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISystemUser extends Document {
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const SystemUserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, default: '' },
    role: { type: String, default: 'Manager' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const SystemUser: Model<ISystemUser> = mongoose.models.SystemUser || mongoose.model<ISystemUser>('SystemUser', SystemUserSchema);
export default SystemUser;
