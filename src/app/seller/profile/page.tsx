'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Store, MapPin, Clock, Phone, Mail, Save, CheckCircle2, UploadCloud } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';

export default function SellerProfilePage() {
  const [storeName, setStoreName] = useState('Green Valley Organic Farms');
  const [ownerName, setOwnerName] = useState('Robert Jenkins');
  const [email, setEmail] = useState('robert@greenvalley.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [address, setAddress] = useState('742 Evergreen Terrace, Brooklyn, NY 11201');
  const [openTime, setOpenTime] = useState('07:00 AM');
  const [closeTime, setCloseTime] = useState('10:00 PM');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-4xl mx-auto p-6 sm:p-10 space-y-6 w-full">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Store size={24} className="text-[#0aad0a]" /> Store Profile & Operating Schedule
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage your public storefront profile, store hours, and contact details</p>
          </div>

          <form onSubmit={handleSave} className="bg-[#1e2632] border border-gray-800 rounded-3xl p-8 space-y-6">
            {/* Store Banner */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Storefront Banner</label>
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700">
                <Image
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800"
                  alt="Store Banner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                  <div className="text-center space-y-1">
                    <UploadCloud size={24} className="mx-auto text-white" />
                    <span className="text-xs font-bold text-white">Click to Replace Store Banner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs */}
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
                <label className="text-xs font-bold text-gray-300">Owner Full Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
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
                <label className="text-xs font-bold text-gray-300">Daily Opening Time</label>
                <input
                  type="text"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Daily Closing Time</label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Save size={16} />
                <span>Save Store Profile</span>
              </button>

              {savedSuccess && (
                <span className="text-xs font-bold text-[#0aad0a] flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 size={16} /> Store profile updated successfully!
                </span>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
