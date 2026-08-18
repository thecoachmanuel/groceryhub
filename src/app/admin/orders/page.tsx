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

const ALL_ORDERS = [
  {
    id: 'ORD-98241',
    user: 'Alex Johnson',
    phone: '+1 (555) 234-5678',
    address: 'Apt 4B, 742 Evergreen Terrace, Brooklyn, NY',
    vendor: 'Green Valley Organic',
    amount: 45.00,
    paymentMethod: 'COD',
    status: 'Out for Delivery',
    driver: 'Marcus Vance',
    time: 'Aug 17, 08:30 PM',
    items: [
      { name: 'Organic Farm Broccoli (500g)', qty: 2, price: 3.49 },
      { name: 'Red Sweet Crisp Apples (1kg)', qty: 1, price: 4.29 },
      { name: 'Farm Fresh Pure Whole Milk (1 Gal)', qty: 2, price: 3.89 },
    ],
  },
  {
    id: 'ORD-98240',
    user: 'Sarah Miller',
    phone: '+1 (555) 345-6789',
    address: '124 Main Street, Queens, NY',
    vendor: 'The Artisanal Bakery',
    amount: 28.50,
    paymentMethod: 'STRIPE',
    status: 'Packed',
    driver: 'Unassigned',
    time: 'Aug 17, 07:15 PM',
    items: [
      { name: 'Artisan Sourdough Bakery Bread', qty: 2, price: 2.99 },
      { name: 'Pure Cold Pressed Extra Virgin Olive Oil', qty: 1, price: 11.49 },
    ],
  },
  {
    id: 'ORD-98239',
    user: 'James Wilson',
    phone: '+1 (555) 456-7890',
    address: '55 5th Ave, Manhattan, NY',
    vendor: 'Daily Dairy Fresh',
    amount: 19.20,
    paymentMethod: 'RAZORPAY',
    status: 'Delivered',
    driver: 'David Chen',
    time: 'Aug 17, 05:45 PM',
    items: [
      { name: 'Farm Fresh Pure Whole Milk', qty: 4, price: 3.89 },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleAssignDriver = (orderId: string, driverName: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, driver: driverName, status: 'Out for Delivery' } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, driver: driverName, status: 'Out for Delivery' });
    }
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <ShoppingBag size={24} className="text-[#0aad0a]" /> Order Lifecycle Console
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Filter, dispatch drivers, and manage multi-vendor orders</p>
          </div>
        </div>

        {/* Orders Filter */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Order ID, customer, or phone..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-3">
            <select className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]">
              <option value="">All Statuses</option>
              <option value="placed">Placed</option>
              <option value="packed">Packed</option>
              <option value="out_for_delivery">Out for Delivery</option>
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
                  <th className="pb-3 px-3">Store</th>
                  <th className="pb-3 px-3">Total</th>
                  <th className="pb-3 px-3">Driver</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{o.id}</td>
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-white">{o.user}</span>
                        <p className="text-[10px] text-gray-400">{o.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">{o.vendor}</td>
                    <td className="py-3 px-3 font-bold text-white">${o.amount.toFixed(2)}</td>
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
                  <span className="font-bold">${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-white text-sm pt-2">
                <span>Total Amount</span>
                <span className="text-[#0aad0a]">${selectedOrder.amount.toFixed(2)}</span>
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
