'use client';

import { useState, useEffect } from 'react';
import { Store, User, Mail, Phone, MapPin, Building2, Save, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import LocalImageUploader from '@/components/common/LocalImageUploader';
import { useSellerAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api-fetch';

export default function SellerProfilePage() {
  const { seller } = useSellerAuth();
  const [storeName, setStoreName] = useState('Green Valley Organic Farms');
  const [ownerName, setOwnerName] = useState('Vendor Partner');
  const [email, setEmail] = useState('vendor@groceryhub.ng');
  const [mobile, setMobile] = useState('+234 800 123 4567');
  const [address, setAddress] = useState('Plot 18, Agro Industrial Estate, Epe, Lagos');
  const [city, setCity] = useState('Lagos');
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?w=200');
  const [bankName, setBankName] = useState('Zenith Bank PLC');
  const [accountNumber, setAccountNumber] = useState('2048910492');
  const [accountName, setAccountName] = useState('Green Valley Farms LTD');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSellerProfile() {
      try {
        const res = await apiFetch('/api/auth/me');
        const json = await res.json();
        if (json.success && json.data?.user) {
          const u = json.data.user;
          if (u.store_name) setStoreName(u.store_name);
          if (u.name) setOwnerName(u.name);
          if (u.email) setEmail(u.email);
          if (u.mobile) setMobile(u.mobile);
          if (u.address) setAddress(u.address);
          if (u.city) setCity(u.city);
          if (u.logo) setLogo(u.logo);
          if (u.bank_name) setBankName(u.bank_name);
          if (u.account_number) setAccountNumber(u.account_number);
          if (u.account_name) setAccountName(u.account_name);
        }
      } catch (err) {
        console.warn('Failed to fetch seller profile:', err);
      }
    }
    loadSellerProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sellerId = (seller as any)?._id || (seller as any)?.id || (seller as any)?.seller_id;
      if (sellerId) {
        await apiFetch('/api/admin/sellers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: sellerId,
            store_name: storeName,
            name: ownerName,
            mobile,
            address,
            city,
            logo,
            bank_name: bankName,
            account_number: accountNumber,
            account_name: accountName,
          }),
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      alert('Failed to update seller profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-4xl mx-auto p-4 sm:p-10 space-y-6 w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <Store size={24} className="text-[#0aad0a]" /> Store &amp; Vendor Profile Settings
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage certified partner details, store address, and bank settlement account in Nigeria</p>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> Store profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Store Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-gray-800 pb-3">
                <Store size={16} className="text-[#0aad0a]" /> Store Business Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Store / Business Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Store Manager / Owner Name</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Official Contact Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-gray-900/60 border border-gray-800 text-gray-400 rounded-xl p-3 text-xs focus:outline-none cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Support Mobile (+234)</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Physical Store Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">City / State</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <LocalImageUploader
                label="Store Logo Image"
                folder="sellers"
                value={logo}
                onChange={setLogo}
              />
            </div>

            {/* Bank Payout Information */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-gray-800 pb-3">
                <Building2 size={16} className="text-[#0aad0a]" /> Nigerian NIBSS Bank Payout Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Account Number (10 Digits)</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white font-mono rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black px-8 py-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{saving ? 'Saving Profile...' : 'Save Profile Settings'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
