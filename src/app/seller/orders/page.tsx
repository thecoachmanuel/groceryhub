'use client';

import { useState } from 'react';
import { ShoppingBag, Search, CheckCircle2, Truck, Printer, Eye, Filter } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { useSellerAuth } from '@/context/AuthContext';

const INITIAL_STORE_ORDERS = [
  { id: 'ORD-98241', date: 'Aug 17, 2026 at 08:30 PM', customer: 'Alex Johnson', itemsCount: 4, total: 45000.00, status: 'Out for Delivery', driver: 'Marcus Vance (+234 809 111 2233)' },
  { id: 'ORD-98240', date: 'Aug 17, 2026 at 07:15 PM', customer: 'Michael Scott', itemsCount: 2, total: 28500.00, status: 'Packed', driver: 'Awaiting Driver Assignment' },
  { id: 'ORD-98239', date: 'Aug 17, 2026 at 06:40 PM', customer: 'Sarah Miller', itemsCount: 3, total: 19500.00, status: 'Received', driver: 'None' },
  { id: 'ORD-98238', date: 'Aug 16, 2026 at 02:10 PM', customer: 'Chinedu Okafor', itemsCount: 6, total: 62100.00, status: 'Delivered', driver: 'David Chen' },
];

export default function SellerOrdersPage() {
  const { seller } = useSellerAuth();
  const isDemoSeller = seller?.email === 'vendor@groceryhub.ng';
  const [orders, setOrders] = useState(isDemoSeller ? INITIAL_STORE_ORDERS : []);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filtered = orders.filter((o) =>
    statusFilter === 'all' ? true : o.status.toLowerCase() === statusFilter.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <ShoppingBag size={24} className="text-[#0aad0a]" /> Store Orders Pipeline
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Fulfill incoming online customer grocery orders and dispatch couriers in Nigeria</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1e2632] border border-gray-800 text-white text-xs font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#0aad0a]"
              >
                <option value="all">All Orders</option>
                <option value="received">Received (New)</option>
                <option value="packed">Packed</option>
                <option value="out for delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag size={36} className="mx-auto text-gray-500" />
                <h3 className="text-base font-bold text-white">No store orders received yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Your store pipeline is fresh and ready. When customers purchase your listed inventory, incoming orders will show up here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Total (₦)</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Assigned Courier</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-medium">
                    {filtered.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 font-bold text-white font-mono">{order.id}</td>
                        <td className="py-4 text-gray-400">{order.date}</td>
                        <td className="py-4 text-white font-bold">{order.customer}</td>
                        <td className="py-4 font-mono font-bold text-[#0aad0a]">{formatNaira(order.total)}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'Delivered' ? 'bg-emerald-950 text-[#0aad0a]' : 'bg-amber-950 text-amber-400'
                          }`}>
                            ● {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300">{order.driver}</td>
                        <td className="py-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="bg-[#121820] border border-gray-700 text-xs font-bold text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#0aad0a]"
                          >
                            <option value="Received">Received</option>
                            <option value="Packed">Packed</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
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
    </div>
  );
}
