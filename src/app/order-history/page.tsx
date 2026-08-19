'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ChevronRight, 
  X,
  Phone,
  Loader2
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { formatNaira } from '@/lib/currency';
import { useAuth } from '@/context/AuthContext';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface OrderDriver {
  name: string;
  phone: string;
  vehicle: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  statusStep: number;
  total: number;
  itemsCount: number;
  deliverySlot: string;
  deliveryAddress: string;
  driver: OrderDriver;
  items: OrderItem[];
  deliveryPin?: string;
}

const statusToStep: Record<string, number> = {
  pending: 1,
  confirmed: 1,
  processing: 2,
  packed: 2,
  shipped: 3,
  out_for_delivery: 3,
  'Out for Delivery': 3,
  delivered: 4,
  Delivered: 4,
};

const DEFAULT_DRIVER = {
  name: 'GroceryHub Rider',
  phone: '+234 800 000 0000',
  vehicle: 'Delivery Bike',
};

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const allOrders: Order[] = [];

      // 1. Load from localStorage (orders placed in this session)
      if (typeof window !== 'undefined' && user?.id) {
        const localKey = `groceryhub_orders_${user.id}`;
        const raw = localStorage.getItem(localKey);
        if (raw) {
          try {
            const localOrders: Order[] = JSON.parse(raw);
            allOrders.push(...localOrders);
          } catch {}
        }
      }

      // 2. Load from MongoDB API
      if (user?.id) {
        try {
          const res = await fetch(`/api/orders?user_id=${user.id}`, {
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const apiOrders: Order[] = data.data.map((o: any) => ({
              id: o.order_id || o._id,
              date: o.createdAt
                ? new Date(o.createdAt).toLocaleString('en-NG', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recently',
              status: o.order_status || o.status || 'Processing',
              statusStep: statusToStep[o.order_status || o.status || 'confirmed'] || 2,
              total: o.total_amount || o.final_total || 0,
              itemsCount: (o.items || []).reduce((acc: number, i: any) => acc + (i.quantity || i.qty || 1), 0),
              deliverySlot: o.delivery_timeslot || o.deliverySlot || 'Express Delivery',
              deliveryAddress: o.delivery_address
                ? typeof o.delivery_address === 'string'
                  ? o.delivery_address
                  : `${o.delivery_address.flat || ''}, ${o.delivery_address.area || ''}, ${o.delivery_address.city || ''}`.trim().replace(/^,\s*/, '')
                : o.deliveryAddress || 'Lagos, Nigeria',
              driver: o.driver || DEFAULT_DRIVER,
              deliveryPin: o.delivery_pin || '4892',
              items: (o.items || []).map((i: any) => ({
                name: i.product_name || i.name || 'Product',
                qty: i.quantity || i.qty || 1,
                price: i.price || 0,
              })),
            }));

            // Merge API orders, deduplicating by order ID
            const localIds = new Set(allOrders.map((o) => o.id));
            for (const apiOrder of apiOrders) {
              if (!localIds.has(apiOrder.id)) {
                allOrders.push(apiOrder);
              }
            }
          }
        } catch (err) {
          console.warn('Could not fetch orders from API:', err);
        }
      }

      // Sort by most recent first (prefer local orders at top since they're newest)
      setOrders(allOrders);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered') return 'bg-emerald-100 dark:bg-emerald-950/60 text-[#0aad0a]';
    if (s === 'cancelled' || s === 'failed') return 'bg-red-100 dark:bg-red-950/60 text-red-500';
    return 'bg-amber-100 dark:bg-amber-950/60 text-amber-500 animate-pulse';
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              My Orders &amp; Live Tracking
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              View your grocery order history, Paystack receipts, and live courier tracking
            </p>
          </div>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 bg-[#0aad0a] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-[#0aad0a]/20 hover:bg-[#088f08] transition-all"
          >
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
              <Loader2 size={32} className="mx-auto text-[#0aad0a] animate-spin mb-3" />
              <p className="text-xs text-gray-400">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center mx-auto">
                <ShoppingBag size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">No orders placed yet</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {user
                    ? "You haven't placed any grocery orders yet. Start exploring fresh vegetables, organic fruits, and pantry staples!"
                    : 'Please log in to view your order history.'}
                </p>
              </div>
              {user ? (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3 rounded-2xl text-xs shadow-md shadow-[#0aad0a]/20 transition-all"
                >
                  <ShoppingBag size={16} />
                  <span>Explore Store Catalog</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3 rounded-2xl text-xs shadow-md shadow-[#0aad0a]/20 transition-all"
                >
                  <span>Login to View Orders</span>
                </Link>
              )}
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 transition-all hover:shadow-md"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-900 dark:text-white">{order.id}</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                        ● {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Total Amount (Naira)</span>
                      <span className="text-base font-black text-gray-900 dark:text-white font-mono">
                        {formatNaira(order.total)}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrderForTracking(order)}
                      className="bg-[#0aad0a]/10 hover:bg-[#0aad0a] text-[#0aad0a] hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1"
                    >
                      <span>Track Order</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Order Items Summary in Naira */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Items in Order ({order.itemsCount})</span>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-700 dark:text-gray-300">
                          <span>{item.name} x{item.qty}</span>
                          <span className="font-mono font-bold text-gray-900 dark:text-white">{formatNaira(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-3 md:pt-0 md:pl-4">
                    <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Delivery Information</span>
                    <div className="space-y-1 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#0aad0a]" />
                        <span>{order.deliverySlot}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <MapPin size={14} className="text-[#0aad0a] shrink-0 mt-0.5" />
                        <span className="truncate">{order.deliveryAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Live Courier Tracking Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-xs font-bold text-[#0aad0a] uppercase tracking-wider">Live Telemetry</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                Tracking {selectedOrderForTracking.id}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Total: <span className="font-mono font-bold text-[#0aad0a]">{formatNaira(selectedOrderForTracking.total)}</span>
              </p>
            </div>

            {/* Stepper */}
            <div className="space-y-3">
              {[
                { title: 'Order Placed & Paid', desc: 'Confirmed and sent to merchant', step: 1 },
                { title: 'Picked & Chilled Packaging', desc: 'Fresh farm items packed in cooler box', step: 2 },
                { title: 'Out for Doorstep Delivery', desc: 'Courier is en route to your address', step: 3 },
                { title: 'Delivered', desc: 'Handed over at doorstep', step: 4 },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    selectedOrderForTracking.statusStep >= s.step
                      ? 'bg-[#0aad0a] text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                  }`}>
                    {selectedOrderForTracking.statusStep >= s.step ? '✓' : s.step}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-gray-900 dark:text-white">{s.title}</h5>
                    <p className="text-[11px] text-gray-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* 4-Digit Delivery Verification PIN Callout */}
            {selectedOrderForTracking.deliveryPin && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#0aad0a] tracking-wider block">Handover Verification PIN</span>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300">Give this 4-digit PIN code to rider at doorstep</p>
                </div>
                <div className="bg-[#0aad0a] text-white font-mono font-black text-lg px-3 py-1 rounded-xl shadow-md tracking-widest">
                  {selectedOrderForTracking.deliveryPin}
                </div>
              </div>
            )}

            {/* Driver Profile */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-gray-950 flex items-center justify-center font-bold">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{selectedOrderForTracking.driver.name}</h4>
                  <p className="text-[11px] text-gray-400">{selectedOrderForTracking.driver.vehicle}</p>
                </div>
              </div>
              <a
                href={`tel:${selectedOrderForTracking.driver.phone}`}
                className="bg-[#0aad0a] text-white p-2.5 rounded-xl shadow-md flex items-center gap-1 text-xs font-bold"
              >
                <Phone size={14} />
                <span className="hidden sm:inline">Call Courier</span>
              </a>
            </div>

            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-xl text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Close Live Tracker
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
