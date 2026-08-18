import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  admin_id: number;
  email: string;
  name: string;
  mobile?: string;
  password?: string;
  role: 'super_admin' | 'manager' | 'support' | 'editor';
  permissions: {
    category: string;
    can_view: boolean;
    can_add: boolean;
    can_edit: boolean;
    can_delete: boolean;
  }[];
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    admin_id: { type: Number, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, default: '' },
    password: { type: String, select: false },
    role: { type: String, enum: ['super_admin', 'manager', 'support', 'editor'], default: 'super_admin' },
    permissions: [
      {
        category: { type: String, required: true },
        can_view: { type: Boolean, default: true },
        can_add: { type: Boolean, default: true },
        can_edit: { type: Boolean, default: true },
        can_delete: { type: Boolean, default: true },
      },
    ],
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
