'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MapPin, Plus, Trash2, Edit3, ArrowLeft, CheckCircle2, Home, Briefcase, X, Save, LogOut, Wallet, Gift } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { useAuth } from '@/context/AuthContext';

interface SavedAddress {
  id: number;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  mobile: string;
  flat: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: SavedAddress[] = [
  { id: 1, type: 'Home', name: 'Emma Davis', mobile: '+1 (555) 234-5678', flat: 'Apt 4B, 5th Floor', area: '742 Evergreen Terrace, Downtown', city: 'New York', pincode: '10001', isDefault: true },
  { id: 2, type: 'Work', name: 'Emma Davis', mobile: '+1 (555) 234-5678', flat: 'Floor 12, Office 1204', area: '500 5th Avenue, Midtown', city: 'New York', pincode: '10110', isDefault: false },
];

export default function CustomerProfilePage() {
  const { user, login, logout } = useAuth();

  const [name, setName] = useState(user?.name || 'Emma Davis');
  const [email, setEmail] = useState(user?.email || 'emma.davis@example.com');
  const [mobile, setMobile] = useState(user?.mobile || '+1 (555) 234-5678');
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setMobile(user.mobile);
    }
  }, [user]);

  // Modal fields
  const [modalType, setModalType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [modalFlat, setModalFlat] = useState('');
  const [modalArea, setModalArea] = useState('');
  const [modalCity, setModalCity] = useState('New York');
  const [modalPincode, setModalPincode] = useState('10001');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      ...user,
      name,
      email,
      mobile,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: SavedAddress = {
      id: Date.now(),
      type: modalType,
      name,
      mobile,
      flat: modalFlat,
      area: modalArea,
      city: modalCity,
      pincode: modalPincode,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddr]);
    setShowAddModal(false);
    setModalFlat('');
    setModalArea('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link href="/" className="text-xs font-bold text-gray-500 hover:text-[#0aad0a] flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Store
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <User size={28} className="text-[#0aad0a]" /> Account Profile & Address Book
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Manage your personal contact details, saved delivery addresses, and referral rewards
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-50 dark:bg-red-950/40 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/60 font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-2 transition-colors"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Quick User Stats Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white font-black text-2xl flex items-center justify-center border border-white/20 shadow-md">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-black">{name}</h3>
              <p className="text-xs text-emerald-100">{email} • {mobile}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/20">
              <span className="text-[10px] uppercase font-bold text-emerald-100 block">Digital Wallet</span>
              <span className="font-black text-base text-amber-300">${(user?.walletBalance ?? 0).toFixed(2)}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/20">
              <span className="text-[10px] uppercase font-bold text-emerald-100 block">Referral Code</span>
              <span className="font-mono font-black text-xs text-white">{user?.referralCode || 'EMMA894'}</span>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} /> Profile details saved and updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="md:col-span-1 bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-gray-900 dark:text-white">Personal Information</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Mobile Phone</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Save size={15} />
              <span>Update Profile</span>
            </button>
          </form>

          {/* Saved Addresses List */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900 dark:text-white">Saved Delivery Addresses</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#0aad0a]/20 transition-all active:scale-95"
              >
                <Plus size={15} />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white dark:bg-[#1e2632] rounded-3xl p-5 border transition-all ${
                    addr.isDefault
                      ? 'border-[#0aad0a] shadow-md shadow-[#0aad0a]/10'
                      : 'border-gray-100 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-[#0aad0a]/10 text-[#0aad0a] flex items-center gap-1">
                          {addr.type === 'Home' ? <Home size={12} /> : <Briefcase size={12} />}
                          {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 text-[#0aad0a]">
                            ● Default Delivery Address
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-gray-900 dark:text-white pt-1">{addr.flat}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{addr.area}, {addr.city} - {addr.pincode}</p>
                      <p className="text-xs text-gray-400 font-semibold">{addr.name} • {addr.mobile}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-xs font-bold text-gray-500 hover:text-[#0aad0a] border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-lg"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => setAddresses(addresses.filter((a) => a.id !== addr.id))}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-gray-900 dark:text-white">Add Delivery Address</h3>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Address Label</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setModalType(type)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        modalType === type
                          ? 'border-[#0aad0a] bg-[#0aad0a]/10 text-[#0aad0a]'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Flat / House / Floor</label>
                <input
                  type="text"
                  value={modalFlat}
                  onChange={(e) => setModalFlat(e.target.value)}
                  placeholder="e.g. Apt 4B, 5th Floor"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Street / Area / Landmark</label>
                <input
                  type="text"
                  value={modalArea}
                  onChange={(e) => setModalArea(e.target.value)}
                  placeholder="e.g. 124 Market Square, Downtown"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">City</label>
                  <input
                    type="text"
                    value={modalCity}
                    onChange={(e) => setModalCity(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Zip / Pincode</label>
                  <input
                    type="text"
                    value={modalPincode}
                    onChange={(e) => setModalPincode(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30"
                >
                  Save Delivery Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
