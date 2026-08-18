import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWalletTransaction extends Document {
  txn_id: string;
  user_type: 'user' | 'seller' | 'delivery';
  user_id: number;
  type: 'credit' | 'debit';
  amount: number; // in Naira
  balance_after: number; // in Naira
  reference: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}

const WalletTransactionSchema: Schema = new Schema(
  {
    txn_id: { type: String, required: true, unique: true, index: true },
    user_type: { type: String, enum: ['user', 'seller', 'delivery'], required: true },
    user_id: { type: Number, required: true, index: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    balance_after: { type: Number, required: true },
    reference: { type: String, required: true },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  },
  { timestamps: true }
);

export const WalletTransaction: Model<IWalletTransaction> =
  mongoose.models.WalletTransaction || mongoose.model<IWalletTransaction>('WalletTransaction', WalletTransactionSchema);
export default WalletTransaction;
