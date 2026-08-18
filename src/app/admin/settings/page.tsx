'use client';

import { useState } from 'react';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  Globe, 
  DollarSign, 
  ShieldAlert, 
  Truck, 
  Smartphone, 
  Building,
  UploadCloud
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LocalImageUploader from '@/components/common/LocalImageUploader';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'localization' | 'orders' | 'security' | 'mobile'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // General Identity
  const [appName, setAppName] = useState('GroceryHub');
  const [appDescription, setAppDescription] = useState('Hyper-local 30-minute grocery delivery platform');
  const [supportPhone, setSupportPhone] = useState('+1 (800) 123-4567');
  const [supportEmail, setSupportEmail] = useState('support@groceryhub.com');
  const [address, setAddress] = useState('124 Market Square, Downtown Zone, NY 10001');
  const [storeLogoUrl, setStoreLogoUrl] = useState('');

  // Localization
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York (EST)');

  // Orders & Logistics Defaults
  const [orderPrefix, setOrderPrefix] = useState('ORD-');
  const [defaultRadius, setDefaultRadius] = useState('7.5');
  const [minOrderSpend, setMinOrderSpend] = useState('15.00');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('50.00');
  const [autoAssignDrivers, setAutoAssignDrivers] = useState(true);

  // Security & Auth
  const [otpExpirationSec, setOtpExpirationSec] = useState('120');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Mobile App Links
  const [playStoreUrl, setPlayStoreUrl] = useState('https://play.google.com/store/apps/details?id=com.groceryhub.customer');
  const [appStoreUrl, setAppStoreUrl] = useState('https://apps.apple.com/app/groceryhub-delivery/id159023481');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Sliders size={24} className="text-[#0aad0a]" /> System & Store Configuration
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Control global store settings, currency localization, default dispatch thresholds, and maintenance mode
            </p>
          </div>

          <button
            onClick={handleSave}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Save size={16} />
            <span>Save Configuration</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} /> Store configuration settings saved successfully!
          </div>
        )}

        {/* Setting Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-800">
          {[
            { id: 'general', label: 'Store Identity & Contact', icon: Building },
            { id: 'localization', label: 'Currency & Timezone', icon: DollarSign },
            { id: 'orders', label: 'Order & Dispatch Rules', icon: Truck },
            { id: 'security', label: 'Security & Maintenance', icon: ShieldAlert },
            { id: 'mobile', label: 'Mobile App URLs', icon: Smartphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                    : 'bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSave} className="bg-[#1e2632] border border-gray-800 rounded-3xl p-8 space-y-6 max-w-4xl">
          {/* General Identity */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Store / App Name</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Customer Support Phone</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Customer Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Physical Store / HQ Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
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
          )}

          {/* Localization */}
          {activeTab === 'localization' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Currency Symbol</label>
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Currency Code (ISO)</label>
                  <input
                    type="text"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Store Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                    <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                    <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                    <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                    <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Orders & Dispatch Rules */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Order ID Prefix</label>
                  <input
                    type="text"
                    value={orderPrefix}
                    onChange={(e) => setOrderPrefix(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
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
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Minimum Order Spend ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minOrderSpend}
                    onChange={(e) => setMinOrderSpend(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Free Delivery Threshold ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={freeDeliveryThreshold}
                    onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security & Maintenance */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">OTP Validity Expiration (Seconds)</label>
                  <input
                    type="number"
                    value={otpExpirationSec}
                    onChange={(e) => setOtpExpirationSec(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Max Failed Login Attempts</label>
                  <input
                    type="number"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-900/80 rounded-2xl border border-gray-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">Store Maintenance Mode</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    When active, customers will see a temporary maintenance message while admins retain access
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    maintenanceMode
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {maintenanceMode ? 'ENABLED (Offline)' : 'DISABLED (Online)'}
                </button>
              </div>
            </div>
          )}

          {/* Mobile App URLs */}
          {activeTab === 'mobile' && (
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
          )}

          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <button
              type="submit"
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-8 py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              Save Configuration Settings
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
