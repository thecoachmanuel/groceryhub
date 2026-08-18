import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: string;
  category: string;
  description?: string;
  updatedAt: Date;
}

const SettingSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: String, required: true },
    category: { type: String, default: 'general' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
export default Setting;
