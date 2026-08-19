'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Download, ShoppingBag, TrendingUp, Calendar, Package, Search, RefreshCw } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { apiFetch } from '@/lib/api-fetch';
import { useSellerAuth } from '@/context/AuthContext';

interface DailySaleRow { date: string; orders: number; grossSales: number; platformFee: number; netPayout: number; }
interface ProductSaleRow { id: string; name: string; category: string; unitsSold: number; revenue: number; avgPrice: number; rating: number; inStock: number; }

export default function SellerReportsPage() {
  const { seller } = useSellerAuth();
  const sellerId = (seller as any)?.id || (seller as any)?.seller_id;

  const [activeTab, setActiveTab] = useState<'daily' | 'products'>('daily');
  const [dateRange, setDateRange] = useState('month');
  const [salesData, setSalesData] = useState<DailySaleRow[]>([]);
  const [productData, setProductData] = useState<ProductSaleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const url = `/api/seller/reports?range=${dateRange}${sellerId ? `&seller_id=${sellerId}` : ''}`;
      const res = await apiFetch(url);
      const json = await res.json();
      if (json.success) {
        setSalesData(json.daily_sales || []);
        setProductData(json.product_sales || []);
      }
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, [dateRange, sellerId]);

  const handleExportCsv = () => {
    if (activeTab === 'daily') {
      if (salesData.length === 0) return alert('No daily sales data to export.');
      const headers = 'Date,Orders,Gross Sales,Platform Fee,Net Payout\n';
      const rows = salesData.map((d) => `${d.date},${d.orders},${d.grossSales.toFixed(2)},${d.platformFee.toFixed(2)},${d.netPayout.toFixed(2)}`).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `vendor_daily_sales_${Date.now()}.csv`; a.click();
    } else {
      if (productData.length === 0) return alert('No product data to export.');
      const headers = 'Product Name,Category,Units Sold,Gross Revenue,Avg Price\n';
      const rows = productData.map((p) => `"${p.name}",${p.category},${p.unitsSold},${p.revenue.toFixed(2)},${p.avgPrice.toFixed(2)}`).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `vendor_product_report_${Date.now()}.csv`; a.click();
    }
  };

  const totalGross = salesData.reduce((s, d) => s + d.grossSales, 0);
  const totalFees = salesData.reduce((s, d) => s + d.platformFee, 0);
  const totalNet = salesData.reduce((s, d) => s + d.netPayout, 0);
  const totalOrders = salesData.reduce((s, d) => s + d.orders, 0);
  const totalUnitsSold = productData.reduce((s, p) => s + p.unitsSold, 0);
  const filteredProducts = productData.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col">
      <div>
        <SellerNav />
        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <BarChart3 size={24} className="text-[#0aad0a]" /> Sales Analytics &amp; Reports
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Live online sales data — POS in-store sales are tracked separately</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-[#1e2632] border border-gray-800 text-white text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0aad0a]">
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="year">Year to Date</option>
              </select>
              <button onClick={fetchReports} className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={handleExportCsv} className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95">
                <Download size={15} /> Export CSV
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, color: 'text-blue-400' },
              { label: 'Gross Revenue', value: formatNaira(totalGross), icon: TrendingUp, color: 'text-[#0aad0a]' },
              { label: 'Platform Fee (5%)', value: formatNaira(totalFees), icon: Calendar, color: 'text-amber-400' },
              { label: 'Net Payout', value: formatNaira(totalNet), icon: Package, color: 'text-emerald-400' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
                  <span className="text-xs text-gray-400 font-bold">{card.label}</span>
                  <h3 className={`text-xl font-black font-mono ${card.color}`}>{card.value}</h3>
                  <Icon size={16} className={card.color} />
                </div>
              );
            })}
          </div>

          {/* Tab navigation */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
            {(['daily', 'products'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab ? 'bg-[#0aad0a] text-white' : 'bg-[#1e2632] text-gray-400 hover:text-white'}`}>
                {tab === 'daily' ? 'Daily Sales' : `Product Performance (${totalUnitsSold} units)`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400">Loading live sales analytics...</div>
          ) : activeTab === 'daily' ? (
            salesData.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400">No sales data for this period.</div>
            ) : (
              <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3">Orders</th>
                      <th className="pb-3 px-3">Gross Sales</th>
                      <th className="pb-3 px-3">Platform Fee (5%)</th>
                      <th className="pb-3 px-3">Net Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-gray-300">
                    {salesData.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-white">{d.date}</td>
                        <td className="py-3.5 px-3">{d.orders}</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-white">{formatNaira(d.grossSales)}</td>
                        <td className="py-3.5 px-3 font-mono text-amber-400">{formatNaira(d.platformFee)}</td>
                        <td className="py-3.5 px-3 font-mono font-black text-[#0aad0a]">{formatNaira(d.netPayout)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
              <div className="relative max-w-sm">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">No product sales data for this period.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="pb-3 px-3">Product</th>
                        <th className="pb-3 px-3">Category</th>
                        <th className="pb-3 px-3">Units Sold</th>
                        <th className="pb-3 px-3">Revenue</th>
                        <th className="pb-3 px-3">Avg Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 text-gray-300">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-white max-w-xs truncate">{p.name}</td>
                          <td className="py-3.5 px-3 text-gray-400">{p.category}</td>
                          <td className="py-3.5 px-3 font-bold text-blue-400">{p.unitsSold}</td>
                          <td className="py-3.5 px-3 font-mono font-bold text-[#0aad0a]">{formatNaira(p.revenue)}</td>
                          <td className="py-3.5 px-3 font-mono">{formatNaira(p.avgPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
