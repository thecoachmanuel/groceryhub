'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Percent, 
  RotateCcw, 
  Lightbulb, 
  Filter 
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

const TOP_PRODUCTS = [
  { id: 1, name: 'Fresh Organic Farm Broccoli', category: 'Vegetables', unitsSold: 412, revenue: 1442000.00, trend: 'up' },
  { id: 2, name: 'Red Sweet Crisp Apples (Washington)', category: 'Fruits', unitsSold: 380, revenue: 1710000.00, trend: 'up' },
  { id: 3, name: 'Farm Fresh Pure Whole Milk (1L)', category: 'Dairy & Eggs', unitsSold: 345, revenue: 1311000.00, trend: 'up' },
  { id: 4, name: 'Fresh Ripe Hass Avocados (Pack of 4)', category: 'Vegetables', unitsSold: 290, revenue: 1102000.00, trend: 'down' },
  { id: 5, name: 'Artisan Sourdough Country Bread', category: 'Bakery', unitsSold: 210, revenue: 672000.00, trend: 'up' },
];

export default function AdminAiReportsPage() {
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-17');
  const [topProducts, setTopProducts] = useState(TOP_PRODUCTS);

  const handleExportInsights = () => {
    const csvContent =
      'Product Name,Category,Units Sold,Gross Revenue\n' +
      topProducts.map((p) => `"${p.name}",${p.category},${p.unitsSold},${p.revenue.toFixed(2)}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_sales_insights_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] border border-[#0aad0a]/30 px-3 py-1 rounded-full text-xs font-bold mb-1">
              <Sparkles size={13} /> AI Decision Intelligence Engine
            </div>
            <h1 className="text-2xl font-black">Executive Sales Analytics &amp; AI Forecasts</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Machine learning analysis of customer order frequency, gross merchandise volume (GMV), and vendor velocity in Naira (₦)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportInsights}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-colors border border-gray-700"
            >
              <Download size={15} className="text-[#0aad0a]" />
              <span>Export Intelligence CSV</span>
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/reports" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Sales &amp; Commissions Ledger
          </Link>
          <Link href="/admin/reports/pos" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            POS Terminal Reports
          </Link>
          <Link href="/admin/reports/ai-insights" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <Sparkles size={13} /> AI Forecasts &amp; Intelligence
          </Link>
        </div>

        {/* Date Filter Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
            <Calendar size={16} className="text-[#0aad0a]" />
            <span>Reporting Interval:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold">Total Processed Orders</span>
              <ShoppingBag size={18} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-black text-white">1,482 Orders</h3>
            <p className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
              <TrendingUp size={13} /> +14.2% vs prior cycle
            </p>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold">Gross Platform Revenue</span>
              <span className="text-xs text-[#0aad0a] font-mono font-bold">₦</span>
            </div>
            <h3 className="text-2xl font-black text-[#0aad0a] font-mono">{formatNaira(48920500)}</h3>
            <p className="text-[11px] text-gray-400">Average basket value {formatNaira(33010)}</p>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold">Discounts &amp; Promos Given</span>
              <Percent size={18} className="text-amber-400" />
            </div>
            <h3 className="text-2xl font-black text-amber-400 font-mono">{formatNaira(3410000)}</h3>
            <p className="text-[11px] text-gray-400">6.9% coupon redemption rate</p>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold">Refunds &amp; Claims Settled</span>
              <RotateCcw size={18} className="text-orange-400" />
            </div>
            <h3 className="text-2xl font-black text-orange-400 font-mono">{formatNaira(218400)}</h3>
            <p className="text-[11px] text-[#0aad0a]">Only 0.44% refund rate (Optimal)</p>
          </div>
        </div>

        {/* AI Actionable Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Selling Products List */}
          <div className="lg:col-span-2 bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black flex items-center gap-2">
                <Flame size={18} className="text-orange-400" /> Top Velocity Products ({fromDate} to {toDate})
              </h3>
              <span className="text-xs text-gray-400">Top 5 by Revenue</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Product</th>
                    <th className="pb-3 px-3">Department</th>
                    <th className="pb-3 px-3">Units Sold</th>
                    <th className="pb-3 px-3">Gross Revenue (₦)</th>
                    <th className="pb-3 px-3 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {topProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white">{p.name}</td>
                      <td className="py-3.5 px-3 text-gray-400">{p.category}</td>
                      <td className="py-3.5 px-3 font-bold text-white">{p.unitsSold} packs</td>
                      <td className="py-3.5 px-3 font-black text-[#0aad0a] font-mono">{formatNaira(p.revenue)}</td>
                      <td className="py-3.5 px-3 text-right">
                        {p.trend === 'up' ? (
                          <span className="text-[#0aad0a] text-xs font-bold inline-flex items-center gap-1">
                            <TrendingUp size={14} /> Rising
                          </span>
                        ) : (
                          <span className="text-amber-400 text-xs font-bold inline-flex items-center gap-1">
                            <TrendingDown size={14} /> Stabilizing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Recommended Actions */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-black flex items-center gap-2 text-[#0aad0a]">
              <Lightbulb size={18} /> Automated Recommendations
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-gray-900 border border-gray-800 rounded-2xl space-y-1">
                <span className="font-bold text-amber-300 block flex items-center gap-1.5">
                  <AlertCircle size={13} /> Weekend Surge Driver Shortage
                </span>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Friday-Sunday delivery density spikes by 48% in Victoria Island. Recommend increasing trip bonuses by ₦500.
                </p>
              </div>

              <div className="p-3.5 bg-gray-900 border border-gray-800 rounded-2xl space-y-1">
                <span className="font-bold text-[#0aad0a] block flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Organic Dairy High Margin
                </span>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Whole milk and artisanal cheeses yield 18% higher repeat purchases. Recommend featuring Dairy category on storefront hero banner.
                </p>
              </div>

              <div className="p-3.5 bg-gray-900 border border-gray-800 rounded-2xl space-y-1">
                <span className="font-bold text-blue-300 block flex items-center gap-1.5">
                  <Sparkles size={13} /> Promotional Coupon Optimization
                </span>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Coupons with minimum basket ₦10,000 generate 3.2x larger average ticket size than flat percentage discounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
