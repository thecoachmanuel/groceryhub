'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        return setErrorMsg(data.message || 'Invalid admin credentials.');
      }

      adminLogin(data.data.token);

      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/admin/dashboard';
      router.push(redirectTo);
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#1e2632] rounded-3xl p-8 border border-gray-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0aad0a] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0aad0a]/30">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-2xl font-black">Super Admin Console</h1>
          <p className="text-xs text-gray-400">Sign in to manage multi-vendor grocery ecosystem</p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-800 text-red-400 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a]"
                required
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-300">Password</label>
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
            <span>{loading ? 'Authenticating...' : 'Access Admin Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-400 border-t border-gray-800 flex justify-between items-center">
          <Link href="/" className="hover:text-white">← Return to Storefront</Link>
          <span className="flex items-center gap-1 text-[11px] text-gray-500">
            <ShieldCheck size={13} className="text-[#0aad0a]" /> 256-bit Encrypted
          </span>
        </div>

      </div>
    </div>
  );
}
