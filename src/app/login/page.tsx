'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, Phone, Lock, ArrowRight, ShieldCheck, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { useAuth } from '@/context/AuthContext';

function CustomerLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginSession, isAuthenticated } = useAuth();
  const sessionExpired = searchParams?.get('expired') === '1';

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(sessionExpired ? 'Your session expired. Please log in again to continue.' : '');

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTarget = searchParams?.get('redirect') || '/';
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, searchParams, router]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier || !password) {
      return setErrorMsg('Please enter your email/mobile and password.');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier.includes('@') ? identifier : undefined,
          mobile: !identifier.includes('@') ? identifier : undefined,
          password,
          auth_mode: 'password',
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        return setErrorMsg(data.message || 'Login failed. Please check your credentials.');
      }

      loginSession(data.data.token, data.data.user);
      // Redirect to ?redirect param or homepage
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/';
      window.location.href = redirectTo;
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Network or server error. Please try again.');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return setErrorMsg('Please enter your mobile phone number.');
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otp) return setErrorMsg('Please enter the 4-digit OTP code.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: identifier,
          auth_mode: 'otp',
          otp,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        return setErrorMsg(data.message || 'Invalid OTP code.');
      }

      loginSession(data.data.token, data.data.user);
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/';
      window.location.href = redirectTo;
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Verification failed. Please try again.');
    }
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
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Customer Sign In</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sign in with your registered GroceryHub account
            </p>
          </div>

          {/* Auth Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('password');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'password'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Password Login
            </button>
            <button
              onClick={() => {
                setAuthMode('otp');
                setOtpSent(false);
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'otp'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Instant OTP Login
            </button>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '613050846299-5q32jiodl8n0g4ia125aq0ucf016b765.apps.googleusercontent.com';
              const redirectUri = `${window.location.origin}/api/auth/google/callback`;
              const scope = encodeURIComponent('openid profile email');
              const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=select_account`;
              window.location.href = googleAuthUrl;
            }}
            className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 text-xs shadow-sm transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {authMode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. customer@groceryhub.ng"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                    required
                  />
                  <Mail size={18} className="absolute left-4 top-3 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
                  <Link href="/forgot-password" className="text-[11px] font-bold text-[#0aad0a] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                    required
                  />
                  <Lock size={18} className="absolute left-4 top-3 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98] text-xs"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Mobile Phone Number (+234)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="+234 802 345 6789"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                        required
                      />
                      <Phone size={18} className="absolute left-4 top-3 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98] text-xs"
                  >
                    <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-[#0aad0a]/40 rounded-2xl text-xs text-[#0aad0a] font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>OTP sent to {identifier}. (Demo code: 1234)</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Enter 4-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 px-4 text-center font-mono text-lg font-black tracking-widest focus:outline-none focus:border-[#0aad0a] dark:text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98] text-xs"
                  >
                    <span>{loading ? 'Verifying...' : 'Verify OTP & Log In'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            Don&apos;t have a registered account?{' '}
            <Link href="/register" className="font-bold text-[#0aad0a] hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121820]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a]" />
        </div>
      }
    >
      <CustomerLoginPageContent />
    </Suspense>
  );
}
