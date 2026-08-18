'use client';

import { useState } from 'react';
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
  X
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

const ALL_ORDERS = [
  {
    id: 'ORD-98241',
    user: 'Alex Johnson',
    phone: '+234 802 234 5678',
    address: 'Plot 14, Adeola Odeku St, Flat 4B, Victoria Island, Lagos',
    vendor: 'Green Valley Organic Farms',
    amount: 45000.00,
    paymentMethod: 'COD',
    status: 'Out for Delivery',
    driver: 'Marcus Vance',
    time: 'Aug 17, 08:30 PM',
    items: [
      { name: 'Organic Farm Broccoli (500g)', qty: 2, price: 3500 },
      { name: 'Red Sweet Crisp Apples (1kg)', qty: 1, price: 4500 },
      { name: 'Farm Fresh Pure Whole Milk (1L)', qty: 2, price: 3800 },
    ],
  },
  {
    id: 'ORD-98240',
    user: 'Sarah Miller',
    phone: '+234 803 345 6789',
    address: '12 Admiralty Way, Lekki Phase 1, Lagos',
    vendor: 'The Artisanal Bakery Co.',
    amount: 28500.00,
    paymentMethod: 'PAYSTACK',
    status: 'Packed',
    driver: 'Unassigned',
    time: 'Aug 17, 07:15 PM',
    items: [
      { name: 'Artisan Sourdough Bakery Bread (750g)', qty: 2, price: 3200 },
      { name: 'Pure Cold Pressed Extra Virgin Olive Oil (500ml)', qty: 1, price: 11500 },
    ],
  },
  {
    id: 'ORD-98239',
    user: 'James Wilson',
    phone: '+234 805 456 7890',
    address: '55 Isaac John Street, Ikeja GRA, Lagos',
    vendor: 'Daily Dairy & Poultry Fresh',
    amount: 19200.00,
    paymentMethod: 'PAYSTACK',
    status: 'Delivered',
    driver: 'David Chen',
    time: 'Aug 17, 06:10 PM',
    items: [
      { name: 'Pasture-Raised Organic Eggs (Crate of 30)', qty: 1, price: 4200 },
      { name: 'Fresh Hass Avocados (Pack of 4)', qty: 2, price: 3800 },
    ],
  },
  {
    id: 'ORD-98238',
    user: 'Chinedu Okafor',
    phone: '+234 809 111 2233',
    address: 'Flat 12, Oceanview Towers, Victoria Island, Lagos',
    vendor: 'Green Valley Organic Farms',
    amount: 62100.00,
    paymentMethod: 'PAYSTACK',
    status: 'Delivered',
    driver: 'David Chen',
    time: 'Aug 16, 04:30 PM',
    items: [
      { name: 'Organic Honeycrisp Apples (1kg)', qty: 3, price: 4500 },
      { name: 'Cold-Pressed Valencia Orange Juice (1L)', qty: 2, price: 3500 },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleAssignDriver = (id: string, driver: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, driver } : o))
    );
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, driver });
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <ShoppingBag size={24} className="text-[#0aad0a]" /> Customer Orders Management
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Live order pipeline, courier assignment, and Naira receipt invoicing</p>
          </div>
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
              <option value="all">All Order Statuses</option>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Store Partner</th>
                  <th className="pb-3 px-3">Amount (₦)</th>
                  <th className="pb-3 px-3">Assigned Courier</th>
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
                    <td className="py-3 px-3">{o.vendor}</td>
                    <td className="py-3 px-3 font-bold text-white font-mono">{formatNaira(o.amount)}</td>
                    <td className="py-3 px-3">
                      <span className={o.driver === 'Unassigned' ? 'text-amber-400 font-bold' : 'text-gray-300'}>
                        {o.driver}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        o.status === 'Delivered'
                          ? 'bg-emerald-950/40 text-[#0aad0a]'
                          : o.status === 'Out for Delivery'
                          ? 'bg-amber-950/40 text-amber-400'
                          : 'bg-blue-950/40 text-blue-400'
                      }`}>
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
        </div>

      </main>

      {/* Manage Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
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
              {selectedOrder.items.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between py-1 border-b border-gray-800">
                  <span>{it.qty}x {it.name}</span>
                  <span className="font-bold font-mono">{formatNaira(it.price * it.qty)}</span>
                </div>
              ))}
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
                  <option value="Placed">Placed</option>
                  <option value="Packed">Packed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Assign Delivery Partner</label>
                <select
                  value={selectedOrder.driver}
                  onChange={(e) => handleAssignDriver(selectedOrder.id, e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Unassigned">Unassigned</option>
                  <option value="Marcus Vance">Marcus Vance (Honda Scooter)</option>
                  <option value="David Chen">David Chen (Electric Bike)</option>
                  <option value="Jordan Smith">Jordan Smith (Toyota Van)</option>
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
