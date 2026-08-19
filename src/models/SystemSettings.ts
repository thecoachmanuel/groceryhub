import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISystemSettings extends Document {
  appName: string;
  appDescription: string;
  supportPhone: string;
  supportEmail: string;
  address: string;
  storeLogoUrl: string;
  currencySymbol: string;
  currencyCode: string;
  timezone: string;
  orderPrefix: string;
  defaultRadius: number;
  minOrderSpend: number;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  platformServiceFee: number;
  announcementText: string;
  maintenanceMode: boolean;
  playStoreUrl: string;
  appStoreUrl: string;
  updatedAt: Date;
}

const SystemSettingsSchema: Schema = new Schema(
  {
    appName: { type: String, default: 'GroceryHub' },
    appDescription: { type: String, default: 'Hyper-local 30-minute grocery delivery platform in Nigeria' },
    supportPhone: { type: String, default: '+234 (800) 123-4567' },
    supportEmail: { type: String, default: 'support@groceryhub.ng' },
    address: { type: String, default: 'Plot 14, Adeola Odeku St, Victoria Island, Lagos, Nigeria' },
    storeLogoUrl: { type: String, default: '' },
    currencySymbol: { type: String, default: '₦' },
    currencyCode: { type: String, default: 'NGN' },
    timezone: { type: String, default: 'Africa/Lagos (WAT)' },
    orderPrefix: { type: String, default: 'ORD-' },
    defaultRadius: { type: Number, default: 15 },
    minOrderSpend: { type: Number, default: 2000 },
    freeDeliveryThreshold: { type: Number, default: 15000 },
    deliveryFee: { type: Number, default: 1500 },
    platformServiceFee: { type: Number, default: 500 },
    announcementText: { type: String, default: '⚡ 30-Minute Express Grocery Delivery across Lagos! Free shipping over ₦15,000' },
    maintenanceMode: { type: Boolean, default: false },
    playStoreUrl: { type: String, default: 'https://play.google.com/store/apps/details?id=com.groceryhub.customer' },
    appStoreUrl: { type: String, default: 'https://apps.apple.com/app/groceryhub-delivery/id159023481' },
  },
  { timestamps: true }
);

export const SystemSettings: Model<ISystemSettings> =
  mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);

export default SystemSettings;
