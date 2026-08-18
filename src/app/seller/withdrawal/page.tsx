'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  X, 
  Wallet, 
  CreditCard, 
  ArrowLeft, 
  AlertCircle
} from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';

interface WithdrawalItem {
  id: string;
  request_amount: number;
  bank_name: string;
  account_number: string;
  request_date: string;
  processed_date?: string;
  status: 'Pending' | 'Approved' | 'Transferred' | 'Rejected';
  notes?: string;
}

const INITIAL_WITHDRAWALS: WithdrawalItem[] = [
  {
    id: 'REQ-WDR-501',
    request_amount: 150000.00,
    bank_name: 'Zenith Bank PLC',
    account_number: '•••• 8492',
    request_date: '2026-08-15 09:30',
    processed_date: '2026-08-15 11:20',
    status: 'Transferred',
    notes: 'NIP Instant Bank Transfer Ref #NIP-98124'
  },
  {
    id: 'REQ-WDR-502',
    request_amount: 80000.00,
    bank_name: 'Zenith Bank PLC',
    account_number: '•••• 8492',
    request_date: '2026-08-10 14:15',
    processed_date: '2026-08-10 17:00',
    status: 'Transferred',
    notes: 'Standard Settlement Cycle'
  }
];

export default function SellerWithdrawalPage() {
  const [balance, setBalance] = useState(485000.00);
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>(INITIAL_WITHDRAWALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('Zenith Bank PLC');
  const [accountNumber, setAccountNumber] = useState('0123458492');
  const [accountHolder, setAccountHolder] = useState('Green Valley Organic Farms Ltd');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount || '0');
    if (val <= 0) return alert('Please enter a valid amount');
    if (val > balance) return alert('Requested amount exceeds available balance.');

    const newReq: WithdrawalItem = {
      id: `REQ-WDR-${Math.floor(500 + Math.random() * 500)}`,
      request_amount: val,
      bank_name: bankName,
      account_number: '•••• ' + accountNumber.slice(-4),
      request_date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending',
      notes: 'Submitted for admin payout queue'
    };

    setBalance(prev => prev - val);
    setWithdrawals([newReq, ...withdrawals]);
    setIsModalOpen(false);
    setAmount('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  const filtered = withdrawals.filter(w => 
    w.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.bank_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Building2 size={24} className="text-[#0aad0a]" /> Bank Payout &amp; Withdrawal Requests
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Request payouts from your settled wallet directly to your Nigerian commercial bank account
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Plus size={16} />
                <span>New Withdrawal Request</span>
              </button>
            </div>
          </div>

          {/* Sub-nav */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
            <Link href="/seller/earnings" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
              Earnings Overview
            </Link>
            <Link href="/seller/wallet" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
              Wallet Ledger
            </Link>
            <Link href="/seller/withdrawal" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
              <Building2 size={13} /> Bank Payout Requests
            </Link>
          </div>

          {successMsg && (
            <div className="bg-emerald-950/60 border border-[#0aad0a] text-[#0aad0a] p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> Payout request placed successfully and queued for admin transfer!
            </div>
          )}

          {/* Balance card */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400">Available Funds for Withdrawal</span>
              <div className="text-3xl font-black text-white font-mono">
                {formatNaira(balance)}
              </div>
              <span className="text-[11px] text-[#0aad0a] font-semibold">NIP direct deposit processed within 24 hours</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/20 transition-all active:scale-95"
            >
              <Building2 size={16} />
              <span>Withdraw to Zenith Bank (•••• 8492)</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests by ID, status..."
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Request ID</th>
                    <th className="pb-3 px-3">Payout Amount (₦)</th>
                    <th className="pb-3 px-3">Bank Account</th>
                    <th className="pb-3 px-3">Requested At</th>
                    <th className="pb-3 px-3">Disbursement Date</th>
                    <th className="pb-3 px-3">Notes</th>
                    <th className="pb-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-white">
                        {w.id}
                      </td>
                      <td className="py-3.5 px-3 font-black text-white font-mono text-sm">
                        {formatNaira(w.request_amount)}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{w.bank_name}</div>
                        <span className="text-[11px] text-gray-400 font-mono">{w.account_number}</span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-400 text-[11px]">
                        {w.request_date}
                      </td>
                      <td className="py-3.5 px-3 text-gray-300 text-[11px]">
                        {w.processed_date || 'In review'}
                      </td>
                      <td className="py-3.5 px-3 text-gray-400 text-[11px] max-w-xs truncate">
                        {w.notes || '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          w.status === 'Transferred'
                            ? 'bg-emerald-950/60 text-[#0aad0a] border border-[#0aad0a]/30'
                            : w.status === 'Pending'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40 animate-pulse'
                            : 'bg-red-950/60 text-red-400 border border-red-800/40'
                        }`}>
                          ● {w.status}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">Request Bank Withdrawal</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Available Wallet Balance: <span className="text-[#0aad0a] font-mono font-bold">{formatNaira(balance)}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Withdrawal Amount (₦)</label>
                <input
                  type="number"
                  step="1000"
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Max: ${formatNaira(balance)}`}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Bank Institution</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Zenith Bank PLC">Zenith Bank PLC</option>
                  <option value="Access Bank PLC">Access Bank PLC</option>
                  <option value="Guaranty Trust Bank (GTB)">Guaranty Trust Bank (GTB)</option>
                  <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                  <option value="OPay Digital Services">OPay Digital Services</option>
                  <option value="Kuda Microfinance Bank">Kuda Microfinance Bank</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Account Holder Name</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">NUBAN Account Number (10 Digits)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                >
                  Submit Payout Request
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-800 text-gray-300 font-bold px-5 py-3.5 rounded-xl text-xs hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
