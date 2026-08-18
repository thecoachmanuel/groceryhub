'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, User, Mail, Phone, Lock, Gift, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { useAuth } from '@/context/AuthContext';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return alert('Please agree to Terms and Conditions');
    setLoading(true);

    setTimeout(() => {
      register({
        name,
        email,
        mobile,
        referralCode,
      });
      setLoading(false);
      router.push('/');
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-md mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0aad0a] text-white flex items-center justify-center mx-auto shadow-md shadow-[#0aad0a]/30">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Create Your Account</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Join GroceryHub to unlock 30-min express grocery deliveries
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Emma Davis"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                  required
                />
                <User size={18} className="absolute left-4 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emma.davis@example.com"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                  required
                />
                <Mail size={18} className="absolute left-4 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Mobile Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                  required
                />
                <Phone size={18} className="absolute left-4 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:border-[#0aad0a] dark:text-white"
                  required
                />
                <Lock size={18} className="absolute left-4 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <span>Referral Code</span>
                <span className="text-[10px] text-[#0aad0a] font-bold">($10 bonus credit)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FRIEND10 (Optional)"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs font-mono uppercase focus:outline-none focus:border-[#0aad0a] dark:text-white"
                />
                <Gift size={18} className="absolute left-4 top-3 text-gray-400" />
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 dark:text-gray-300 pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#0aad0a] bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-0"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms-condition" className="text-[#0aad0a] font-bold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-[#0aad0a] font-bold hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account & Start Shopping'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-1">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0aad0a] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
