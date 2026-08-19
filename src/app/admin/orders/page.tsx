'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  User, 
  MapPin, 
  X,
  RefreshCw
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';
import { apiFetch } from '@/lib/api-fetch';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  _id?: string;
  user: string;
  phone: string;
  address: string;
  vendor: string;
  amount: number;
  paymentMethod: string;
  status: string;
  driver: string;
  time: string;
  items: OrderItem[];
}

const formatOrderFromApi = (o: any): Order => ({
  id: o.order_id || `ORD-${String(o._id).slice(-5).toUpperCase()}`,
  _id: o._id,
  user: o.customer_name || o.delivery_address?.title || (o.user_id ? `Customer #${o.user_id}` : 'Valued Customer'),
  phone: o.customer_phone || o.delivery_address?.phone || '—',
  address: o.delivery_address
    ? typeof o.delivery_address === 'string'
      ? o.delivery_address
      : `${o.delivery_address.address_line || o.delivery_address.address || ''}, ${o.delivery_address.city || 'Lagos'}`.trim().replace(/^,\s*/, '')
    : '—',
  vendor: o.seller_store_name || o.vendor_name || (o.seller_id ? `Store #${o.seller_id}` : 'GroceryHub Direct'),
  amount: o.total_amount || o.total_payable || o.final_total || 0,
  paymentMethod: o.payment_method ? String(o.payment_method).toUpperCase() : 'PAYSTACK',
  status: o.order_status || o.active_status || 'placed',
  driver: o.delivery_boy_name || (o.delivery_boy_id ? `Rider #${o.delivery_boy_id}` : 'Unassigned Rider'),
  time: o.createdAt || o.created_at ? new Date(o.createdAt || o.created_at).toLocaleString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
  items: Array.isArray(o.items)
    ? o.items.map((it: any) => ({
        name: it.product_name || it.name || 'Grocery Item',
        qty: it.quantity || it.qty || 1,
        price: it.price || 0,
      }))
    : [],
});

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [ordersRes, ridersRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/admin/delivery-boys').catch(() => null),
      ]);

      const json = await ordersRes.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data.map(formatOrderFromApi));
      }

      if (ridersRes) {
        const ridersJson = await ridersRes.json();
        if (ridersJson.success && Array.isArray(ridersJson.data)) {
          setRiders(ridersJson.data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch orders or riders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Order status updated to "${newStatus}" ✓`);
      } else {
        showToast(json.message || 'Failed to update status', false);
      }
    } catch (err) {
      showToast('Network error updating status', false);
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleAssignDriver = async (id: string, riderName: string) => {
    const selectedRiderObj = riders.find((r) => r.name === riderName);
    const riderId = Number(selectedRiderObj?.delivery_boy_id || selectedRiderObj?.id || 0);
    const riderPhone = selectedRiderObj?.mobile || selectedRiderObj?.phone || '';
    try {
      const res = await apiFetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_boy_name: riderName,
          delivery_boy_phone: riderPhone,
          delivery_boy_id: riderId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Rider "${riderName}" assigned successfully ✓`);
      } else {
        showToast(json.message || 'Failed to assign rider', false);
      }
    } catch (err) {
      showToast('Network error assigning rider', false);
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, driver: riderName } : o))
    );
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, driver: riderName });
    }
  };

  const statusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered') return 'bg-emerald-950/40 text-[#0aad0a]';
    if (s.includes('delivery')) return 'bg-amber-950/40 text-amber-400';
    if (s === 'cancelled') return 'bg-red-950/40 text-red-400';
    return 'bg-blue-950/40 text-blue-400';
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.phone && o.phone.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[999] px-5 py-3 rounded-xl text-sm font-bold shadow-2xl flex items-center gap-2 transition-all ${
          toast.ok ? 'bg-[#0aad0a] text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.ok ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <ShoppingBag size={24} className="text-[#0aad0a]" /> Customer Orders Management
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Live order pipeline, courier assignment, and Naira receipt invoicing
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, customer, phone..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="all">All Order Statuses ({orders.length})</option>
              <option value="placed">Placed (New)</option>
              <option value="packed">Packed</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading live orders from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <ShoppingBag size={36} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold">No orders found</h4>
              <p className="text-xs text-gray-400">
                {orders.length === 0
                  ? 'No customer orders in database yet. Orders placed by customers will appear here automatically.'
                  : 'No orders match your current filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Store Partner</th>
                    <th className="pb-3 px-3">Amount (₦)</th>
                    <th className="pb-3 px-3">Courier</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <span className="font-bold text-white block font-mono">{o.id}</span>
                          <span className="text-[11px] text-gray-500">{o.time}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <span className="font-bold text-white block">{o.user}</span>
                          <span className="text-[11px] text-gray-400 font-mono">{o.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-300">{o.vendor}</td>
                      <td className="py-3 px-3 font-bold text-white font-mono">{formatNaira(o.amount)}</td>
                      <td className="py-3 px-3">
                        <span className={o.driver === 'Unassigned' ? 'text-amber-400 font-bold' : 'text-gray-300'}>
                          {o.driver}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColor(o.status)}`}>
                          ● {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="bg-[#0aad0a]/10 hover:bg-[#0aad0a] text-[#0aad0a] hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Manage Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#0aad0a]">Order Management</span>
              <h3 className="text-xl font-black">{selectedOrder.id} Details</h3>
              <p className="text-xs text-gray-400">Placed on {selectedOrder.time}</p>
            </div>

            {/* Customer & Address */}
            <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300 font-bold">
                <User size={15} className="text-[#0aad0a]" />
                <span>{selectedOrder.user} ({selectedOrder.phone})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={15} className="text-[#0aad0a]" />
                <span>{selectedOrder.address}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-400 uppercase tracking-wider">Ordered Items</h4>
              {selectedOrder.items.length === 0 ? (
                <p className="text-gray-500 text-xs">No item breakdown available</p>
              ) : (
                selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-gray-800">
                    <span>{it.qty}x {it.name}</span>
                    <span className="font-bold font-mono">{formatNaira(it.price * it.qty)}</span>
                  </div>
                ))
              )}
              <div className="flex justify-between font-black text-white text-sm pt-2">
                <span>Total Amount</span>
                <span className="text-[#0aad0a] font-mono">{formatNaira(selectedOrder.amount)}</span>
              </div>
            </div>

            {/* Status & Driver Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Update Order Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="placed">Placed</option>
                  <option value="packed">Packed</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Assign Delivery Courier</label>
                <select
                  value={selectedOrder.driver}
                  onChange={(e) => handleAssignDriver(selectedOrder.id, e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Unassigned">Unassigned Courier</option>
                  {riders.map((r) => (
                    <option key={r._id || r.name} value={r.name}>
                      {r.name} ({r.mobile || r.vehicle_type || 'Courier Rider'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => alert(`Printing Invoice for ${selectedOrder.id}...`)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                <span>Print PDF Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-bold px-6 py-3 rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
