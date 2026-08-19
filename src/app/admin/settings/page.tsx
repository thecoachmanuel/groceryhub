'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  ShieldCheck, 
  ShoppingBag, 
  Smartphone, 
  Save, 
  CheckCircle2, 
  HelpCircle,
  Truck,
  Mail,
  Phone,
  MapPin,
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LocalImageUploader from '@/components/common/LocalImageUploader';
import { apiFetch } from '@/lib/api-fetch';
import { formatNaira } from '@/lib/currency';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'localization' | 'orders' | 'security' | 'mobile' | 'payment'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // General Identity
  const [appName, setAppName] = useState('GroceryHub');
  const [appDescription, setAppDescription] = useState('Hyper-local 30-minute grocery delivery platform in Nigeria');
  const [supportPhone, setSupportPhone] = useState('+234 (800) 123-4567');
  const [supportEmail, setSupportEmail] = useState('support@groceryhub.ng');
  const [address, setAddress] = useState('Plot 14, Adeola Odeku St, Victoria Island, Lagos, Nigeria');
  const [storeLogoUrl, setStoreLogoUrl] = useState('');

  // Localization
  const [currencySymbol, setCurrencySymbol] = useState('₦');
  const [currencyCode, setCurrencyCode] = useState('NGN');
  const [timezone, setTimezone] = useState('Africa/Lagos (WAT)');

  // Orders & Logistics Defaults
  const [orderPrefix, setOrderPrefix] = useState('ORD-');
  const [defaultRadius, setDefaultRadius] = useState('15');
  const [minOrderSpend, setMinOrderSpend] = useState('2000');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('15000');
  const [deliveryFee, setDeliveryFee] = useState('1500');
  const [platformServiceFee, setPlatformServiceFee] = useState('500');
  const [taxRate, setTaxRate] = useState('7.5');
  const [autoAssignDrivers, setAutoAssignDrivers] = useState(true);

  // Security & Auth
  const [otpExpirationSec, setOtpExpirationSec] = useState('120');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Mobile App Links
  const [playStoreUrl, setPlayStoreUrl] = useState('https://play.google.com/store/apps/details?id=com.groceryhub.customer');
  const [appStoreUrl, setAppStoreUrl] = useState('https://apps.apple.com/app/groceryhub-delivery/id159023481');

  // Payment Gateway
  const [paystackPublicKey, setPaystackPublicKey] = useState('');
  const [paystackSecretKey, setPaystackSecretKey] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          if (s.appName) setAppName(s.appName);
          if (s.appDescription) setAppDescription(s.appDescription);
          if (s.supportPhone) setSupportPhone(s.supportPhone);
          if (s.supportEmail) setSupportEmail(s.supportEmail);
          if (s.address) setAddress(s.address);
          if (s.storeLogoUrl) setStoreLogoUrl(s.storeLogoUrl);
          if (s.currencySymbol) setCurrencySymbol(s.currencySymbol);
          if (s.currencyCode) setCurrencyCode(s.currencyCode);
          if (s.timezone) setTimezone(s.timezone);
          if (s.orderPrefix) setOrderPrefix(s.orderPrefix);
          if (s.defaultRadius !== undefined) setDefaultRadius(String(s.defaultRadius));
          if (s.minOrderSpend !== undefined) setMinOrderSpend(String(s.minOrderSpend));
          if (s.freeDeliveryThreshold !== undefined) setFreeDeliveryThreshold(String(s.freeDeliveryThreshold));
          if (s.deliveryFee !== undefined) setDeliveryFee(String(s.deliveryFee));
          if (s.platformServiceFee !== undefined) setPlatformServiceFee(String(s.platformServiceFee));
          if (s.taxRate !== undefined) setTaxRate(String(s.taxRate));
          if (s.maintenanceMode !== undefined) setMaintenanceMode(s.maintenanceMode);
          if (s.playStoreUrl) setPlayStoreUrl(s.playStoreUrl);
          if (s.appStoreUrl) setAppStoreUrl(s.appStoreUrl);
          if (s.paystackPublicKey) setPaystackPublicKey(s.paystackPublicKey);
          if (s.paystackSecretKey) setPaystackSecretKey(s.paystackSecretKey);
        }
      } catch (err) {
        console.warn('Failed to load admin settings:', err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        appName,
        appDescription,
        supportPhone,
        supportEmail,
        address,
        storeLogoUrl,
        currencySymbol,
        currencyCode,
        timezone,
        orderPrefix,
        defaultRadius: Number(defaultRadius || '15'),
        minOrderSpend: Number(minOrderSpend || '2000'),
        freeDeliveryThreshold: Number(freeDeliveryThreshold || '15000'),
        deliveryFee: Number(deliveryFee || '1500'),
        platformServiceFee: Number(platformServiceFee || '500'),
        taxRate: Number(taxRate || '7.5'),
        maintenanceMode,
        playStoreUrl,
        appStoreUrl,
        paystackPublicKey,
        paystackSecretKey,
      };

      const res = await apiFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        setSavedSuccess(true);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('groceryhub_settings_updated'));
          localStorage.setItem('groceryhub_settings_cache_ts', String(Date.now()));
        }
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert(json.message || 'Failed to save settings');
      }
    } catch (err) {
      alert('Error saving system settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Settings size={24} className="text-[#0aad0a]" /> Global Platform Settings
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Control platform branding, Nigerian localization, dispatch thresholds, and authentication policies
            </p>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-950/80 border border-[#0aad0a] text-[#0aad0a] px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 size={16} /> Configuration saved and applied!
            </div>
          )}
        </div>

        {/* Setting Category Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
          {[
            { id: 'general', label: 'Store Identity', icon: Settings },
            { id: 'localization', label: 'Currency & Timezone', icon: Globe },
            { id: 'orders', label: 'Orders & Fees', icon: Truck },
            { id: 'payment', label: 'Payment Gateway', icon: ShieldCheck },
            { id: 'security', label: 'Security & Maintenance', icon: Lock },
            { id: 'mobile', label: 'Mobile App Links', icon: Smartphone },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/30'
                    : 'bg-[#1e2632] hover:bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSave} className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* General Identity */}
          <div className={activeTab === 'general' ? 'space-y-5 block' : 'hidden'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">App Name / Brand Title</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Support Phone (+234)</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Platform Tagline</label>
              <input
                type="text"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Customer Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Physical Store / HQ Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>
            </div>

            <LocalImageUploader
              label="Store Header Logo (Local Storage)"
              folder="settings"
              value={storeLogoUrl}
              onChange={setStoreLogoUrl}
            />
          </div>

          {/* Localization */}
          <div className={activeTab === 'localization' ? 'space-y-4 block' : 'hidden'}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Currency Symbol</label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Currency Code (ISO)</label>
                <input
                  type="text"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Store Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Africa/Lagos (WAT)">Africa/Lagos (WAT - West Africa Time)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders & Dispatch Rules */}
          <div className={activeTab === 'orders' ? 'space-y-4 block' : 'hidden'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Order ID Prefix</label>
                <input
                  type="text"
                  value={orderPrefix}
                  onChange={(e) => setOrderPrefix(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Default Delivery Radius (km)</label>
                <input
                  type="number"
                  step="0.5"
                  value={defaultRadius}
                  onChange={(e) => setDefaultRadius(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Minimum Order Spend (₦)</label>
                <input
                  type="number"
                  step="100"
                  value={minOrderSpend}
                  onChange={(e) => setMinOrderSpend(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Free Delivery Threshold (₦)</label>
                <input
                  type="number"
                  step="500"
                  value={freeDeliveryThreshold}
                  onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>
            </div>

            {/* Delivery Fee, Platform Fee, VAT */}
            <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl space-y-4">
              <h3 className="text-xs font-black text-emerald-400 flex items-center gap-2">
                <Truck size={14} /> Checkout Fees & Tax (Live on Storefront)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Delivery Charge (₦)</label>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                  <p className="text-[10px] text-gray-500">Applied when order is below free-delivery threshold</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Platform Service Fee (₦)</label>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={platformServiceFee}
                    onChange={(e) => setPlatformServiceFee(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                  <p className="text-[10px] text-gray-500">Fixed platform handling fee per order</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">VAT / Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                  <p className="text-[10px] text-gray-500">Percentage applied on subtotal (e.g. 7.5 for 7.5%)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway */}
          <div className={activeTab === 'payment' ? 'space-y-5 block' : 'hidden'}>
            <div className="p-4 bg-blue-950/30 border border-blue-800/40 rounded-2xl">
              <h3 className="text-xs font-black text-blue-400 mb-1">Paystack Payment Gateway</h3>
              <p className="text-[11px] text-gray-400 mb-4">Live/test keys from your Paystack dashboard (dashboard.paystack.com). Leave blank to use keys from environment variables.</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Paystack Public Key (pk_...)</label>
                  <input
                    type="text"
                    value={paystackPublicKey}
                    onChange={(e) => setPaystackPublicKey(e.target.value)}
                    placeholder="pk_live_... or pk_test_..."
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Paystack Secret Key (sk_...)</label>
                  <input
                    type="password"
                    value={paystackSecretKey}
                    onChange={(e) => setPaystackSecretKey(e.target.value)}
                    placeholder="sk_live_... or sk_test_..."
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                  <p className="text-[10px] text-red-400">⚠️ Never share your secret key. Stored securely in MongoDB, never exposed to frontend.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Maintenance */}
          <div className={activeTab === 'security' ? 'space-y-5 block' : 'hidden'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">OTP Validity Expiration (Seconds)</label>
                <input
                  type="number"
                  value={otpExpirationSec}
                  onChange={(e) => setOtpExpirationSec(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Max Failed Login Attempts</label>
                <input
                  type="number"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Platform Maintenance Lockdown</h4>
                <p className="text-[11px] text-gray-400">Temporarily pause customer checkout while updating database indexes</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  maintenanceMode ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {maintenanceMode ? 'Lockdown ACTIVE' : 'Normal Operation'}
              </button>
            </div>
          </div>

          {/* Mobile App Store Links */}
          <div className={activeTab === 'mobile' ? 'space-y-4 block' : 'hidden'}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Google Play Store URL</label>
                <input
                  type="url"
                  value={playStoreUrl}
                  onChange={(e) => setPlayStoreUrl(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Apple App Store URL</label>
                <input
                  type="url"
                  value={appStoreUrl}
                  onChange={(e) => setAppStoreUrl(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSubmitting}
              className="bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black px-8 py-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save size={16} />
              )}
              <span>{isSubmitting ? 'Saving Settings...' : 'Save System Settings'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
