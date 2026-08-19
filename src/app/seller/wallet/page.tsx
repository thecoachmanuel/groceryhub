'use client';

import { useState, useEffect } from 'react';
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
  Filter,
  RefreshCw
} from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { apiFetch } from '@/lib/api-fetch';
import { useSellerAuth } from '@/context/AuthContext';

interface WalletEntry {
  id: string;
  type: string;
  reference: string;
  amount: number;
  balance_after: number;
  date: string;
  status: 'Settled' | 'Transferred' | 'Deducted' | 'Pending';
}

export default function SellerWalletPage() {
  const { seller } = useSellerAuth();
  const [entries, setEntries] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [currentBalance, setCurrentBalance] = useState(0);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const sellerId = (seller as any)?.seller_id || (seller as any)?.id;
        const sellerOrders = sellerId
          ? json.data.filter((o: any) => !o.seller_id || o.seller_id === sellerId)
          : json.data;

        let running = 0;
        const list: WalletEntry[] = [];

        sellerOrders.forEach((o: any) => {
          const isDelivered = (o.order_status || o.active_status || '').toLowerCase() === 'delivered';
          const gross = o.total_amount || o.final_total || 0;
          const fee = Math.round(gross * 0.05);
          const net = gross - fee;

          if (isDelivered) {
            running += net;
          }

          list.push({
            id: `WL-${String(o._id).slice(-4).toUpperCase()}`,
            type: 'Order Credit',
            reference: o.order_id || `ORD-${String(o._id).slice(-5).toUpperCase()}`,
            amount: net,
            balance_after: running,
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
            status: isDelivered ? 'Settled' : 'Pending',
          });
        });

        setCurrentBalance(running);
        setEntries(list);
      }
    } catch (err) {
      console.warn('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [seller]);

  const filtered = entries.filter((e) => {
    if (filterType !== 'All' && e.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.reference.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-4 sm:p-10 space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                <Wallet size={24} className="text-[#0aad0a]" /> Store Digital Wallet Ledger
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Real-time credit log, 5% logistics fee deductions, and NIBSS payout records</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchWalletData}
                className="bg-[#1e2632] hover:bg-gray-800 p-2.5 rounded-2xl text-gray-400 hover:text-white transition-colors"
                title="Refresh Wallet"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <Link
                href="/seller/earnings"
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Building2 size={16} />
                <span>Withdraw Funds</span>
              </Link>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Wallet Balance</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0aad0a] font-mono">{formatNaira(currentBalance)}</h2>
              <p className="text-[11px] text-gray-500">Available for payout transfer</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Orders Processed</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">{entries.length}</h2>
              <p className="text-[11px] text-gray-500">Lifetime checkout orders</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Settled Payouts</span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {entries.filter((e) => e.status === 'Settled').length}
              </h2>
              <p className="text-[11px] text-gray-500">Completed order credits</p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
              <h3 className="text-sm font-black text-white">Wallet Credit &amp; Debit Log</h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reference or ID..."
                  className="bg-gray-900 border border-gray-800 text-white text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#0aad0a] w-full sm:w-64"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-400 text-xs font-bold flex flex-col items-center gap-2">
                <RefreshCw size={24} className="animate-spin text-[#0aad0a]" />
                Loading wallet transactions...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-bold">
                No digital wallet entries found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="pb-3">Entry ID</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Net Amount (₦)</th>
                      <th className="pb-3">Balance After</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-medium">
                    {filtered.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 font-mono font-bold text-[#0aad0a]">{entry.id}</td>
                        <td className="py-4 text-white font-bold">{entry.type}</td>
                        <td className="py-4 font-mono text-gray-300">{entry.reference}</td>
                        <td className="py-4 text-gray-400">{entry.date}</td>
                        <td className="py-4 font-mono font-bold text-[#0aad0a]">+{formatNaira(entry.amount)}</td>
                        <td className="py-4 font-mono text-white">{formatNaira(entry.balance_after)}</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              entry.status === 'Settled' ? 'bg-emerald-950 text-[#0aad0a]' : 'bg-amber-950 text-amber-400'
                            }`}
                          >
                            ● {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
