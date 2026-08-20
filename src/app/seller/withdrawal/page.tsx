'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Plus, Search, CheckCircle2, Clock, X, Wallet, CreditCard, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { apiFetch } from '@/lib/api-fetch';
import { useSellerAuth } from '@/context/AuthContext';

interface WithdrawalItem {
  request_id: string;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: 'pending' | 'approved' | 'transferred' | 'rejected';
  rejection_reason?: string;
  transfer_reference?: string;
  createdAt: string;
}

export default function SellerWithdrawalPage() {
  const { seller } = useSellerAuth();
  const sellerId = (seller as any)?.id || (seller as any)?.seller_id;
  const sellerName = (seller as any)?.store_name || (seller as any)?.name || 'Seller';

  const [withdrawableBalance, setWithdrawableBalance] = useState(0);
  const [netEarnings, setNetEarnings] = useState(0);
  const [alreadyWithdrawn, setAlreadyWithdrawn] = useState(0);
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form states
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const effectiveSellerId = sellerId || 1;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/seller/withdrawals?seller_id=${effectiveSellerId}`);
      const json = await res.json();
      if (json.success) {
        setWithdrawableBalance(json.withdrawableBalance || 0);
        setNetEarnings(json.netEarnings || 0);
        setAlreadyWithdrawn(json.alreadyWithdrawn || 0);
        setWithdrawals(json.history || []);
      }
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [effectiveSellerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount || '0');
    if (val <= 0) return alert('Please enter a valid amount');
    if (withdrawableBalance > 0 && val > withdrawableBalance) {
      return alert(`Amount exceeds available balance of ${formatNaira(withdrawableBalance)}`);
    }
    if (!bankName || !accountNumber || !accountHolder) return alert('Please fill in all bank details');

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/seller/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: effectiveSellerId,
          seller_name: sellerName,
          amount: val,
          bank_name: bankName,
          account_number: accountNumber,
          account_name: accountHolder,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg(true);
        setIsModalOpen(false);
        setAmount(''); setBankName(''); setAccountNumber(''); setAccountHolder('');
        setTimeout(() => setSuccessMsg(false), 4000);
        fetchData();
      } else {
        alert(json.message || 'Failed to submit withdrawal request');
      }
    } catch (err) { alert('Error submitting request'); }
    finally { setSubmitting(false); }
  };

  const statusConfig = {
    pending: { label: 'Pending Review', color: 'bg-amber-950/40 text-amber-400 border border-amber-800/40' },
    approved: { label: 'Approved', color: 'bg-blue-950/40 text-blue-400 border border-blue-800/40' },
    transferred: { label: 'Transferred', color: 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30' },
    rejected: { label: 'Rejected', color: 'bg-red-950/40 text-red-400 border border-red-800/40' },
  };

  const filtered = withdrawals.filter((w) =>
    w.request_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.bank_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col">
      <SellerNav />

      <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link href="/seller/earnings" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2">
              <ArrowLeft size={14} /> Back to Earnings
            </Link>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Building2 size={24} className="text-[#0aad0a]" /> Withdrawal Requests
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Submit payout requests from your online sales balance</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95">
              <Plus size={16} /> Request Withdrawal
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-950/60 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2">
            <CheckCircle2 size={18} /> Withdrawal request submitted! Admin will process within 1–2 business days.
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1e2632] border border-[#0aad0a]/30 p-5 rounded-2xl space-y-1">
            <span className="text-xs text-gray-400 font-bold">Withdrawable Balance</span>
            <h3 className="text-2xl font-black text-[#0aad0a] font-mono">{formatNaira(withdrawableBalance)}</h3>
            <p className="text-[11px] text-gray-400">Available to withdraw (online orders only)</p>
          </div>
          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs text-gray-400 font-bold">Net Online Earnings</span>
            <h3 className="text-xl font-black text-white font-mono">{formatNaira(netEarnings)}</h3>
            <p className="text-[11px] text-gray-400">After 5% platform fee deduction</p>
          </div>
          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs text-gray-400 font-bold">Total Withdrawn</span>
            <h3 className="text-xl font-black text-amber-400 font-mono">{formatNaira(alreadyWithdrawn)}</h3>
            <p className="text-[11px] text-gray-400">Approved &amp; transferred payouts</p>
          </div>
        </div>

        {/* POS Note */}
        <div className="bg-blue-950/30 border border-blue-800/40 p-4 rounded-2xl flex items-start gap-3 text-xs text-blue-300">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span><strong>POS In-Store Sales</strong> are collected directly at your store counter and are not included in your online withdrawal balance. Only online orders processed through GroceryHub are eligible for withdrawal.</span>
        </div>

        {/* History Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black flex items-center gap-2"><Wallet size={18} className="text-[#0aad0a]" /> Withdrawal History</h3>
            <div className="relative max-w-xs">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search requests..." className="bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-[#0aad0a] w-full" />
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-gray-400">Loading withdrawal history...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CreditCard size={32} className="mx-auto text-gray-600" />
              <p className="text-xs text-gray-400">No withdrawal requests yet. Request your first payout above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Request ID</th>
                    <th className="pb-3 px-3">Amount</th>
                    <th className="pb-3 px-3">Bank Details</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  {filtered.map((w) => {
                    const s = statusConfig[w.status] || statusConfig.pending;
                    return (
                      <tr key={w.request_id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-amber-400">{w.request_id}</td>
                        <td className="py-3.5 px-3 font-black font-mono text-white">{formatNaira(w.amount)}</td>
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-white">{w.bank_name}</p>
                          <p className="text-gray-400">{w.account_name}</p>
                          <p className="text-gray-500">•••• {w.account_number?.slice(-4)}</p>
                        </td>
                        <td className="py-3.5 px-3 text-gray-400">{new Date(w.createdAt).toLocaleDateString('en-NG')}</td>
                        <td className="py-3.5 px-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
                          {w.status === 'rejected' && w.rejection_reason && (
                            <p className="text-[10px] text-red-400 mt-1">{w.rejection_reason}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-gray-400 text-[10px]">{w.transfer_reference || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Withdrawal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e2632] border border-gray-700 rounded-3xl p-6 w-full max-w-md space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base">Request Withdrawal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="bg-emerald-950/40 border border-[#0aad0a]/30 p-4 rounded-2xl">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Available Balance</p>
              <p className="text-2xl font-black text-[#0aad0a] font-mono">{formatNaira(withdrawableBalance)}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Withdrawal Amount (₦)</label>
                <input type="number" min="1" max={withdrawableBalance} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-sm font-mono font-bold focus:outline-none focus:border-[#0aad0a]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Bank Name</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Zenith Bank PLC" required className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Account Number</label>
                  <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="0123456789" maxLength={10} required className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Account Name</label>
                  <input type="text" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Account Holder Name" required className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95">
                {submitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Processing...</> : <><CreditCard size={16} /> Submit Withdrawal Request</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
