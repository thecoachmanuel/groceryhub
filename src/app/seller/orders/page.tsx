'use client';

import { useState } from 'react';
import { ShoppingBag, Search, CheckCircle2, Truck, Printer, Eye, Filter } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';

const INITIAL_STORE_ORDERS = [
  { id: 'ORD-98241', date: 'Aug 17, 2026 at 08:30 PM', customer: 'Alex Johnson', itemsCount: 4, total: 45.00, status: 'Out for Delivery', driver: 'Marcus Vance (+1 555-789-0123)' },
  { id: 'ORD-98240', date: 'Aug 17, 2026 at 07:15 PM', customer: 'Michael Scott', itemsCount: 2, total: 28.50, status: 'Packed', driver: 'Awaiting Driver Assignment' },
  { id: 'ORD-98239', date: 'Aug 17, 2026 at 06:40 PM', customer: 'Sarah Miller', itemsCount: 3, total: 19.99, status: 'Received', driver: 'None' },
  { id: 'ORD-98238', date: 'Aug 16, 2026 at 02:10 PM', customer: 'Emma Davis', itemsCount: 6, total: 62.10, status: 'Delivered', driver: 'David Chen' },
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
              <p className="text-xs text-gray-400 mt-0.5">Fulfill incoming online customer grocery orders and dispatch couriers</p>
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
                    <th className="pb-3 px-3">Order Total</th>
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
                      <td className="py-3.5 px-3 font-bold text-white">${order.total.toFixed(2)}</td>
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
                              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-xl text-[11px]"
                            >
                              Mark Packed
                            </button>
                          )}
                          {order.status === 'Packed' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1 rounded-xl text-[11px]"
                            >
                              Dispatch Driver
                            </button>
                          )}
                          {order.status === 'Out for Delivery' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                              className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-bold px-3 py-1 rounded-xl text-[11px]"
                            >
                              Confirm Delivery
                            </button>
                          )}
                          <button
                            onClick={() => alert(`Printing packing slip for ${order.id}`)}
                            className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
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
