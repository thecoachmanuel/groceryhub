import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILanguage extends Document {
  name: string;
  code: string;
  is_rtl: boolean;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const LanguageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, lowercase: true },
    is_rtl: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Language: Model<ILanguage> = mongoose.models.Language || mongoose.model<ILanguage>('Language', LanguageSchema);
export default Language;
