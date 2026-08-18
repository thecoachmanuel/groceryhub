'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Download, Search, DollarSign, Calendar, Filter, Receipt, ShoppingBag } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface PosTransactionItem {
  id: string;
  registerId: string;
  cashierName: string;
  itemsCount: number;
  paymentMethod: 'CASH' | 'STRIPE_CARD' | 'STORE_WALLET';
  tenderedAmount: number;
  changeGiven: number;
  total: number;
  timestamp: string;
}

const INITIAL_POS_TRANSACTIONS: PosTransactionItem[] = [
  { id: 'POS-7701', registerId: 'Register #1 (Downtown)', cashierName: 'Sarah Jenkins', itemsCount: 4, paymentMethod: 'CASH', tenderedAmount: 50.00, changeGiven: 14.85, total: 35.15, timestamp: 'Aug 17, 2026 14:32' },
  { id: 'POS-7700', registerId: 'Register #2 (Express)', cashierName: 'David Lee', itemsCount: 2, paymentMethod: 'STRIPE_CARD', tenderedAmount: 18.20, changeGiven: 0.00, total: 18.20, timestamp: 'Aug 17, 2026 14:20' },
  { id: 'POS-7699', registerId: 'Register #1 (Downtown)', cashierName: 'Sarah Jenkins', itemsCount: 6, paymentMethod: 'STRIPE_CARD', tenderedAmount: 64.90, changeGiven: 0.00, total: 64.90, timestamp: 'Aug 17, 2026 13:55' },
  { id: 'POS-7698', registerId: 'Register #3 (Heights)', cashierName: 'Marcus Vance', itemsCount: 1, paymentMethod: 'CASH', tenderedAmount: 20.00, changeGiven: 12.50, total: 7.50, timestamp: 'Aug 17, 2026 13:10' },
  { id: 'POS-7697', registerId: 'Register #1 (Downtown)', cashierName: 'Sarah Jenkins', itemsCount: 5, paymentMethod: 'STORE_WALLET', tenderedAmount: 42.10, changeGiven: 0.00, total: 42.10, timestamp: 'Aug 17, 2026 12:45' },
];

export default function AdminPosReportPage() {
  const [transactions, setTransactions] = useState<PosTransactionItem[]>(INITIAL_POS_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [registerFilter, setRegisterFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.cashierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReg = registerFilter === 'all' || t.registerId.includes(registerFilter);
    const matchesPay = paymentFilter === 'all' || t.paymentMethod === paymentFilter;
    return matchesSearch && matchesReg && matchesPay;
  });

  const totalRevenue = filtered.reduce((sum, t) => sum + t.total, 0);
  const cashTotal = filtered.filter((t) => t.paymentMethod === 'CASH').reduce((sum, t) => sum + t.total, 0);
  const cardTotal = filtered.filter((t) => t.paymentMethod === 'STRIPE_CARD').reduce((sum, t) => sum + t.total, 0);

  const handleExportCsv = () => {
    const headers = 'Receipt ID,Register,Cashier,Items,Payment Method,Total Amount,Timestamp\n';
    const rows = filtered
      .map(
        (t) =>
          `${t.id},${t.registerId},${t.cashierName},${t.itemsCount},${t.paymentMethod},$${t.total.toFixed(2)},${t.timestamp}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pos_register_report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Receipt size={24} className="text-[#0aad0a]" /> POS Register Counter Sales Report
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Review physical walk-in store checkout tickets, cashier drawer balance, and tender method breakdowns
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/reports/ai-insights"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              AI Insights
            </Link>
            <button
              onClick={handleExportCsv}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Download size={16} />
              <span>Export POS CSV</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs text-gray-400 font-bold">Total In-Store POS Sales</span>
            <h3 className="text-2xl font-black text-white">${totalRevenue.toFixed(2)}</h3>
            <span className="text-[11px] text-gray-400">{filtered.length} checkout receipts</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs text-gray-400 font-bold">Cash Drawer Tender</span>
            <h3 className="text-2xl font-black text-[#0aad0a]">${cashTotal.toFixed(2)}</h3>
            <span className="text-[11px] text-gray-400">Physical currency collected</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs text-gray-400 font-bold">Card & Contactless Tender</span>
            <h3 className="text-2xl font-black text-blue-400">${cardTotal.toFixed(2)}</h3>
            <span className="text-[11px] text-gray-400">Direct Stripe POS gateway</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search receipt ID or cashier..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Register:</span>
              <select
                value={registerFilter}
                onChange={(e) => setRegisterFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
              >
                <option value="all">All Registers</option>
                <option value="Register #1">Register #1</option>
                <option value="Register #2">Register #2</option>
                <option value="Register #3">Register #3</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Payment:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
              >
                <option value="all">All Methods</option>
                <option value="CASH">Cash</option>
                <option value="STRIPE_CARD">Card (Stripe)</option>
                <option value="STORE_WALLET">Digital Wallet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Receipt ID</th>
                  <th className="pb-3 px-3">Register & Station</th>
                  <th className="pb-3 px-3">Cashier</th>
                  <th className="pb-3 px-3">Items Sold</th>
                  <th className="pb-3 px-3">Payment Method</th>
                  <th className="pb-3 px-3">Tendered / Change</th>
                  <th className="pb-3 px-3">Total Amount</th>
                  <th className="pb-3 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-white">{t.id}</td>
                    <td className="py-3.5 px-3 text-gray-300">{t.registerId}</td>
                    <td className="py-3.5 px-3 text-gray-200">{t.cashierName}</td>
                    <td className="py-3.5 px-3 text-gray-400">{t.itemsCount} items</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                        t.paymentMethod === 'CASH'
                          ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                          : t.paymentMethod === 'STRIPE_CARD'
                          ? 'bg-blue-950/40 text-blue-400 border border-blue-800/30'
                          : 'bg-purple-950/40 text-purple-300 border border-purple-800/30'
                      }`}>
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 font-mono">
                      ${t.tenderedAmount.toFixed(2)} / -${t.changeGiven.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 font-black text-[#0aad0a] text-sm">
                      ${t.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 text-right">{t.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
