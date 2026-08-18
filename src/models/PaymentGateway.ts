import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPaymentGateway extends Document {
  name: string;
  key: string;
  type: string;
  status: 'Active' | 'Inactive';
  mode: 'Test' | 'Live';
  publicKey?: string;
  secretKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentGatewaySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    type: { type: String, default: 'online' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    mode: { type: String, enum: ['Test', 'Live'], default: 'Test' },
    publicKey: { type: String, default: '' },
    secretKey: { type: String, default: '' },
  },
  { timestamps: true }
);

export const PaymentGateway: Model<IPaymentGateway> = mongoose.models.PaymentGateway || mongoose.model<IPaymentGateway>('PaymentGateway', PaymentGatewaySchema);
export default PaymentGateway;
