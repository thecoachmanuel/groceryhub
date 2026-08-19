'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, CheckCircle2, Truck, Printer, Eye, Filter, RefreshCw } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { useSellerAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api-fetch';

interface StoreOrder {
  id: string;
  _id: string;
  date: string;
  customer: string;
  itemsCount: number;
  total: number;
  status: string;
  driver: string;
}

export default function SellerOrdersPage() {
  const { seller } = useSellerAuth();
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Filter orders relevant to this seller if seller_id exists
        const sellerId = (seller as any)?.seller_id || (seller as any)?.id;
        const filteredData = sellerId
          ? json.data.filter((o: any) => !o.seller_id || o.seller_id === sellerId)
          : json.data;

        const formatted: StoreOrder[] = filteredData.map((o: any) => ({
          id: o.order_id || `ORD-${String(o._id).slice(-5).toUpperCase()}`,
          _id: o._id,
          date: o.createdAt ? new Date(o.createdAt).toLocaleString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
          customer: o.customer_name || (o.user_id ? `Customer #${o.user_id}` : 'Valued Customer'),
          itemsCount: Array.isArray(o.items) ? o.items.length : 1,
          total: o.total_amount || o.final_total || 0,
          status: o.order_status || o.active_status || 'placed',
          driver: o.delivery_boy_name || (o.delivery_boy_id ? `Rider #${o.delivery_boy_id}` : 'Unassigned Courier'),
        }));
        setOrders(formatted);
      }
    } catch (err) {
      console.warn('Failed to fetch seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [seller]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus.toLowerCase() }),
      });
    } catch (err) {
      console.warn('Status update error:', err);
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus.toLowerCase() } : o))
    );
  };

  const filtered = orders.filter((o) =>
    statusFilter === 'all' ? true : o.status.toLowerCase().includes(statusFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-4 sm:p-10 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                <ShoppingBag size={24} className="text-[#0aad0a]" /> Store Orders Pipeline
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Fulfill incoming online customer grocery orders and dispatch couriers in Nigeria</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrders}
                className="bg-[#1e2632] hover:bg-gray-800 p-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                title="Refresh Orders"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
              <Filter size={15} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1e2632] border border-gray-800 text-white text-xs font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#0aad0a]"
              >
                <option value="all">All Orders</option>
                <option value="placed">Placed (New)</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Packing at Store</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-xl">
            {loading ? (
              <div className="py-16 text-center text-gray-400 text-xs font-bold flex flex-col items-center gap-2">
                <RefreshCw size={24} className="animate-spin text-[#0aad0a]" />
                Loading live store orders from MongoDB...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag size={36} className="mx-auto text-gray-500" />
                <h3 className="text-base font-bold text-white">No store orders found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Your store pipeline is ready. When customers purchase your listed inventory, incoming orders will show up here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[640px]">
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
                            order.status.toLowerCase() === 'delivered' ? 'bg-emerald-950 text-[#0aad0a]' : 'bg-amber-950 text-amber-400'
                          }`}>
                            ● {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300">{order.driver}</td>
                        <td className="py-4 text-right">
                          <select
                            value={order.status.toLowerCase()}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="bg-[#121820] border border-gray-700 text-xs font-bold text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#0aad0a]"
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Packing at Store</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
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
