'use client';

import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Barcode, 
  ArrowUpRight, 
  Truck
} from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Today&apos;s Revenue</span>
              <h3 className="text-2xl font-black text-white">$1,420.50</h3>
              <p className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
                <ArrowUpRight size={14} /> +22.4% from yesterday
              </p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Pending Orders</span>
              <h3 className="text-2xl font-black text-amber-400">8 Orders</h3>
              <p className="text-[11px] text-gray-400">4 awaiting dispatch</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Total Catalog Items</span>
              <h3 className="text-2xl font-black text-white">240 Products</h3>
              <p className="text-[11px] text-gray-400">12 low stock alerts</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Wallet Balance</span>
              <h3 className="text-2xl font-black text-[#0aad0a]">$4,850.00</h3>
              <Link href="/seller/earnings" className="text-[11px] text-amber-400 font-bold hover:underline block">
                Request Payout Withdrawal →
              </Link>
            </div>
          </div>

          {/* Quick Actions & Recent Orders */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">Incoming Store Orders</h3>
                <p className="text-xs text-gray-400">Online deliveries and POS counter transactions</p>
              </div>
              <Link
                href="/seller/orders"
                className="text-xs font-bold text-[#0aad0a] hover:underline"
              >
                View All Orders →
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
                    <th className="pb-3 px-3">Total</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {[
                    { id: 'ORD-98241', type: 'Online Delivery', user: 'Alex Johnson', items: '4 items', total: '$45.00', status: 'Out for Delivery', color: 'text-amber-400 bg-amber-950/30' },
                    { id: 'POS-84291', type: 'POS In-Store', user: 'Walk-in Customer', items: '2 items', total: '$14.20', status: 'Completed', color: 'text-[#0aad0a] bg-emerald-950/30' },
                    { id: 'ORD-98238', type: 'Online Delivery', user: 'Emma Davis', items: '6 items', total: '$62.10', status: 'Packed', color: 'text-blue-400 bg-blue-950/30' },
                  ].map((r) => (
                    <tr key={r.id} className="hover:bg-gray-800/40">
                      <td className="py-3 px-3 font-bold text-white">{r.id}</td>
                      <td className="py-3 px-3">{r.type}</td>
                      <td className="py-3 px-3">{r.user}</td>
                      <td className="py-3 px-3">{r.items}</td>
                      <td className="py-3 px-3 font-bold text-white">{r.total}</td>
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
