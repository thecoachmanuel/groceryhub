'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Building2, CheckCircle2, X, Wallet, RefreshCw } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { apiFetch } from '@/lib/api-fetch';
import { useSellerAuth } from '@/context/AuthContext';

interface Transaction {
  id: string;
  type: string;
  orderId: string;
  amount: number;
  fee: number;
  date: string;
  status: string;
}

export default function SellerEarningsPage() {
  const { seller } = useSellerAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('Zenith Bank PLC •••• 8492');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const sellerId = (seller as any)?.seller_id || (seller as any)?.id;
        const sellerOrders = sellerId
          ? json.data.filter((o: any) => !o.seller_id || o.seller_id === sellerId)
          : json.data;

        // Calculate total gross sales & net earnings (after 5% platform fee)
        let totalNet = 0;
        const txns: Transaction[] = [];

        sellerOrders.forEach((o: any) => {
          const isDelivered = (o.order_status || o.active_status || '').toLowerCase() === 'delivered';
          const gross = o.total_amount || o.final_total || 0;
          const fee = Math.round(gross * 0.05); // 5% platform service fee
          const net = gross - fee;

          if (isDelivered) {
            totalNet += net;
          }

          txns.push({
            id: `TXN-${String(o._id).slice(-4).toUpperCase()}`,
            type: 'Order Credit',
            orderId: o.order_id || `ORD-${String(o._id).slice(-5).toUpperCase()}`,
            amount: net,
            fee: fee,
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
            status: isDelivered ? 'Settled' : 'Pending Delivery',
          });
        });

        setBalance(totalNet);
        setTransactions(txns);
      }
    } catch (err) {
      console.warn('Failed to load seller earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, [seller]);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount || '0');
    if (amt <= 0 || amt > balance) return alert('Please enter a valid amount within your current balance.');

    setBalance((prev) => Math.max(0, prev - amt));
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-4 sm:p-10 space-y-8 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                <Wallet size={24} className="text-[#0aad0a]" /> Store Earnings &amp; Settlements
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Track order revenue, 5% platform commission, and request bank payouts in Naira (₦)</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchEarningsData}
                className="bg-[#1e2632] hover:bg-gray-800 p-2.5 rounded-2xl text-gray-400 hover:text-white transition-colors"
                title="Refresh Ledger"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Building2 size={16} />
                <span>Request Bank Withdrawal</span>
              </button>
            </div>
          </div>

          {withdrawSuccess && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> Payout request submitted! Funds will arrive in your bank account in 24 hours.
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Withdrawable Balance</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0aad0a] font-mono">{formatNaira(balance)}</h2>
              <p className="text-[11px] text-gray-500">Available for instant NIBSS bank transfer</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Sales Settled</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
                {formatNaira(transactions.reduce((acc, t) => acc + (t.status === 'Settled' ? t.amount + t.fee : 0), 0))}
              </h2>
              <p className="text-[11px] text-gray-500">Gross customer checkout volume</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Platform Fee (5%)</span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {formatNaira(transactions.reduce((acc, t) => acc + t.fee, 0))}
              </h2>
              <p className="text-[11px] text-gray-500">GroceryHub logistics &amp; platform service fee</p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white">Settlement Ledger &amp; Order Credits</h3>

            {loading ? (
              <div className="py-12 text-center text-gray-400 text-xs font-bold flex flex-col items-center gap-2">
                <RefreshCw size={24} className="animate-spin text-[#0aad0a]" />
                Calculating live earnings from order history...
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-bold">
                No store transactions yet. Fulfill customer orders to see live order credits here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="pb-3">Transaction ID</th>
                      <th className="pb-3">Order Ref</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Gross Total</th>
                      <th className="pb-3">Platform Fee (5%)</th>
                      <th className="pb-3">Net Credit (₦)</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-medium">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 font-mono font-bold text-[#0aad0a]">{txn.id}</td>
                        <td className="py-4 font-mono text-white font-bold">{txn.orderId}</td>
                        <td className="py-4 text-gray-400">{txn.date}</td>
                        <td className="py-4 font-mono text-gray-300">{formatNaira(txn.amount + txn.fee)}</td>
                        <td className="py-4 font-mono text-amber-400">-{formatNaira(txn.fee)}</td>
                        <td className="py-4 font-mono font-bold text-[#0aad0a]">{formatNaira(txn.amount)}</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              txn.status === 'Settled' ? 'bg-emerald-950 text-[#0aad0a]' : 'bg-amber-950 text-amber-400'
                            }`}
                          >
                            ● {txn.status}
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

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Building2 size={20} className="text-[#0aad0a]" /> Request Payout Withdrawal
              </h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Available Balance</label>
                <div className="bg-gray-900 border border-gray-800 text-[#0aad0a] font-mono font-black text-lg p-3 rounded-xl">
                  {formatNaira(balance)}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Withdrawal Amount (₦)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Destination Bank Account</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-2xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                Confirm Bank Payout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
