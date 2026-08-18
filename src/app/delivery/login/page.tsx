'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, Lock, Phone, ArrowRight, UserPlus } from 'lucide-react';

export default function DeliveryRiderLoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('+1 (555) 789-0123');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/delivery/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e2632] border border-gray-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-gray-900 flex items-center justify-center font-black mx-auto shadow-lg shadow-amber-500/20">
            <Truck size={28} />
          </div>
          <h1 className="text-2xl font-black">Courier Rider Portal</h1>
          <p className="text-xs text-gray-400">Sign in to start your delivery shift and view active runs</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Mobile Phone</label>
            <div className="relative">
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3.5 pl-10 text-xs focus:outline-none focus:border-amber-400"
                required
              />
              <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3.5 pl-10 text-xs focus:outline-none focus:border-amber-400"
                required
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <span>{loading ? 'Starting Shift...' : 'Sign In to Courier Terminal'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Want to become a driver?{' '}
          <Link href="/delivery/register" className="text-amber-400 font-bold hover:underline">
            Register as Courier Partner
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-800 text-center space-y-2 text-xs text-gray-400">
          <Link href="/delivery-policy" className="hover:text-white underline block">
            Courier Delivery Terms & Safety Guidelines
          </Link>
          <Link href="/" className="hover:text-amber-400 font-bold block pt-1">
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
