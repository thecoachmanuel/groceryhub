import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  notification_id: string;
  title: string;
  message: string;
  image?: string;
  target_role: 'all' | 'user' | 'seller' | 'delivery' | 'admin';
  target_user_id?: number;
  read_by: number[]; // Array of user IDs who opened/read it
  action_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    notification_id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    target_role: { type: String, enum: ['all', 'user', 'seller', 'delivery', 'admin'], default: 'all' },
    target_user_id: { type: Number, default: 0, index: true },
    read_by: [{ type: Number }],
    action_url: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
