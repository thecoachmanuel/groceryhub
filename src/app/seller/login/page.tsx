'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SellerLoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('+1 (555) 123-4567');
  const [password, setPassword] = useState('seller123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/seller/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#1e2632] rounded-3xl p-8 border border-gray-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0aad0a] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0aad0a]/30">
            <Store size={28} />
          </div>
          <h1 className="text-2xl font-black">Vendor / Seller Portal</h1>
          <p className="text-xs text-gray-400">Manage your store inventory, retail POS, and orders</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Registered Vendor Mobile</label>
            <div className="relative">
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a]"
                required
              />
              <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-300">Password</label>
              <span className="text-[#0aad0a] text-[11px] cursor-pointer hover:underline">Forgot?</span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
                required
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
          >
            <span>{loading ? 'Logging into Store...' : 'Access Seller Portal'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Want to sell on GroceryHub?{' '}
          <Link href="/seller/register" className="text-[#0aad0a] font-bold hover:underline">
            Register Store & Partner
          </Link>
        </div>

        <div className="pt-2 text-center text-xs text-gray-400 border-t border-gray-800 flex justify-between items-center">
          <Link href="/" className="hover:text-white">← Return to Storefront</Link>
          <Link href="/seller/pos" className="text-[#0aad0a] font-bold hover:underline">Open POS Terminal →</Link>
        </div>

      </div>
    </div>
  );
}
