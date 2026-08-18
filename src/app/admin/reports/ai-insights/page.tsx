'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BarChart3, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  RefreshCw, 
  Flame, 
  ShoppingBag,
  DollarSign,
  Percent,
  RotateCcw
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface TopProduct {
  id: number;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  trend: 'up' | 'down';
}

const INITIAL_TOP_PRODUCTS: TopProduct[] = [
  { id: 1, name: 'Fresh Organic Farm Broccoli', category: 'Vegetables', unitsSold: 412, revenue: 1437.88, trend: 'up' },
  { id: 2, name: 'Red Sweet Crisp Apples (Washington)', category: 'Fruits', unitsSold: 389, revenue: 1668.81, trend: 'up' },
  { id: 3, name: 'Farm Fresh Pure Whole Milk', category: 'Dairy & Eggs', unitsSold: 340, revenue: 1322.60, trend: 'up' },
  { id: 4, name: 'Fresh Ripe Hass Avocados (Pack of 3)', category: 'Vegetables', unitsSold: 285, revenue: 1422.15, trend: 'up' },
  { id: 5, name: 'Organic Baby Spinach (Pre-washed)', category: 'Vegetables', unitsSold: 198, revenue: 552.42, trend: 'down' },
];

export default function AdminAiInsightsPage() {
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-17');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [topProducts] = useState<TopProduct[]>(INITIAL_TOP_PRODUCTS);

  const handleRefresh = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-[#0aad0a]/40 text-[#0aad0a] px-3 py-1 rounded-full text-xs font-black mb-1">
              <Sparkles size={13} /> Machine Learning & Predictive Analytics
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              AI Insight & Demand Forecasting Report
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Automated sales analysis, stock replenishment recommendations, and customer basket intelligence
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/reports"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              General Financials
            </Link>
            <Link
              href="/admin/reports/pos"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              POS Register Report
            </Link>
          </div>
        </div>

        {/* Date Filter Bar */}
        <form
          onSubmit={handleRefresh}
          className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold">Period From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0aad0a]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0aad0a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isRefreshing}
            className="bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Generating AI Predictions...' : 'Refresh AI Analytics'}</span>
          </button>
        </form>

        {/* 4 Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold">Total Platform Orders</span>
              <ShoppingBag size={18} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-black text-white">1,482</h3>
            <p className="text-[11px] text-[#0aad0a] flex items-center gap-1 font-semibold">
              <ArrowUpRight size={13} /> +14.2% vs previous period
            </p>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold">Gross Platform Revenue</span>
              <DollarSign size={18} className="text-[#0aad0a]" />
            </div>
            <h3 className="text-2xl font-black text-[#0aad0a]">$48,920.50</h3>
            <p className="text-[11px] text-gray-400">Average basket value $33.01</p>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold">Discounts & Promos Given</span>
              <Percent size={18} className="text-amber-400" />
            </div>
            <h3 className="text-2xl font-black text-amber-400">$3,410.00</h3>
            <p className="text-[11px] text-gray-400">6.9% coupon redemption rate</p>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold">Refunds & Claims Settled</span>
              <RotateCcw size={18} className="text-orange-400" />
            </div>
            <h3 className="text-2xl font-black text-orange-400">$218.40</h3>
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
                    <th className="pb-3 px-3">Gross Revenue</th>
                    <th className="pb-3 px-3 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {topProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white">{p.name}</td>
                      <td className="py-3.5 px-3 text-gray-400">{p.category}</td>
                      <td className="py-3.5 px-3 font-bold text-white">{p.unitsSold} packs</td>
                      <td className="py-3.5 px-3 font-black text-[#0aad0a]">${p.revenue.toFixed(2)}</td>
                      <td className="py-3.5 px-3 text-right">
                        {p.trend === 'up' ? (
                          <span className="text-[#0aad0a] text-xs font-bold inline-flex items-center gap-1">
                            <TrendingUp size={14} /> Rising
                          </span>
                        ) : (
                          <span className="text-amber-400 text-xs font-bold inline-flex items-center gap-1">
                            <TrendingDown size={14} /> Softening
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Automated Stock Advice */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-black flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-400" /> AI Stock & Promo Advice
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-emerald-950/40 border border-[#0aad0a]/30 p-3.5 rounded-2xl space-y-1">
                <div className="font-bold text-[#0aad0a] flex items-center gap-1.5">
                  <TrendingUp size={14} /> High Demand Spike Expected
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Organic Hass Avocados and Farm Milk have a 92% repeat velocity on Friday–Sunday. Increase warehouse stock by 30%.
                </p>
              </div>

              <div className="bg-amber-950/40 border border-amber-800/30 p-3.5 rounded-2xl space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Slow Moving Produce Notice
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Baby Spinach inventory turns slowed down 14%. Consider launching a flash discount tag to clear farm inventory before freshness window.
                </p>
              </div>

              <div className="bg-blue-950/40 border border-blue-800/30 p-3.5 rounded-2xl space-y-1">
                <div className="font-bold text-blue-400 flex items-center gap-1.5">
                  <ShoppingBag size={14} /> Cross-Sell Optimization
                </div>
                <p className="text-gray-300 leading-relaxed">
                  64% of shoppers purchasing Red Apples also purchase Farm Milk. Pair them in dynamic Home Sections for higher basket size.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
