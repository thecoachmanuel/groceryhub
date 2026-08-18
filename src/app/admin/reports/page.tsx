'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Download, Sparkles, ArrowUpRight } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface ReportRow {
  id: string;
  date: string;
  customer: string;
  vendor: string;
  gross: number;
  commission: number;
  tax: number;
  netVendor: number;
  status: string;
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  const fetchFinancialReport = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/reports/financial?range=${dateRange}`);
      const data = await res.json();
      if (data.success) {
        setReportData(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching financial report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialReport();
  }, [dateRange]);

  const totalGross = reportData.reduce((s, i) => s + (i.gross || 0), 0);
  const totalCommission = reportData.reduce((s, i) => s + (i.commission || 0), 0);
  const totalTax = reportData.reduce((s, i) => s + (i.tax || 0), 0);
  const totalNetVendor = reportData.reduce((s, i) => s + (i.netVendor || 0), 0);

  const handleExportCsv = () => {
    if (reportData.length === 0) return alert('No report data to export.');
    const csvContent =
      'Order ID,Date,Customer,Vendor,Gross Total,Platform Commission,Tax (7.5%),Net Vendor Payout\n' +
      reportData.map((r) => `${r.id},${r.date},"${r.customer}","${r.vendor}",${r.gross},${r.commission},${r.tax},${r.netVendor}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_ledger_report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <BarChart3 size={24} className="text-[#0aad0a]" /> Analytics &amp; Financial Reports
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Track multi-vendor commission earnings, sales tax liability, and gross platform volume in Naira (₦)</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-[#1e2632] border border-gray-800 text-white text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="year">Year to Date</option>
            </select>

            <button
              onClick={handleExportCsv}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/20 transition-all active:scale-95"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/reports" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <BarChart3 size={13} /> Sales &amp; Commissions Ledger
          </Link>
          <Link href="/admin/reports/pos" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            POS Terminal Reports
          </Link>
          <Link href="/admin/reports/ai-insights" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            <Sparkles size={13} /> AI Forecasts &amp; Intelligence
          </Link>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-gray-400">Gross Merchandise Value (GMV)</span>
            <div className="text-2xl font-black text-white font-mono">{formatNaira(totalGross)}</div>
            <span className="text-[11px] text-[#0aad0a] flex items-center gap-1">
              <ArrowUpRight size={13} /> Live MongoDB Aggregation
            </span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-gray-400">Platform Admin Commission (5%)</span>
            <div className="text-2xl font-black text-[#0aad0a] font-mono">{formatNaira(totalCommission)}</div>
            <span className="text-[11px] text-gray-400">Net platform revenue</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-gray-400">Total Tax Collected (7.5% VAT)</span>
            <div className="text-2xl font-black text-amber-400 font-mono">{formatNaira(totalTax)}</div>
            <span className="text-[11px] text-gray-400">Standard Nigerian VAT</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-gray-400">Net Vendor Payouts</span>
            <div className="text-2xl font-black text-blue-400 font-mono">{formatNaira(totalNetVendor)}</div>
            <span className="text-[11px] text-gray-400">Payable to registered stores</span>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden space-y-4">
          <h3 className="text-sm font-black text-white">Detailed Ledger Breakdown</h3>
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Computing financial ledger from orders...</div>
          ) : reportData.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No orders recorded in selected date range.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Vendor / Store</th>
                    <th className="pb-3 px-3">Gross Total (₦)</th>
                    <th className="pb-3 px-3">Platform Fee (5%)</th>
                    <th className="pb-3 px-3">Tax (7.5%)</th>
                    <th className="pb-3 px-3">Net Vendor (₦)</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {reportData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white font-mono">{row.id}</td>
                      <td className="py-3 px-3 text-gray-400">{row.date}</td>
                      <td className="py-3 px-3 text-white">{row.customer}</td>
                      <td className="py-3 px-3 text-gray-300">{row.vendor}</td>
                      <td className="py-3 px-3 font-bold text-white font-mono">{formatNaira(row.gross)}</td>
                      <td className="py-3 px-3 text-[#0aad0a] font-bold font-mono">+{formatNaira(row.commission)}</td>
                      <td className="py-3 px-3 text-amber-400 font-mono">{formatNaira(row.tax)}</td>
                      <td className="py-3 px-3 text-blue-400 font-bold font-mono">{formatNaira(row.netVendor)}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 text-[#0aad0a]">
                          ● {row.status}
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
  );
}
