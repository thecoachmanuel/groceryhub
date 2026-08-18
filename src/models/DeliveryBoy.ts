import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDeliveryBoy extends Document {
  delivery_boy_id: number;
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  vehicle_type: string;
  vehicle_description?: string;
  license_number?: string;
  city?: string;
  city_id?: number;
  bank_name?: string;
  bank_account_number?: string;
  trip_bonus: number; // bonus per order run in Naira
  balance: number; // earnings in Naira
  cash_in_hand: number; // unremitted COD in Naira
  is_available: boolean;
  status: 'pending' | 'on_duty' | 'offline' | 'suspended';
  status_reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryBoySchema: Schema = new Schema(
  {
    delivery_boy_id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    password: { type: String, select: false },
    vehicle_type: { type: String, default: 'Motorcycle / Scooter' },
    vehicle_description: { type: String, default: '' },
    license_number: { type: String, default: '' },
    city: { type: String, default: 'Lagos' },
    city_id: { type: Number, default: 1 },
    bank_name: { type: String, default: '' },
    bank_account_number: { type: String, default: '' },
    trip_bonus: { type: Number, default: 500 }, // ₦500 per completed run
    balance: { type: Number, default: 0 },
    cash_in_hand: { type: Number, default: 0 },
    is_available: { type: Boolean, default: true },
    status: { type: String, enum: ['pending', 'on_duty', 'offline', 'suspended'], default: 'on_duty' },
    status_reason: { type: String, default: '' },
  },
  { timestamps: true }
);

export const DeliveryBoy: Model<IDeliveryBoy> = mongoose.models.DeliveryBoy || mongoose.model<IDeliveryBoy>('DeliveryBoy', DeliveryBoySchema);
export default DeliveryBoy;
