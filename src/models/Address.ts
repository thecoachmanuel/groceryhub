import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress extends Document {
  user_id: number;
  address_type: string;
  user_name?: string;
  user_mobile?: string;
  flat?: string;
  floor?: string;
  address: string;
  city: string;
  state?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  is_default: number;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema(
  {
    user_id: { type: Number, required: true, index: true },
    address_type: { type: String, default: 'Home' },
    user_name: { type: String, default: '' },
    user_mobile: { type: String, default: '' },
    flat: { type: String, default: '' },
    floor: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, default: 'Lagos' },
    state: { type: String, default: 'Lagos State' },
    landmark: { type: String, default: '' },
    latitude: { type: Number, default: 6.5244 },
    longitude: { type: Number, default: 3.3792 },
    is_default: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Address: Model<IAddress> =
  mongoose.models.Address || mongoose.model<IAddress>('Address', AddressSchema);
export default Address;
