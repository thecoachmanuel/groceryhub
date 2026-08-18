'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Building2, CheckCircle2, X, Wallet } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';

const TRANSACTIONS = [
  { id: 'TXN-8491', type: 'Order Credit', orderId: 'ORD-98241', amount: 42750.00, fee: 2250.00, date: 'Aug 17, 2026', status: 'Settled' },
  { id: 'TXN-8490', type: 'Order Credit', orderId: 'ORD-98240', amount: 27075.00, fee: 1425.00, date: 'Aug 17, 2026', status: 'Settled' },
  { id: 'TXN-8488', type: 'Bank Withdrawal', orderId: 'PAYOUT-204', amount: -150000.00, fee: 0.00, date: 'Aug 15, 2026', status: 'Transferred' },
  { id: 'TXN-8485', type: 'Order Credit', orderId: 'ORD-98238', amount: 58995.00, fee: 3105.00, date: 'Aug 14, 2026', status: 'Settled' },
];

export default function SellerEarningsPage() {
  const [balance, setBalance] = useState(485000.00);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('Zenith Bank PLC •••• 8492');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount || '0');
    if (amt <= 0 || amt > balance) return alert('Please enter a valid amount within your current balance.');

    setBalance(balance - amt);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Wallet size={24} className="text-[#0aad0a]" /> Store Earnings &amp; Settlements
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Track order revenue, 5% platform commission, and request bank payouts in Naira (₦)</p>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Building2 size={16} />
              <span>Request Bank Withdrawal</span>
            </button>
          </div>

          {withdrawSuccess && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> Payout request submitted! Funds will arrive in your bank account in 24 hours.
            </div>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Withdrawable Store Balance</span>
              <h3 className="text-3xl font-black text-[#0aad0a] font-mono">{formatNaira(balance)}</h3>
              <p className="text-[11px] text-gray-400">Linked to Zenith Bank &bull;&bull;&bull;&bull; 8492</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Lifetime Store Gross</span>
              <h3 className="text-3xl font-black text-white font-mono">{formatNaira(4291000)}</h3>
              <p className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
                <ArrowUpRight size={13} /> 1,240 completed orders
              </p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Total Paid Out</span>
              <h3 className="text-3xl font-black text-blue-400 font-mono">{formatNaira(3806000)}</h3>
              <p className="text-[11px] text-gray-400">Direct NIBSS Payouts</p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden space-y-4">
            <h3 className="text-base font-black text-white">Settlement Ledger &amp; Transactions</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Transaction ID</th>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Order / Ref</th>
                    <th className="pb-3 px-3">Platform Fee (5%)</th>
                    <th className="pb-3 px-3">Net Amount (₦)</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {TRANSACTIONS.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{t.id}</td>
                      <td className="py-3.5 px-3">
                        <span className="flex items-center gap-1.5 font-bold text-white">
                          {t.amount > 0 ? (
                            <ArrowDownLeft size={14} className="text-[#0aad0a]" />
                          ) : (
                            <ArrowUpRight size={14} className="text-blue-400" />
                          )}
                          <span>{t.type}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-300 font-mono">{t.orderId}</td>
                      <td className="py-3.5 px-3 text-amber-400 font-mono">
                        {t.fee > 0 ? `-${formatNaira(t.fee)}` : '—'}
                      </td>
                      <td className={`py-3.5 px-3 font-mono font-black ${
                        t.amount > 0 ? 'text-[#0aad0a]' : 'text-blue-400'
                      }`}>
                        {t.amount > 0 ? `+${formatNaira(t.amount)}` : formatNaira(t.amount)}
                      </td>
                      <td className="py-3.5 px-3 text-gray-400 text-[11px]">{t.date}</td>
                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          t.status === 'Settled'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-blue-950/40 text-blue-400 border border-blue-800/30'
                        }`}>
                          ● {t.status}
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
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 border border-gray-800 space-y-5 relative">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-base font-black text-white">Withdraw Store Funds</h3>
              <p className="text-xs text-gray-400">
                Available Balance: <strong className="text-[#0aad0a]">{formatNaira(balance)}</strong>
              </p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Amount (₦)</label>
                <input
                  type="number"
                  step="1000"
                  max={balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Max: ${formatNaira(balance)}`}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Payout Destination</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                >
                  Confirm Payout
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="bg-gray-800 text-gray-300 font-bold px-5 py-3 rounded-xl text-xs hover:bg-gray-700"
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
