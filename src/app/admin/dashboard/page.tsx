'use client';

import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Store, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight,
  Truck
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

export default function AdminDashboardPage() {
  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Super Admin Console</h1>
            <p className="text-xs text-gray-400 mt-0.5">Real-time ecosystem overview across all zones and registered merchants in Nigeria</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] text-xs font-bold px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#0aad0a] animate-pulse" />
              Live Server v1.9.0 &bull; NGN (₦)
            </span>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Total Gross GMV</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <span className="font-bold text-base">₦</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white font-mono">{formatNaira(148290500)}</h3>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <ArrowUpRight size={14} /> +14.2% from last month
              </p>
            </div>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Total Orders</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">4,821</h3>
              <p className="text-xs text-blue-400 font-semibold flex items-center gap-1 mt-1">
                <ArrowUpRight size={14} /> +8.6% this week
              </p>
            </div>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Active Customers</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Users size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">12,490</h3>
              <p className="text-xs text-purple-400 font-semibold flex items-center gap-1 mt-1">
                <ArrowUpRight size={14} /> +320 new today
              </p>
            </div>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Active Merchants</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Store size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">86 Stores</h3>
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1 mt-1">
                9 Pending approvals
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black">Recent Incoming Orders</h3>
              <p className="text-xs text-gray-400">Live order stream across all zones</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-[#0aad0a] hover:underline">
              View All Orders &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Vendor / Store</th>
                  <th className="pb-3 px-3">Amount (₦)</th>
                  <th className="pb-3 px-3">Payment</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {[
                  { id: 'ORD-98241', user: 'Alex Johnson', vendor: 'Green Valley Organic', amount: formatNaira(45000), pay: 'COD', status: 'Out for Delivery', color: 'text-amber-400 bg-amber-950/30' },
                  { id: 'ORD-98240', user: 'Sarah Miller', vendor: 'The Artisanal Bakery', amount: formatNaira(28500), pay: 'PAYSTACK', status: 'Packed', color: 'text-blue-400 bg-blue-950/30' },
                  { id: 'ORD-98239', user: 'James Wilson', vendor: 'Daily Dairy Fresh', amount: formatNaira(19200), pay: 'PAYSTACK', status: 'Delivered', color: 'text-[#0aad0a] bg-emerald-950/30' },
                  { id: 'ORD-98238', user: 'Chinedu Okafor', vendor: 'Green Valley Organic', amount: formatNaira(62100), pay: 'WALLET', status: 'Placed', color: 'text-purple-400 bg-purple-950/30' },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white font-mono">{row.id}</td>
                    <td className="py-3.5 px-3">{row.user}</td>
                    <td className="py-3.5 px-3 text-gray-300">{row.vendor}</td>
                    <td className="py-3.5 px-3 font-bold text-white font-mono">{row.amount}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                        {row.pay}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <Link href="/admin/orders" className="text-xs font-bold text-[#0aad0a] hover:underline">
                        Details
                      </Link>
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
