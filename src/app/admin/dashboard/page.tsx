'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Users, 
  Store, 
  ArrowUpRight,
  Truck,
  RefreshCw,
  Tag
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';
import { useAdminAuth } from '@/context/AuthContext';

interface AdminStatsData {
  usersCount: number;
  sellersCount: number;
  ridersCount: number;
  productsCount: number;
  ordersCount: number;
  brandsCount: number;
  totalGMV: number;
  recentOrders: any[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdminAuthenticated, isInitialized } = useAdminAuth();
  
  const [stats, setStats] = useState<AdminStatsData>({
    usersCount: 0,
    sellersCount: 0,
    ridersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    brandsCount: 0,
    totalGMV: 0,
    recentOrders: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
      }
    } catch (err) {
      console.warn('Failed to load admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (!isInitialized) return;
    const hasAdminToken = typeof window !== 'undefined' && !!localStorage.getItem('groceryhub_admin_token');
    if (!isAdminAuthenticated && !hasAdminToken) {
      router.replace('/admin/login');
      return;
    }

    fetchStats();
  }, [isInitialized, isAdminAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#121820] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a]" />
      </div>
    );
  }

  const hasAdminToken = typeof window !== 'undefined' && !!localStorage.getItem('groceryhub_admin_token');
  if (!isAdminAuthenticated && !hasAdminToken) return null;

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black">Super Admin Console</h1>
            <p className="text-xs text-gray-400 mt-0.5">Real-time ecosystem metrics synced directly with MongoDB backend</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              disabled={loadingStats}
              className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              title="Refresh Stats"
            >
              <RefreshCw size={14} className={loadingStats ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <span className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] text-xs font-bold px-3 py-2 rounded-xl border border-[#0aad0a]/20">
              <span className="w-2 h-2 rounded-full bg-[#0aad0a] animate-pulse" />
              Live Server &bull; NGN (₦)
            </span>
          </div>
        </div>

        {/* 4 Primary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Total Gross GMV</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
                ₦
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white font-mono">{formatNaira(stats.totalGMV)}</h3>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                Real-time Database Total
              </p>
            </div>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Total System Orders</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{stats.ordersCount}</h3>
              <p className="text-xs text-blue-400 font-semibold flex items-center gap-1 mt-1">
                Order Pipeline Count
              </p>
            </div>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Registered Customers</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Users size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{stats.usersCount}</h3>
              <p className="text-xs text-purple-400 font-semibold flex items-center gap-1 mt-1">
                Database Customer Accounts
              </p>
            </div>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Active Merchants &amp; Riders</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Store size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{stats.sellersCount} Vendors</h3>
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1 mt-1">
                {stats.ridersCount} Delivery Couriers
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Overview Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#1e2632]/80 border border-gray-800/80 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-bold block">Total Store Products</span>
                <span className="text-base font-black text-white">{stats.productsCount} Items</span>
              </div>
            </div>
            <Link href="/admin/products" className="text-xs font-bold text-[#0aad0a] hover:underline">Manage &rarr;</Link>
          </div>

          <div className="bg-[#1e2632]/80 border border-gray-800/80 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Tag size={18} />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-bold block">Certified Brands</span>
                <span className="text-base font-black text-white">{stats.brandsCount} Brands</span>
              </div>
            </div>
            <Link href="/admin/brands" className="text-xs font-bold text-[#0aad0a] hover:underline">Manage &rarr;</Link>
          </div>

          <div className="bg-[#1e2632]/80 border border-gray-800/80 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Truck size={18} />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-bold block">Active Delivery Fleet</span>
                <span className="text-base font-black text-white">{stats.ridersCount} Couriers</span>
              </div>
            </div>
            <Link href="/admin/delivery-boys" className="text-xs font-bold text-[#0aad0a] hover:underline">Manage &rarr;</Link>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black">Recent Ecosystem Orders</h3>
              <p className="text-xs text-gray-400">Live order transactions recorded in database</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-[#0aad0a] hover:underline">
              View All Orders &rarr;
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="py-12 text-center space-y-2 border border-dashed border-gray-800 rounded-2xl">
              <ShoppingBag size={32} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold text-white">No orders recorded in database yet</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Incoming online customer orders across all vendors will automatically stream here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Customer ID</th>
                    <th className="pb-3 px-3">Total Payable (₦)</th>
                    <th className="pb-3 px-3">Payment Method</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {stats.recentOrders.map((row) => (
                    <tr key={row._id || row.order_id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white font-mono">
                        {row.order_id || `ORD-${row.id || '001'}`}
                      </td>
                      <td className="py-3.5 px-3 text-gray-300">
                        {row.customer_name || row.delivery_address?.title || (row.user_id ? `Customer #${row.user_id}` : 'Valued Customer')}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-white font-mono">{formatNaira(row.total_amount || row.total_payable || row.final_total || 0)}</td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-300 uppercase">
                          {row.payment_method || 'Online'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-[#0aad0a] capitalize">
                          ● {row.order_status || row.active_status || 'placed'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link href="/admin/orders" className="text-xs font-bold text-[#0aad0a] hover:underline">
                          Manage
                        </Link>
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
