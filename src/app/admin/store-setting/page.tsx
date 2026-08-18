'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sliders, 
  Save, 
  Store, 
  Receipt, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Percent, 
  CheckCircle2, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

export default function AdminStoreSettingPage() {
  const [minOrderFreeDelivery, setMinOrderFreeDelivery] = useState(15000.00);
  const [platformServiceFee, setPlatformServiceFee] = useState(350.00);
  const [deliveryChargeTaxId, setDeliveryChargeTaxId] = useState('1');
  const [additionalChargeTaxId, setAdditionalChargeTaxId] = useState('2');
  const [maxCodLimit, setMaxCodLimit] = useState(100000.00);
  const [prepBufferMinutes, setPrepBufferMinutes] = useState(20);
  const [nightSurcharge, setNightSurcharge] = useState(1000.00);
  const [maxDeliveryRadius, setMaxDeliveryRadius] = useState(25);
  const [allowMultipleVendorsCart, setAllowMultipleVendorsCart] = useState(true);
  const [autoAssignCourier, setAutoAssignCourier] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin/settings" className="text-xs text-gray-400 hover:text-[#0aad0a] flex items-center gap-1">
                <ArrowLeft size={12} /> Back to Global Settings
              </Link>
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Store size={24} className="text-[#0aad0a]" /> Store Operations &amp; Tax Rules
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure hyper-local store operational thresholds, platform service fees, delivery tax schedules, and cart rules in Naira (₦)
            </p>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-950/80 border border-[#0aad0a] text-[#0aad0a] px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 size={16} /> Store settings updated successfully!
            </div>
          )}
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/settings" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            General Platform Settings
          </Link>
          <Link href="/admin/store-setting" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <Store size={13} /> Store Operations &amp; Taxes
          </Link>
          <Link href="/admin/payment-methods" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Payment Gateways
          </Link>
          <Link href="/admin/sms-gateway" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            SMS Gateways
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1: Delivery & Fee Rules */}
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <Truck size={18} className="text-[#0aad0a]" />
                <h3 className="font-bold text-white text-sm">Delivery Thresholds &amp; Platform Service Fees</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Min Order for FREE Delivery (₦)</label>
                  <input
                    type="number"
                    step="500"
                    value={minOrderFreeDelivery}
                    onChange={(e) => setMinOrderFreeDelivery(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                  <p className="text-[11px] text-gray-500">Orders equal to or above this amount receive ₦0.00 standard delivery charge.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Hyper-Local Platform Service Fee (₦)</label>
                  <input
                    type="number"
                    step="50"
                    value={platformServiceFee}
                    onChange={(e) => setPlatformServiceFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                  <p className="text-[11px] text-gray-500">Operational platform fee itemized during customer checkout.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Max Delivery Radius (KM)</label>
                  <input
                    type="number"
                    value={maxDeliveryRadius}
                    onChange={(e) => setMaxDeliveryRadius(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Night Delivery Surcharge (₦)</label>
                  <input
                    type="number"
                    step="100"
                    value={nightSurcharge}
                    onChange={(e) => setNightSurcharge(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                  />
                  <p className="text-[11px] text-gray-500">Automatic surcharge applied for orders between 10:00 PM and 6:00 AM.</p>
                </div>
              </div>
            </div>

            {/* Card 2: Tax Schedules & COD Limits */}
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <Receipt size={18} className="text-amber-400" />
                <h3 className="font-bold text-white text-sm">Tax Linkages &amp; COD Payment Ceilings</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Delivery Charge Tax Rule</label>
                  <select
                    value={deliveryChargeTaxId}
                    onChange={(e) => setDeliveryChargeTaxId(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="1">Standard Nigerian VAT (7.5%)</option>
                    <option value="0">Tax Exempt (0%)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Additional Order Surcharge Tax Rule</label>
                  <select
                    value={additionalChargeTaxId}
                    onChange={(e) => setAdditionalChargeTaxId(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="1">Standard Nigerian VAT (7.5%)</option>
                    <option value="0">Tax Exempt (0%)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Max Cash on Delivery (COD) Limit (₦)</label>
                  <input
                    type="number"
                    step="5000"
                    value={maxCodLimit}
                    onChange={(e) => setMaxCodLimit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                  />
                  <p className="text-[11px] text-gray-500">Orders above this limit must pay online via Paystack / Card / USSD.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Store Packing &amp; Buffer Time (Mins)</label>
                  <input
                    type="number"
                    value={prepBufferMinutes}
                    onChange={(e) => setPrepBufferMinutes(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-8 py-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Save size={16} />
              <span>Save Store Operation Policies</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
