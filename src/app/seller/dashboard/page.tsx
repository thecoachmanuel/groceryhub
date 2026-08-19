'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Package, 
  Barcode, 
  ArrowUpRight, 
  Truck,
  Wallet,
  RefreshCw
} from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { useSellerAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api-fetch';

interface SellerDashboardOrder {
  _id: string;
  order_id: string;
  user_name?: string;
  items_count: number;
  total_amount: number;
  order_status: string;
  payment_method: string;
  createdAt: string;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const { seller, isSellerAuthenticated, isInitialized } = useSellerAuth();

  const [orders, setOrders] = useState<SellerDashboardOrder[]>([]);
  const [catalogCount, setCatalogCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const sellerId = seller?.id;

  const fetchSellerData = async () => {
    if (!sellerId) return;
    try {
      setLoading(true);

      // Fetch seller's real orders
      const ordersRes = await apiFetch(`/api/orders?seller_id=${sellerId}`);
      const ordersJson = await ordersRes.json().catch(() => ({}));
      if (ordersJson.success && Array.isArray(ordersJson.data)) {
        setOrders(
          ordersJson.data.map((o: any) => ({
            _id: o._id,
            order_id: o.order_id || `ORD-${String(o._id).slice(-6)}`,
            user_name: o.delivery_address?.title || o.user?.name || 'Store Customer',
            items_count: o.items ? o.items.reduce((acc: number, i: any) => acc + (i.quantity || 1), 0) : 0,
            total_amount: o.total_amount || o.final_total || 0,
            order_status: o.order_status || 'pending',
            payment_method: (o.payment_method || 'Online').toUpperCase(),
            createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-NG') : '—',
          }))
        );
      }

      // Fetch seller's real product catalog count
      const prodRes = await apiFetch(`/api/products?seller_id=${sellerId}`);
      const prodJson = await prodRes.json().catch(() => ({}));
      if (prodJson.success && Array.isArray(prodJson.data)) {
        setCatalogCount(prodJson.data.length);
      }
    } catch (err) {
      console.warn('Error loading seller dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized) return;
    const hasSellerToken = typeof window !== 'undefined' && !!localStorage.getItem('groceryhub_seller_token');
    if (!isSellerAuthenticated && !hasSellerToken) {
      router.replace('/seller/login');
      return;
    }
    fetchSellerData();
  }, [isInitialized, isSellerAuthenticated, sellerId, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#121820] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a]" />
      </div>
    );
  }

  const hasSellerToken = typeof window !== 'undefined' && !!localStorage.getItem('groceryhub_seller_token');
  if (!isSellerAuthenticated && !hasSellerToken) return null;

  // Real Metric Calculations
  const revenue = orders.reduce((sum, o) => sum + (o.order_status !== 'cancelled' ? o.total_amount : 0), 0);
  const pendingOrders = orders.filter((o) => ['pending', 'preparing', 'packed', 'placed'].includes(o.order_status.toLowerCase())).length;
  const walletBalance = seller?.walletBalance ?? revenue;

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Total Store Revenue</span>
              <h3 className="text-2xl font-black text-white font-mono">{formatNaira(revenue)}</h3>
              <p className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
                Real-time MongoDB Store Ledger
              </p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Pending Orders</span>
              <h3 className="text-2xl font-black text-amber-400">{pendingOrders} Orders</h3>
              <p className="text-[11px] text-gray-400">Awaiting store dispatch / fulfillment</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Total Catalog Items</span>
              <h3 className="text-2xl font-black text-white">{catalogCount} Products</h3>
              <p className="text-[11px] text-gray-400">Active store inventory items</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Wallet Balance</span>
              <h3 className="text-2xl font-black text-[#0aad0a] font-mono">{formatNaira(walletBalance)}</h3>
              <Link href="/seller/earnings" className="text-[11px] text-amber-400 font-bold hover:underline block">
                Request Payout Withdrawal &rarr;
              </Link>
            </div>
          </div>

          {/* Quick Actions & Recent Orders */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">Incoming Store Orders</h3>
                <p className="text-xs text-gray-400">Real-time store orders for {seller?.storeName || seller?.name || 'Store Partner'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchSellerData}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
                  title="Refresh store orders"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
                <Link
                  href="/seller/orders"
                  className="text-xs font-bold text-[#0aad0a] hover:underline"
                >
                  View All Orders &rarr;
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8 text-xs text-gray-400">Loading seller orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  No orders placed for this store yet. Items added to catalog will appear here once purchased.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="pb-3 px-3">Order ID</th>
                      <th className="pb-3 px-3">Customer</th>
                      <th className="pb-3 px-3">Items</th>
                      <th className="pb-3 px-3">Payment</th>
                      <th className="pb-3 px-3">Total (₦)</th>
                      <th className="pb-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                    {orders.slice(0, 10).map((r) => (
                      <tr key={r._id} className="hover:bg-gray-800/40">
                        <td className="py-3 px-3 font-bold text-white font-mono">{r.order_id}</td>
                        <td className="py-3 px-3 text-gray-200">{r.user_name}</td>
                        <td className="py-3 px-3 text-gray-400">{r.items_count} items</td>
                        <td className="py-3 px-3 text-gray-400">{r.payment_method}</td>
                        <td className="py-3 px-3 font-bold text-white font-mono">{formatNaira(r.total_amount)}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              r.order_status === 'delivered'
                                ? 'text-[#0aad0a] bg-emerald-950/30'
                                : r.order_status === 'out_for_delivery'
                                ? 'text-amber-400 bg-amber-950/30'
                                : 'text-blue-400 bg-blue-950/30'
                            }`}
                          >
                            ● {r.order_status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
