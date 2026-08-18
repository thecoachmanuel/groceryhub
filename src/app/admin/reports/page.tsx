'use client';

import { useState } from 'react';
import { BarChart3, Download, Calendar, DollarSign, ShoppingBag, Store, Truck, ArrowUpRight } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const SALES_DATA = [
  { id: 'ORD-98241', date: 'Aug 17, 2026', customer: 'Alice Johnson', vendor: 'Green Valley Organic Farms', gross: 45.00, commission: 4.50, tax: 2.25, netVendor: 38.25, status: 'Completed' },
  { id: 'ORD-98240', date: 'Aug 17, 2026', customer: 'Michael Scott', vendor: 'Daily Dairy & Poultry Fresh', gross: 28.50, commission: 2.85, tax: 1.42, netVendor: 24.23, status: 'Completed' },
  { id: 'ORD-98239', date: 'Aug 16, 2026', customer: 'Eleanor Shellstrop', vendor: 'The Artisanal Bakery Co.', gross: 19.99, commission: 2.00, tax: 1.00, netVendor: 16.99, status: 'Completed' },
  { id: 'ORD-98238', date: 'Aug 16, 2026', customer: 'Chidi Anagonye', vendor: 'Green Valley Organic Farms', gross: 64.20, commission: 6.42, tax: 3.21, netVendor: 54.57, status: 'Completed' },
  { id: 'ORD-98237', date: 'Aug 15, 2026', customer: 'Tahani Al-Jamil', vendor: 'Daily Dairy & Poultry Fresh', gross: 112.00, commission: 11.20, tax: 5.60, netVendor: 95.20, status: 'Completed' },
];

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');

  const totalGross = SALES_DATA.reduce((s, i) => s + i.gross, 0);
  const totalCommission = SALES_DATA.reduce((s, i) => s + i.commission, 0);
  const totalTax = SALES_DATA.reduce((s, i) => s + i.tax, 0);
  const totalNetVendor = SALES_DATA.reduce((s, i) => s + i.netVendor, 0);

  const handleExportCsv = () => {
    alert('Exporting full financial statement report to CSV...');
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <BarChart3 size={24} className="text-[#0aad0a]" /> Analytics & Financial Reports
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Track multi-vendor commission earnings, sales tax liability, and gross platform volume</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-[#1e2632] border border-gray-800 text-white text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month (August 2026)</option>
              <option value="year">Year to Date (2026)</option>
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

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-gray-400">Gross Merchandise Value (GMV)</span>
            <div className="text-2xl font-black text-white">${totalGross.toFixed(2)}</div>
            <span className="text-[11px] text-[#0aad0a] flex items-center gap-1">
              <ArrowUpRight size={13} /> +18.4% vs last period
            </span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-gray-400">Platform Admin Commission (10%)</span>
            <div className="text-2xl font-black text-[#0aad0a]">${totalCommission.toFixed(2)}</div>
            <span className="text-[11px] text-gray-400">Net platform revenue</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-gray-400">Total Tax Collected</span>
            <div className="text-2xl font-black text-amber-400">${totalTax.toFixed(2)}</div>
            <span className="text-[11px] text-gray-400">5.0% average VAT/GST</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-gray-400">Net Vendor Payouts</span>
            <div className="text-2xl font-black text-blue-400">${totalNetVendor.toFixed(2)}</div>
            <span className="text-[11px] text-gray-400">Payable to 3 certified stores</span>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden space-y-4">
          <h3 className="text-sm font-black text-white">Detailed Ledger Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Vendor / Store</th>
                  <th className="pb-3 px-3">Gross Total</th>
                  <th className="pb-3 px-3">Platform Fee</th>
                  <th className="pb-3 px-3">Tax</th>
                  <th className="pb-3 px-3">Net Vendor</th>
                  <th className="pb-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {SALES_DATA.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{row.id}</td>
                    <td className="py-3 px-3 text-gray-400">{row.date}</td>
                    <td className="py-3 px-3 text-white">{row.customer}</td>
                    <td className="py-3 px-3 text-gray-300">{row.vendor}</td>
                    <td className="py-3 px-3 font-bold text-white">${row.gross.toFixed(2)}</td>
                    <td className="py-3 px-3 text-[#0aad0a] font-bold">+${row.commission.toFixed(2)}</td>
                    <td className="py-3 px-3 text-amber-400">${row.tax.toFixed(2)}</td>
                    <td className="py-3 px-3 text-blue-400 font-bold">${row.netVendor.toFixed(2)}</td>
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
        </div>
      </main>
    </div>
  );
}
