'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, Lock, Phone, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';
import { useRiderAuth } from '@/context/AuthContext';

export default function DeliveryRiderLoginPage() {
  const router = useRouter();
  const { riderLogin } = useRiderAuth();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/delivery/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          password,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        return setErrorMsg(data.message || 'Courier login failed. Invalid credentials.');
      }

      // Store rider session via unified AuthContext
      riderLogin(data.data.token, data.data.delivery_boy);

      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/delivery/dashboard';
      router.push(redirectTo);
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error occurred. Please try again.');
    }
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

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-800 text-red-400 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Registered Courier Mobile</label>
            <div className="relative">
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+234 809 111 2233"
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
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Courier Shift'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-400">
          Want to become an electric fleet courier?{' '}
          <Link href="/delivery/register" className="text-amber-400 font-bold hover:underline">
            Register as a Delivery Partner
          </Link>
        </div>
      </div>
    </div>
  );
}
