import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWithdrawalRequest extends Document {
  request_id: string;
  requester_type: 'seller' | 'delivery';
  requester_id: number;
  requester_name: string;
  amount: number; // in Naira
  bank_name: string;
  account_number: string;
  account_name: string;
  status: 'pending' | 'approved' | 'transferred' | 'rejected';
  rejection_reason?: string;
  transfer_reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalRequestSchema: Schema = new Schema(
  {
    request_id: { type: String, required: true, unique: true, index: true },
    requester_type: { type: String, enum: ['seller', 'delivery'], required: true },
    requester_id: { type: Number, required: true, index: true },
    requester_name: { type: String, required: true },
    amount: { type: Number, required: true },
    bank_name: { type: String, required: true },
    account_number: { type: String, required: true },
    account_name: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'transferred', 'rejected'], default: 'pending' },
    rejection_reason: { type: String, default: '' },
    transfer_reference: { type: String, default: '' },
  },
  { timestamps: true }
);

export const WithdrawalRequest: Model<IWithdrawalRequest> =
  mongoose.models.WithdrawalRequest || mongoose.model<IWithdrawalRequest>('WithdrawalRequest', WithdrawalRequestSchema);
export default WithdrawalRequest;
