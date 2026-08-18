'use client';

import { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  CheckCircle2, 
  Wallet, 
  AlertTriangle,
  Receipt,
  Truck
} from 'lucide-react';
import DeliveryNav from '@/components/delivery/DeliveryNav';
import { formatNaira } from '@/lib/currency';

const RIDER_LEDGER = [
  { id: 'TRP-1092', type: 'Delivery Commission', ref: 'Order #ORD-98241', amount: 1500.00, codCollected: 0.00, date: 'Aug 17, 2026', status: 'Credited' },
  { id: 'TRP-1091', type: 'COD Cash Collection', ref: 'Order #ORD-98240', amount: 1200.00, codCollected: 28500.00, date: 'Aug 17, 2026', status: 'Cash in Hand' },
  { id: 'TRP-1089', type: 'Surge Peak Incentive', ref: 'Victoria Island Peak Hours', amount: 3500.00, codCollected: 0.00, date: 'Aug 17, 2026', status: 'Credited' },
  { id: 'TRP-1082', type: 'Bank Payout Direct Transfer', ref: 'Access Bank •••• 1049', amount: -45000.00, codCollected: 0.00, date: 'Aug 15, 2026', status: 'Transferred' },
  { id: 'TRP-1078', type: 'COD Cash Remitted to Admin', ref: 'Store Counter Handover', amount: 0.00, codCollected: -75000.00, date: 'Aug 14, 2026', status: 'Settled' },
];

export default function DeliveryEarningsPage() {
  const [walletBalance, setWalletBalance] = useState(64500.00);
  const [cashInHand, setCashInHand] = useState(28500.00);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const handleDepositCash = () => {
    if (cashInHand <= 0) return alert('No COD cash currently in hand to remit.');
    setCashInHand(0);
    setDepositSuccess(true);
    setTimeout(() => setDepositSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <DeliveryNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Truck size={24} className="text-[#0aad0a]" /> Courier Earnings &amp; COD Remittance
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Track delivery trip fees, surge bonuses, and remit Cash-on-Delivery collections in Naira (₦)
              </p>
            </div>

            <button
              onClick={handleDepositCash}
              disabled={cashInHand === 0}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 text-xs font-black px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Receipt size={16} />
              <span>Record COD Deposit to Store Counter</span>
            </button>
          </div>

          {depositSuccess && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> COD Cash handover recorded! Store manager has confirmed settlement.
            </div>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs font-bold text-gray-400">Courier Unpaid Balance</span>
              <h3 className="text-3xl font-black text-[#0aad0a] font-mono">{formatNaira(walletBalance)}</h3>
              <p className="text-[11px] text-gray-400">Weekly bank transfer to registered Nigerian account</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">COD Cash In Hand</span>
                <span className="text-[10px] font-bold bg-amber-950/60 text-amber-400 px-2 py-0.5 rounded-full">
                  Must Remit
                </span>
              </div>
              <h3 className="text-3xl font-black text-amber-400 font-mono">{formatNaira(cashInHand)}</h3>
              <p className="text-[11px] text-gray-400">Collected from COD customers today</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs font-bold text-gray-400">Lifetime Courier Earnings</span>
              <h3 className="text-3xl font-black text-white font-mono">{formatNaira(492000)}</h3>
              <p className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
                <ArrowUpRight size={13} /> 342 deliveries completed
              </p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden space-y-4">
            <h3 className="text-base font-black text-white">Earnings &amp; Remittance Ledger</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Transaction</th>
                    <th className="pb-3 px-3">Description / Reference</th>
                    <th className="pb-3 px-3">Courier Fee Earned (₦)</th>
                    <th className="pb-3 px-3">COD Cash Collected (₦)</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {RIDER_LEDGER.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white font-mono">{t.id}</td>
                      <td className="py-3.5 px-3">
                        <span className="text-white block font-semibold">{t.type}</span>
                        <span className="text-gray-400 text-[11px] font-mono">{t.ref}</span>
                      </td>
                      <td className={`py-3.5 px-3 font-black font-mono ${t.amount < 0 ? 'text-blue-400' : t.amount > 0 ? 'text-[#0aad0a]' : 'text-gray-400'}`}>
                        {t.amount > 0 ? `+${formatNaira(t.amount)}` : t.amount < 0 ? `-${formatNaira(Math.abs(t.amount))}` : '₦0.00'}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-amber-400 font-mono">
                        {t.codCollected !== 0 ? `${t.codCollected > 0 ? '+' : ''}${formatNaira(t.codCollected)}` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-gray-400">{t.date}</td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/40 text-[#0aad0a]">
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
    </div>
  );
}
