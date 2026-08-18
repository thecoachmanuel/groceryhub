'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Sparkles, ShieldCheck, ArrowLeft, CheckCircle2, X, Smartphone } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { formatNaira } from '@/lib/currency';
import { useAuth } from '@/context/AuthContext';

const WALLET_HISTORY = [
  { id: 'WAL-1092', type: 'Refund Credit', ref: 'Order #ORD-98241', amount: 3500, date: 'Aug 17, 2026', status: 'Credited' },
  { id: 'WAL-1091', type: 'Referral Reward', ref: 'Friend Promo GROCERY10', amount: 2000, date: 'Aug 16, 2026', status: 'Credited' },
  { id: 'WAL-1089', type: 'Order Payment', ref: 'Order #ORD-98235', amount: -14500, date: 'Aug 14, 2026', status: 'Debited' },
  { id: 'WAL-1082', type: 'Wallet Top-up', ref: 'Paystack Instant Transfer', amount: 25000, date: 'Aug 10, 2026', status: 'Credited' },
];

export default function CustomerWalletPage() {
  const { user, updateWallet } = useAuth();
  const isDemoUser = user?.email === 'customer@groceryhub.ng';
  const initialBalance = user ? user.walletBalance : 0;
  const [balance, setBalance] = useState(initialBalance);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('10000');
  const [topupSuccess, setTopupSuccess] = useState(false);

  const history = isDemoUser
    ? WALLET_HISTORY
    : (user?.walletBalance && user.walletBalance > 0
        ? [{ id: 'WAL-BONUS', type: 'Welcome Bonus', ref: 'Referral Credit', amount: user.walletBalance, date: 'Today', status: 'Credited' }]
        : []);

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topupAmount || '0');
    if (amt <= 0) return;
    setBalance(balance + amt);
    setShowTopupModal(false);
    setTopupSuccess(true);
    setTimeout(() => setTopupSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="space-y-2">
          <Link href="/" className="text-xs font-bold text-gray-500 hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet size={28} className="text-[#0aad0a]" /> My GroceryHub Naira Wallet
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Use your digital wallet balance for 1-click instant checkout and automated return cashbacks
          </p>
        </div>

        {topupSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} /> Wallet top-up successful! New balance updated in Naira (₦).
          </div>
        )}

        {/* Balance Card */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-300" /> Instant 1-Click Pay
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
              {formatNaira(balance)}
            </div>
            <p className="text-xs text-emerald-100">
              Zero transaction fees • Instant refund reversals • Powered by Paystack
            </p>
          </div>

          <button
            onClick={() => setShowTopupModal(true)}
            className="z-10 bg-white hover:bg-emerald-50 text-emerald-800 font-black px-6 py-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-black/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Top Up Wallet</span>
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-gray-900 dark:text-white">Recent Wallet Activity</h3>
            <span className="text-xs text-gray-400">Past 30 Days</span>
          </div>

          <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
            {history.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Wallet size={32} className="mx-auto text-gray-400" />
                <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300">No wallet transactions yet</h4>
                <p className="text-[11px] text-gray-400">Top up your wallet to start making fast 1-click doorstep purchases.</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      item.amount > 0 
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-[#0aad0a]' 
                        : 'bg-red-100 dark:bg-red-950/60 text-red-500'
                    }`}>
                      {item.amount > 0 ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">{item.type}</div>
                      <div className="text-[11px] text-gray-400">{item.ref} • {item.date}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-black font-mono ${
                      item.amount > 0 ? 'text-[#0aad0a]' : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.amount > 0 ? `+${formatNaira(item.amount)}` : formatNaira(item.amount)}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{item.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowTopupModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Top Up Naira Wallet</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Load funds via Paystack (Cards, Bank Transfer, USSD, OPay)
              </p>
            </div>

            <form onSubmit={handleTopup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Amount to Add (₦)</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['5000', '10000', '25000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`p-2.5 rounded-xl border text-xs font-bold font-mono transition-all ${
                        topupAmount === amt
                          ? 'border-[#0aad0a] bg-[#0aad0a]/10 text-[#0aad0a]'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {formatNaira(parseInt(amt, 10), false)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Enter custom amount..."
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl flex items-center gap-3">
                <Smartphone size={20} className="text-[#0aad0a]" />
                <div className="text-[11px] text-gray-600 dark:text-gray-300">
                  Secured by <strong>Paystack</strong>. Instant balance credit upon authorization.
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                >
                  Authorize Top-up ({formatNaira(parseFloat(topupAmount || '0'))})
                </button>
                <button
                  type="button"
                  onClick={() => setShowTopupModal(false)}
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
