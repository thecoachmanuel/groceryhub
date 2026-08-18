'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Package, 
  Barcode, 
  ArrowUpRight, 
  Truck,
  Wallet
} from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { useSellerAuth } from '@/context/AuthContext';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { seller, isSellerAuthenticated, isInitialized } = useSellerAuth();

  useEffect(() => {
    if (!isInitialized) return;
    const hasSellerToken = typeof window !== 'undefined' && !!localStorage.getItem('groceryhub_seller_token');
    if (!isSellerAuthenticated && !hasSellerToken) {
      router.replace('/seller/login');
    }
  }, [isInitialized, isSellerAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#121820] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a]" />
      </div>
    );
  }

  const hasSellerToken = typeof window !== 'undefined' && !!localStorage.getItem('groceryhub_seller_token');
  if (!isSellerAuthenticated && !hasSellerToken) return null;

  const isDemoSeller = seller?.email === 'vendor@groceryhub.ng';
  const revenue = isDemoSeller ? 142050 : (seller?.balance || 0);
  const pendingOrders = isDemoSeller ? 8 : 0;
  const catalogCount = isDemoSeller ? 240 : 0;
  const walletBalance = isDemoSeller ? 890400 : (seller?.balance || 0);

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Today&apos;s Revenue</span>
              <h3 className="text-2xl font-black text-white font-mono">{formatNaira(revenue)}</h3>
              <p className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
                {isDemoSeller ? <><ArrowUpRight size={14} /> +22.4% from yesterday</> : 'Fresh Store Account'}
              </p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Pending Orders</span>
              <h3 className="text-2xl font-black text-amber-400">{pendingOrders} Orders</h3>
              <p className="text-[11px] text-gray-400">{isDemoSeller ? '4 awaiting dispatch' : 'No active orders'}</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Total Catalog Items</span>
              <h3 className="text-2xl font-black text-white">{catalogCount} Products</h3>
              <p className="text-[11px] text-gray-400">{isDemoSeller ? '12 low stock alerts' : 'No listed products'}</p>
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
                <p className="text-xs text-gray-400">Online deliveries and POS counter transactions in Nigeria</p>
              </div>
              <Link
                href="/seller/orders"
                className="text-xs font-bold text-[#0aad0a] hover:underline"
              >
                View All Orders &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Items</th>
                    <th className="pb-3 px-3">Total (₦)</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {[
                    { id: 'ORD-98241', type: 'Online Delivery', user: 'Alex Johnson', items: '4 items', total: formatNaira(45000), status: 'Out for Delivery', color: 'text-amber-400 bg-amber-950/30' },
                    { id: 'POS-84291', type: 'POS In-Store', user: 'Walk-in Customer', items: '2 items', total: formatNaira(14200), status: 'Completed', color: 'text-[#0aad0a] bg-emerald-950/30' },
                    { id: 'ORD-98238', type: 'Online Delivery', user: 'Chinedu Okafor', items: '6 items', total: formatNaira(62100), status: 'Packed', color: 'text-blue-400 bg-blue-950/30' },
                  ].map((r) => (
                    <tr key={r.id} className="hover:bg-gray-800/40">
                      <td className="py-3 px-3 font-bold text-white">{r.id}</td>
                      <td className="py-3 px-3">{r.type}</td>
                      <td className="py-3 px-3">{r.user}</td>
                      <td className="py-3 px-3">{r.items}</td>
                      <td className="py-3 px-3 font-bold text-white font-mono">{r.total}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${r.color}`}>
                          ● {r.status}
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
    </div>
  );
}
