import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFaqItem {
  q: string;
  a: string;
}

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
  taxRate: number; // VAT percentage, default 7.5
  maxCodLimit: number;
  prepBufferMinutes: number;
  nightSurcharge: number;
  maxDeliveryRadius: number;
  allowMultipleVendorsCart: boolean;
  autoAssignCourier: boolean;
  announcementText: string;
  maintenanceMode: boolean;
  playStoreUrl: string;
  appStoreUrl: string;
  faqItems: IFaqItem[];
  smsGateway: string;
  smsApiKey: string;
  smsSenderId: string;
  paystackPublicKey: string;
  paystackSecretKey: string;
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;
  updatedAt: Date;
}

const FaqItemSchema = new Schema({
  q: { type: String, required: true },
  a: { type: String, required: true },
});

const DEFAULT_FAQS = [
  {
    q: 'How fast is GroceryHub delivery?',
    a: 'We deliver in 30 minutes or less! Our hyper-local distribution network and certified neighborhood vendor hubs ensure your fresh groceries reach your doorstep in record time.',
  },
  {
    q: 'Are the fruits and vegetables 100% fresh and organic?',
    a: 'Yes, all our produce is harvested and sourced daily from certified local organic farms. We perform multi-stage quality checks before packing every order.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We support all major Nigerian payment methods including Paystack (Debit/Credit Cards, Bank Transfer, USSD), Store Wallet, and Cash on Delivery (COD).',
  },
  {
    q: 'How do I return or replace a damaged product?',
    a: 'We have a hassle-free, no-questions-asked refund & replacement guarantee. Simply navigate to My Orders, select the item, and click "Request Return/Refund", or reach out to our 24/7 support.',
  },
  {
    q: 'Is there a minimum order amount for free delivery?',
    a: 'Orders above ₦15,000 qualify for free express delivery. For orders below ₦15,000, a nominal delivery fee is applied based on your delivery zone.',
  },
  {
    q: 'How do I become a vendor / sell on GroceryHub?',
    a: 'Click on "Sell on GroceryHub" in the top bar or visit /seller/login. Submit your business verification documents and our partner onboarding team will activate your store in under 24 hours.',
  },
];

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
    taxRate: { type: Number, default: 7.5 },
    maxCodLimit: { type: Number, default: 100000 },
    prepBufferMinutes: { type: Number, default: 20 },
    nightSurcharge: { type: Number, default: 1000 },
    maxDeliveryRadius: { type: Number, default: 25 },
    allowMultipleVendorsCart: { type: Boolean, default: true },
    autoAssignCourier: { type: Boolean, default: true },
    announcementText: { type: String, default: '⚡ 30-Minute Express Grocery Delivery across Lagos! Free shipping over ₦15,000' },
    maintenanceMode: { type: Boolean, default: false },
    playStoreUrl: { type: String, default: 'https://play.google.com/store/apps/details?id=com.groceryhub.customer' },
    appStoreUrl: { type: String, default: 'https://apps.apple.com/app/groceryhub-delivery/id159023481' },
    faqItems: { type: [FaqItemSchema], default: DEFAULT_FAQS },
    smsGateway: { type: String, default: 'termii' },
    smsApiKey: { type: String, default: '' },
    smsSenderId: { type: String, default: 'GroceryHub' },
    paystackPublicKey: { type: String, default: '' },
    paystackSecretKey: { type: String, default: '' },
    flutterwavePublicKey: { type: String, default: '' },
    flutterwaveSecretKey: { type: String, default: '' },
  },
  { timestamps: true }
);

export const SystemSettings: Model<ISystemSettings> =
  mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);

export default SystemSettings;
