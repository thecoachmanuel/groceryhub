'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Download, 
  Receipt, 
  Calendar,
  Building2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';

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
  { id: 'WL-9014', type: 'Order Credit', reference: 'ORD-98241', amount: +45000.00, balance_after: 485000.00, date: '2026-08-17 19:30', status: 'Settled' },
  { id: 'WL-9013', type: 'Platform Commission', reference: 'ORD-98241 (5%)', amount: -2250.00, balance_after: 440000.00, date: '2026-08-17 19:30', status: 'Deducted' },
  { id: 'WL-9012', type: 'Order Credit', reference: 'ORD-98240', amount: +28500.00, balance_after: 442250.00, date: '2026-08-17 18:15', status: 'Settled' },
  { id: 'WL-9011', type: 'Platform Commission', reference: 'ORD-98240 (5%)', amount: -1425.00, balance_after: 413750.00, date: '2026-08-17 18:15', status: 'Deducted' },
  { id: 'WL-9010', type: 'Bank Payout', reference: 'PAYOUT-204 to Zenith Bank', amount: -150000.00, balance_after: 415175.00, date: '2026-08-15 11:20', status: 'Transferred' },
  { id: 'WL-9009', type: 'Order Credit', reference: 'ORD-98238', amount: +62100.00, balance_after: 565175.00, date: '2026-08-14 16:45', status: 'Settled' },
  { id: 'WL-9008', type: 'Platform Commission', reference: 'ORD-98238 (5%)', amount: -3105.00, balance_after: 503075.00, date: '2026-08-14 16:45', status: 'Deducted' },
];

export default function SellerWalletPage() {
  const [entries, setEntries] = useState<WalletEntry[]>(INITIAL_WALLET_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const currentBalance = 485000.00;
  const totalLifetimeEarned = 1428000.50;
  const totalWithdrawn = 943000.50;

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
                <Wallet size={24} className="text-[#0aad0a]" /> Vendor Settlement Wallet &amp; Ledger
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Full chronological ledger of customer order payouts, platform commission splits, and bank transfers in Naira (₦)
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
                {formatNaira(currentBalance)}
              </div>
              <span className="text-[11px] text-gray-400">Ready for instant NUBAN bank transfer</span>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
              <span className="text-xs font-bold text-gray-400">Lifetime Gross Sales</span>
              <div className="text-3xl font-black text-white font-mono">
                {formatNaira(totalLifetimeEarned)}
              </div>
              <span className="text-[11px] text-gray-400">All customer orders fulfilled</span>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
              <span className="text-xs font-bold text-gray-400">Total Disbursed to Bank</span>
              <div className="text-3xl font-black text-blue-400 font-mono">
                {formatNaira(totalWithdrawn)}
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

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Txn ID or Order Ref..."
                className="bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] w-64"
              />
              <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="pb-3 px-3 font-bold">Txn ID</th>
                    <th className="pb-3 px-3 font-bold">Transaction Type</th>
                    <th className="pb-3 px-3 font-bold">Reference / Notes</th>
                    <th className="pb-3 px-3 font-bold">Amount (₦)</th>
                    <th className="pb-3 px-3 font-bold">Balance After (₦)</th>
                    <th className="pb-3 px-3 font-bold">Timestamp</th>
                    <th className="pb-3 px-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
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
                        {e.amount > 0 ? `+${formatNaira(e.amount)}` : `-${formatNaira(Math.abs(e.amount))}`}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-gray-300 font-bold">
                        {formatNaira(e.balance_after)}
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
