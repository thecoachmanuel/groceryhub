'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Phone, Lock, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { useAuth } from '@/context/AuthContext';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [mobile, setMobile] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return alert('Please enter your mobile number');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login({
        mobile,
        name: 'Emma Davis',
        email: 'emma.davis@example.com',
      });
      setLoading(false);
      router.push('/');
    }, 800);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login({
        email: emailOrPhone.includes('@') ? emailOrPhone : 'customer@groceryhub.com',
        mobile: !emailOrPhone.includes('@') ? emailOrPhone : '+1 (555) 234-5678',
        name: emailOrPhone.split('@')[0] || 'Emma Davis',
      });
      setLoading(false);
      router.push('/');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-md mx-auto px-4 py-16 w-full flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0aad0a] text-white flex items-center justify-center mx-auto shadow-md shadow-[#0aad0a]/30">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sign in to access your digital wallet, order tracking, and express checkout
            </p>
          </div>

          {/* Auth Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('otp');
                setOtpSent(false);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'otp'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Instant Mobile OTP
            </button>
            <button
              onClick={() => setAuthMode('password')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'password'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Password Login
            </button>
          </div>

          {/* Form */}
          {authMode === 'otp' ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Mobile Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                      required
                    />
                    <Phone size={18} className="absolute left-4 top-3 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
                >
                  <span>{loading ? 'Sending OTP Code...' : 'Send Login OTP'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Enter 4-Digit OTP</label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#0aad0a] font-bold hover:underline"
                    >
                      Change Number
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="• • • •"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 px-4 text-center text-2xl tracking-widest font-black focus:outline-none focus:border-[#0aad0a] dark:text-white"
                    required
                  />
                  <p className="text-[11px] text-gray-400 text-center mt-1">Sent code to {mobile}</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
                >
                  <span>{loading ? 'Verifying...' : 'Verify OTP & Sign In'}</span>
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email or Mobile</label>
                <div className="relative">
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="emma.davis@example.com"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                    required
                  />
                  <Mail size={18} className="absolute left-4 top-3 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
                  <Link href="/forgot-password" className="text-[11px] text-[#0aad0a] font-bold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:border-[#0aad0a] dark:text-white"
                    required
                  />
                  <Lock size={18} className="absolute left-4 top-3 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              </button>
            </form>
          )}

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#0aad0a] font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
