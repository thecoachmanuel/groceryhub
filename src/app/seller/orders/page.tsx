'use client';

import { useState } from 'react';
import { ShoppingBag, Search, CheckCircle2, Truck, Printer, Eye, Filter } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';

const INITIAL_STORE_ORDERS = [
  { id: 'ORD-98241', date: 'Aug 17, 2026 at 08:30 PM', customer: 'Alex Johnson', itemsCount: 4, total: 45000.00, status: 'Out for Delivery', driver: 'Marcus Vance (+234 809 111 2233)' },
  { id: 'ORD-98240', date: 'Aug 17, 2026 at 07:15 PM', customer: 'Michael Scott', itemsCount: 2, total: 28500.00, status: 'Packed', driver: 'Awaiting Driver Assignment' },
  { id: 'ORD-98239', date: 'Aug 17, 2026 at 06:40 PM', customer: 'Sarah Miller', itemsCount: 3, total: 19500.00, status: 'Received', driver: 'None' },
  { id: 'ORD-98238', date: 'Aug 16, 2026 at 02:10 PM', customer: 'Chinedu Okafor', itemsCount: 6, total: 62100.00, status: 'Delivered', driver: 'David Chen' },
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_STORE_ORDERS);
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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Items</th>
                    <th className="pb-3 px-3">Order Total (₦)</th>
                    <th className="pb-3 px-3">Assigned Courier</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div>
                          <span className="font-bold text-white block">{order.id}</span>
                          <span className="text-[11px] text-gray-500">{order.date}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-white font-bold">{order.customer}</td>
                      <td className="py-3.5 px-3">{order.itemsCount} products</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{formatNaira(order.total)}</td>
                      <td className="py-3.5 px-3 text-gray-400">{order.driver}</td>
                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-950/40 text-[#0aad0a]'
                            : order.status === 'Out for Delivery'
                            ? 'bg-amber-950/40 text-amber-400'
                            : 'bg-blue-950/40 text-blue-400'
                        }`}>
                          ● {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'Received' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Packed')}
                              className="px-3 py-1.5 bg-[#0aad0a] hover:bg-[#088f08] text-white font-bold rounded-lg transition-colors text-[11px]"
                            >
                              Mark Packed
                            </button>
                          )}
                          {order.status === 'Packed' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-lg transition-colors text-[11px]"
                            >
                              Handover to Courier
                            </button>
                          )}
                          {order.status === 'Out for Delivery' && (
                            <span className="text-[11px] text-amber-400 font-bold">In Transit</span>
                          )}
                          {order.status === 'Delivered' && (
                            <span className="text-[11px] text-[#0aad0a] font-bold flex items-center gap-1">
                              <CheckCircle2 size={13} /> Completed
                            </span>
                          )}
                          <button
                            onClick={() => alert(`Printing packing slip for ${order.id}`)}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white ml-1"
                            title="Print Packing Slip"
                          >
                            <Printer size={15} />
                          </button>
                        </div>
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
