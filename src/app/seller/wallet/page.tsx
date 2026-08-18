'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Download, 
  DollarSign, 
  Receipt, 
  Calendar,
  Building2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';

interface WalletEntry {
  id: string;
  type: 'Order Credit' | 'Platform Commission' | 'Bank Payout' | 'Return Refund' | 'Adjustment';
  reference: string;
  amount: number;
  balance_after: number;
  date: string;
  status: 'Settled' | 'Transferred' | 'Deducted';
}

const INITIAL_WALLET_ENTRIES: WalletEntry[] = [
  { id: 'WL-9014', type: 'Order Credit', reference: 'ORD-98241', amount: +45.00, balance_after: 4850.00, date: '2026-08-17 19:30', status: 'Settled' },
  { id: 'WL-9013', type: 'Platform Commission', reference: 'ORD-98241 (10%)', amount: -4.50, balance_after: 4805.00, date: '2026-08-17 19:30', status: 'Deducted' },
  { id: 'WL-9012', type: 'Order Credit', reference: 'ORD-98240', amount: +28.50, balance_after: 4809.50, date: '2026-08-17 18:15', status: 'Settled' },
  { id: 'WL-9011', type: 'Platform Commission', reference: 'ORD-98240 (10%)', amount: -2.85, balance_after: 4781.00, date: '2026-08-17 18:15', status: 'Deducted' },
  { id: 'WL-9010', type: 'Bank Payout', reference: 'PAYOUT-204 to Chase Bank', amount: -1500.00, balance_after: 4783.85, date: '2026-08-15 11:20', status: 'Transferred' },
  { id: 'WL-9009', type: 'Order Credit', reference: 'ORD-98238', amount: +62.10, balance_after: 6283.85, date: '2026-08-14 16:45', status: 'Settled' },
  { id: 'WL-9008', type: 'Platform Commission', reference: 'ORD-98238 (10%)', amount: -6.21, balance_after: 6221.75, date: '2026-08-14 16:45', status: 'Deducted' },
];

export default function SellerWalletPage() {
  const [entries, setEntries] = useState<WalletEntry[]>(INITIAL_WALLET_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const currentBalance = 4850.00;
  const totalLifetimeEarned = 14280.50;
  const totalWithdrawn = 9430.50;

  const filtered = entries.filter(e => {
    if (filterType !== 'All' && e.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.id.toLowerCase().includes(q) ||
        e.reference.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Wallet size={24} className="text-[#0aad0a]" /> Vendor Settlement Wallet & Ledger
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Full chronological ledger of customer order payouts, platform commission splits, and bank transfers
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/seller/withdrawal"
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Building2 size={16} />
                <span>Withdrawal Requests</span>
              </Link>
            </div>
          </div>

          {/* Sub-nav */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
            <Link href="/seller/earnings" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
              Earnings Overview
            </Link>
            <Link href="/seller/wallet" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
              <Receipt size={13} /> Wallet Ledger
            </Link>
            <Link href="/seller/withdrawal" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
              Bank Payout Requests
            </Link>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
              <span className="text-xs font-bold text-gray-400">Available Wallet Balance</span>
              <div className="text-3xl font-black text-[#0aad0a] font-mono">
                ${currentBalance.toFixed(2)}
              </div>
              <span className="text-[11px] text-gray-400">Ready for instant ACH withdrawal</span>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
              <span className="text-xs font-bold text-gray-400">Lifetime Gross Sales</span>
              <div className="text-3xl font-black text-white font-mono">
                ${totalLifetimeEarned.toFixed(2)}
              </div>
              <span className="text-[11px] text-gray-400">All customer orders fulfilled</span>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
              <span className="text-xs font-bold text-gray-400">Total Disbursed to Bank</span>
              <div className="text-3xl font-black text-blue-400 font-mono">
                ${totalWithdrawn.toFixed(2)}
              </div>
              <span className="text-[11px] text-[#0aad0a] font-semibold">100% successful payout rate</span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-[#1e2632] border border-gray-800 p-1.5 rounded-2xl w-fit text-xs font-bold">
              {['All', 'Order Credit', 'Platform Commission', 'Bank Payout'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    filterType === t
                      ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ledger by reference, ID..."
                className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
              />
              <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Transaction #</th>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Order / Payout Reference</th>
                    <th className="pb-3 px-3">Amount</th>
                    <th className="pb-3 px-3">Running Balance</th>
                    <th className="pb-3 px-3">Timestamp</th>
                    <th className="pb-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-white">
                        {e.id}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="flex items-center gap-1.5 font-bold text-white">
                          {e.amount > 0 ? (
                            <ArrowDownLeft size={14} className="text-[#0aad0a]" />
                          ) : (
                            <ArrowUpRight size={14} className="text-amber-400" />
                          )}
                          <span>{e.type}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-300">
                        {e.reference}
                      </td>
                      <td className={`py-3.5 px-3 font-mono font-black text-sm ${
                        e.amount > 0 ? 'text-[#0aad0a]' : 'text-amber-400'
                      }`}>
                        {e.amount > 0 ? `+$${e.amount.toFixed(2)}` : `-$${Math.abs(e.amount).toFixed(2)}`}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-gray-300 font-bold">
                        ${e.balance_after.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-gray-400 text-[11px]">
                        {e.date}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          e.status === 'Settled' 
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : e.status === 'Transferred'
                            ? 'bg-blue-950/40 text-blue-400 border border-blue-800/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                          ● {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
