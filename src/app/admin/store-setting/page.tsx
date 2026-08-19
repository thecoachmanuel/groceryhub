'use client';

import { useState, useEffect } from 'react';
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
import { apiFetch } from '@/lib/api-fetch';

export default function AdminStoreSettingPage() {
  const [minOrderFreeDelivery, setMinOrderFreeDelivery] = useState(15000.00);
  const [platformServiceFee, setPlatformServiceFee] = useState(500.00);
  const [deliveryFee, setDeliveryFee] = useState(1500.00);
  const [taxRate, setTaxRate] = useState(7.5);
  const [maxCodLimit, setMaxCodLimit] = useState(100000.00);
  const [prepBufferMinutes, setPrepBufferMinutes] = useState(20);
  const [nightSurcharge, setNightSurcharge] = useState(1000.00);
  const [maxDeliveryRadius, setMaxDeliveryRadius] = useState(25);
  const [allowMultipleVendorsCart, setAllowMultipleVendorsCart] = useState(true);
  const [autoAssignCourier, setAutoAssignCourier] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await apiFetch('/api/admin/settings');
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          if (s.freeDeliveryThreshold !== undefined) setMinOrderFreeDelivery(s.freeDeliveryThreshold);
          if (s.platformServiceFee !== undefined) setPlatformServiceFee(s.platformServiceFee);
          if (s.deliveryFee !== undefined) setDeliveryFee(s.deliveryFee);
          if (s.taxRate !== undefined) setTaxRate(s.taxRate);
          if (s.maxCodLimit !== undefined) setMaxCodLimit(s.maxCodLimit);
          if (s.prepBufferMinutes !== undefined) setPrepBufferMinutes(s.prepBufferMinutes);
          if (s.nightSurcharge !== undefined) setNightSurcharge(s.nightSurcharge);
          if (s.maxDeliveryRadius !== undefined) setMaxDeliveryRadius(s.maxDeliveryRadius);
          if (s.allowMultipleVendorsCart !== undefined) setAllowMultipleVendorsCart(s.allowMultipleVendorsCart);
          if (s.autoAssignCourier !== undefined) setAutoAssignCourier(s.autoAssignCourier);
        }
      } catch (err) {
        console.warn('Error loading store settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          freeDeliveryThreshold: minOrderFreeDelivery,
          platformServiceFee,
          deliveryFee,
          taxRate,
          maxCodLimit,
          prepBufferMinutes,
          nightSurcharge,
          maxDeliveryRadius,
          allowMultipleVendorsCart,
          autoAssignCourier,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('groceryhub_settings_updated'));
        }
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(json.message || 'Failed to save settings');
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving settings');
    } finally {
      setSubmitting(false);
    }
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

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
            <p className="text-xs text-gray-400">Loading live store settings from database...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card 1: Delivery & Fee Rules */}
              <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <Truck size={18} className="text-[#0aad0a]" />
                  <h3 className="font-bold text-white text-sm">Delivery Thresholds &amp; Platform Fees</h3>
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
                    <label className="font-bold text-gray-300">Standard Delivery Charge (₦)</label>
                    <input
                      type="number"
                      step="100"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                      required
                    />
                    <p className="text-[11px] text-gray-500">Standard delivery charge applied for orders below free delivery threshold.</p>
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
              <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <Receipt size={18} className="text-amber-400" />
                  <h3 className="font-bold text-white text-sm">Tax Linkages &amp; COD Payment Ceilings</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-300">Global Value-Added Tax (VAT Rate %)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      placeholder="7.5"
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                      required
                    />
                    <p className="text-[11px] text-gray-500">Applied across Checkout and POS terminals (e.g. 7.5% Nigerian VAT).</p>
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

                  {/* Toggles */}
                  <div className="pt-3 border-t border-gray-800 space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-gray-300">Allow Multi-Vendor Shopping Cart</span>
                      <input
                        type="checkbox"
                        checked={allowMultipleVendorsCart}
                        onChange={(e) => setAllowMultipleVendorsCart(e.target.checked)}
                        className="w-4 h-4 accent-[#0aad0a] rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-gray-300">Auto-Assign Nearest Courier Rider</span>
                      <input
                        type="checkbox"
                        checked={autoAssignCourier}
                        onChange={(e) => setAutoAssignCourier(e.target.checked)}
                        className="w-4 h-4 accent-[#0aad0a] rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-8 py-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save size={16} />
                )}
                <span>Save Store Operation Policies</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
