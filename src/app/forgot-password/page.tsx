'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, Mail, Phone, Lock, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return alert('Please enter your email or mobile number');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return alert('Please enter the 4-digit verification code');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return alert('Password must be at least 6 characters');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Your password has been successfully updated!');
      router.push('/login');
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-md mx-auto px-4 py-16 w-full flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0aad0a] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <KeyRound size={24} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Reset Account Password</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {step === 1 && 'Enter your registered mobile phone or email address'}
              {step === 2 && `Enter the 4-digit code sent to ${identifier}`}
              {step === 3 && 'Create a new secure password for your account'}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Mobile or Email</label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. +1 (555) 000-0000 or email"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                    required
                  />
                  <Mail size={18} className="absolute left-4 top-3 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
              >
                <span>{loading ? 'Sending Code...' : 'Send Reset Code'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">4-Digit Security Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="• • • •"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 px-4 text-center text-2xl tracking-widest font-black focus:outline-none focus:border-[#0aad0a] dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
              >
                <span>{loading ? 'Verifying...' : 'Verify Code'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] dark:text-white"
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
                <span>{loading ? 'Updating Password...' : 'Save New Password & Log In'}</span>
                <CheckCircle2 size={16} />
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
