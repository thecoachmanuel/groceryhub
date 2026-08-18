'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Bell, Send, CheckCircle2, ArrowLeft, Sparkles, Building } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

export default function ServiceAreaNotifyPage() {
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || (!email && !phone)) {
      return alert('Please enter your city and an email or phone number');
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121820] text-gray-900 dark:text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12 w-full space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0aad0a] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Storefront
        </Link>

        <div className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#0aad0a] flex items-center justify-center border border-[#0aad0a]/20">
            <MapPin size={28} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-[#0aad0a] px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles size={13} /> Rapid Expansion
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Is GroceryHub in Your Area?</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              We are constantly onboarding certified local farms and opening new 30-minute delivery zones across Nigeria. Tell us your location and get a <strong>₦5,000 free grocery voucher</strong> when we launch in your area!
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-[#0aad0a]/40 text-[#0aad0a] p-6 rounded-2xl space-y-2 text-center animate-fade-in">
              <CheckCircle2 size={36} className="mx-auto" />
              <h3 className="font-black text-base">You&apos;re on the Priority Launch List!</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                We&apos;ve noted <strong>{city} ({zipCode})</strong>. We will notify you immediately when delivery launches with your ₦5,000 welcome bonus coupon code.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">City / State</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lekki, Lagos"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Area / Postal Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g. 101233"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.ng"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Mobile Phone (For Launch SMS)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Bell size={16} />
                <span>Notify Me &amp; Claim ₦5,000 Credit</span>
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
