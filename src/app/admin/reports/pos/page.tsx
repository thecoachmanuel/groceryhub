'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Search, Filter, Receipt, Sparkles } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface PosTransactionItem {
  id: string;
  registerId: string;
  cashierName: string;
  itemsCount: number;
  paymentMethod: string;
  tenderedAmount: number;
  changeGiven: number;
  total: number;
  timestamp: string;
}

export default function AdminPosReportPage() {
  const [transactions, setTransactions] = useState<PosTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const fetchPosReport = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reports/pos');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching POS report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosReport();
  }, []);

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.cashierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPay = paymentFilter === 'all' || t.paymentMethod.toLowerCase() === paymentFilter.toLowerCase();
    return matchesSearch && matchesPay;
  });

  const totalRevenue = filtered.reduce((sum, t) => sum + t.total, 0);
  const cashTotal = filtered.filter((t) => t.paymentMethod.toUpperCase() === 'CASH').reduce((sum, t) => sum + t.total, 0);

  const handleExportCsv = () => {
    if (filtered.length === 0) return alert('No transaction data to export.');
    const headers = 'Receipt ID,Register,Cashier,Items,Payment Method,Total Amount,Timestamp\n';
    const rows = filtered
      .map(
        (t) =>
          `${t.id},${t.registerId},${t.cashierName},${t.itemsCount},${t.paymentMethod},${t.total.toFixed(2)},${t.timestamp}`
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
              Review physical walk-in store checkout tickets, cashier drawer balance, and tender method breakdowns in Naira (₦)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Download size={16} />
              <span>Export POS CSV</span>
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/reports" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Sales &amp; Commissions Ledger
          </Link>
          <Link href="/admin/reports/pos" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <Receipt size={13} /> POS Terminal Reports
          </Link>
          <Link href="/admin/reports/ai-insights" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            <Sparkles size={13} /> AI Forecasts &amp; Intelligence
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs text-gray-400 font-bold">Total In-Store POS Sales</span>
            <h3 className="text-2xl font-black text-white font-mono">{formatNaira(totalRevenue)}</h3>
            <span className="text-[11px] text-gray-400">{filtered.length} checkout receipts</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-1">
            <span className="text-xs text-gray-400 font-bold">Cash Drawer Tender</span>
            <h3 className="text-2xl font-black text-[#0aad0a] font-mono">{formatNaira(cashTotal)}</h3>
            <span className="text-[11px] text-gray-400">Physical currency collected</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search receipt ID, cashier name..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="all">All Tender Methods</option>
              <option value="cash">Cash Drawer</option>
              <option value="pos">POS Terminal / Card</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading POS sales data...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No POS sales recorded yet. Place POS orders from /admin/pos to populate this report.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Receipt / Order</th>
                    <th className="pb-3 px-3">POS Register Terminal</th>
                    <th className="pb-3 px-3">Cashier</th>
                    <th className="pb-3 px-3">Basket Count</th>
                    <th className="pb-3 px-3">Payment Method</th>
                    <th className="pb-3 px-3">Total Amount (₦)</th>
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
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30">
                          {t.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-black text-[#0aad0a] text-sm font-mono">
                        {formatNaira(t.total)}
                      </td>
                      <td className="py-3.5 px-3 text-gray-400 text-right">{t.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
