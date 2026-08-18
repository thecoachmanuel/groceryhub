'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  DollarSign, 
  ShoppingBag, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar,
  Package,
  Search,
  Star,
  Layers
} from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';

const DAILY_SALES = [
  { date: 'Aug 17, 2026', orders: 18, grossSales: 450.00, platformFee: 22.50, netPayout: 427.50 },
  { date: 'Aug 16, 2026', orders: 24, grossSales: 610.00, platformFee: 30.50, netPayout: 579.50 },
  { date: 'Aug 15, 2026', orders: 20, grossSales: 520.00, platformFee: 26.00, netPayout: 494.00 },
  { date: 'Aug 14, 2026', orders: 15, grossSales: 380.00, platformFee: 19.00, netPayout: 361.00 },
  { date: 'Aug 13, 2026', orders: 22, grossSales: 590.00, platformFee: 29.50, netPayout: 560.50 },
];

const PRODUCT_SALES = [
  { id: 1, name: 'Organic Honeycrisp Apples', category: 'Fruits', unitsSold: 142, revenue: 566.58, avgPrice: 3.99, rating: 4.9, inStock: 48 },
  { id: 2, name: 'Fresh Hass Avocados (Pack of 4)', category: 'Vegetables', unitsSold: 98, revenue: 587.02, avgPrice: 5.99, rating: 4.8, inStock: 25 },
  { id: 3, name: 'Pasture-Raised Organic Eggs (Dozen)', category: 'Dairy & Eggs', unitsSold: 85, revenue: 424.15, avgPrice: 4.99, rating: 5.0, inStock: 30 },
  { id: 4, name: 'Cold-Pressed Valencia Orange Juice (1L)', category: 'Beverages', unitsSold: 74, revenue: 369.26, avgPrice: 4.99, rating: 4.7, inStock: 18 },
  { id: 5, name: 'Organic Sliced Sourdough Loaf', category: 'Bakery', unitsSold: 62, revenue: 278.38, avgPrice: 4.49, rating: 4.9, inStock: 12 },
];

export default function SellerReportsPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'products'>('daily');
  const [salesData] = useState(DAILY_SALES);
  const [productData] = useState(PRODUCT_SALES);
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportCsv = () => {
    if (activeTab === 'daily') {
      const headers = 'Date,Orders,Gross Sales,Platform Fee,Net Payout\n';
      const rows = salesData
        .map((d) => `${d.date},${d.orders},$${d.grossSales.toFixed(2)},$${d.platformFee.toFixed(2)},$${d.netPayout.toFixed(2)}`)
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vendor_daily_sales_${Date.now()}.csv`;
      a.click();
    } else {
      const headers = 'Product Name,Category,Units Sold,Gross Revenue,Avg Price,Rating,Remaining Stock\n';
      const rows = productData
        .map((p) => `"${p.name}",${p.category},${p.unitsSold},$${p.revenue.toFixed(2)},$${p.avgPrice.toFixed(2)},${p.rating},${p.inStock}`)
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vendor_product_selling_report_${Date.now()}.csv`;
      a.click();
    }
  };

  const totalGross = salesData.reduce((sum, d) => sum + d.grossSales, 0);
  const totalFees = salesData.reduce((sum, d) => sum + d.platformFee, 0);
  const totalNet = salesData.reduce((sum, d) => sum + d.netPayout, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const totalUnitsSold = productData.reduce((sum, p) => sum + p.unitsSold, 0);

  const filteredProducts = productData.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <BarChart3 size={24} className="text-[#0aad0a]" /> Store Sales & Performance Analytics
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Analyze order volume, gross sales revenue, product sell-through rates, and platform commission breakdown
              </p>
            </div>

            <button
              onClick={handleExportCsv}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Download size={16} />
              <span>Export {activeTab === 'daily' ? 'Sales' : 'Products'} CSV</span>
            </button>
          </div>

          {/* Report Type Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === 'daily'
                  ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <TrendingUp size={14} /> Daily Settlement Report
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === 'products'
                  ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <Package size={14} /> Product Selling Report
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-1">
              <span className="text-xs font-bold text-gray-400">Total Gross Sales</span>
              <div className="text-2xl font-black text-white font-mono">${totalGross.toFixed(2)}</div>
              <span className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
                <ArrowUpRight size={12} /> +18.4% this week
              </span>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-1">
              <span className="text-xs font-bold text-gray-400">Platform Commission (5%)</span>
              <div className="text-2xl font-black text-amber-400 font-mono">-${totalFees.toFixed(2)}</div>
              <span className="text-[11px] text-gray-400">Auto-deducted fee</span>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-1">
              <span className="text-xs font-bold text-gray-400">Net Merchant Payout</span>
              <div className="text-2xl font-black text-[#0aad0a] font-mono">${totalNet.toFixed(2)}</div>
              <span className="text-[11px] text-emerald-400">Ready for bank withdrawal</span>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-1">
              <span className="text-xs font-bold text-gray-400">Total Units Sold</span>
              <div className="text-2xl font-black text-blue-400 font-mono">{totalUnitsSold} items</div>
              <span className="text-[11px] text-gray-400">Across {totalOrders} customer orders</span>
            </div>
          </div>

          {activeTab === 'daily' ? (
            /* Daily Sales Table */
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-[#0aad0a]" /> Daily Order Volume & Net Settlements
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3">Fulfilled Orders</th>
                      <th className="pb-3 px-3">Gross Sales</th>
                      <th className="pb-3 px-3">Commission Cut (5%)</th>
                      <th className="pb-3 px-3">Net Payout</th>
                      <th className="pb-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                    {salesData.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-white">{d.date}</td>
                        <td className="py-3.5 px-3">{d.orders} orders</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-white">${d.grossSales.toFixed(2)}</td>
                        <td className="py-3.5 px-3 font-mono text-amber-400">-${d.platformFee.toFixed(2)}</td>
                        <td className="py-3.5 px-3 font-mono font-black text-[#0aad0a] text-sm">${d.netPayout.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30 font-bold px-2.5 py-1 rounded-full text-[10px]">
                            ✓ Settled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Product Selling Report */
            <div className="space-y-4">
              <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search product sales by title or department..."
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Package size={16} className="text-[#0aad0a]" /> Product Performance & Sell-Through Velocity
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="pb-3 px-3">Product Name</th>
                        <th className="pb-3 px-3">Category</th>
                        <th className="pb-3 px-3">Units Sold</th>
                        <th className="pb-3 px-3">Unit Price</th>
                        <th className="pb-3 px-3">Gross Revenue</th>
                        <th className="pb-3 px-3">Customer Rating</th>
                        <th className="pb-3 px-3 text-right">Stock Remaining</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-white">{p.name}</td>
                          <td className="py-3.5 px-3 text-gray-400">{p.category}</td>
                          <td className="py-3.5 px-3 font-mono font-bold text-white">{p.unitsSold} units</td>
                          <td className="py-3.5 px-3 font-mono text-gray-300">${p.avgPrice.toFixed(2)}</td>
                          <td className="py-3.5 px-3 font-mono font-black text-[#0aad0a]">${p.revenue.toFixed(2)}</td>
                          <td className="py-3.5 px-3">
                            <span className="flex items-center gap-1 font-bold text-amber-400">
                              <Star size={13} fill="currentColor" /> {p.rating}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
                              p.inStock < 15 ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' : 'text-gray-300'
                            }`}>
                              {p.inStock} left
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
