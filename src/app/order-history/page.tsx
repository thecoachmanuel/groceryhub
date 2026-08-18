'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  X,
  Phone,
  User,
  ShieldCheck
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { formatNaira } from '@/lib/currency';

const SAMPLE_ORDERS = [
  {
    id: 'ORD-98241',
    date: 'Aug 17, 2026 at 08:30 PM',
    status: 'Out for Delivery',
    statusStep: 3, // 1: Placed, 2: Packed, 3: Out for Delivery, 4: Delivered
    total: 19500.00, // ₦19,500
    itemsCount: 4,
    deliverySlot: '08:00 PM - 10:00 PM',
    deliveryAddress: 'Plot 14, Adeola Odeku Street, Victoria Island, Lagos',
    driver: {
      name: 'Marcus Vance',
      phone: '+234 809 111 2233',
      vehicle: 'Honda Super Cub 125cc (LAG-8492)',
    },
    items: [
      { name: 'Fresh Organic Farm Broccoli (500g)', qty: 2, price: 3500 },
      { name: 'Red Sweet Crisp Apples (1kg Pack)', qty: 1, price: 4500 },
      { name: 'Farm Fresh Pure Whole Milk (1L)', qty: 2, price: 3800 },
    ],
  },
  {
    id: 'ORD-87123',
    date: 'Aug 14, 2026 at 02:15 PM',
    status: 'Delivered',
    statusStep: 4,
    total: 14500.00, // ₦14,500
    itemsCount: 2,
    deliverySlot: '02:00 PM - 04:00 PM',
    deliveryAddress: 'Plot 14, Adeola Odeku Street, Victoria Island, Lagos',
    driver: {
      name: 'David Chen',
      phone: '+234 802 345 6789',
      vehicle: 'Electric Bike (EB-102)',
    },
    items: [
      { name: 'Artisan Sourdough Country Loaf (750g)', qty: 2, price: 3200 },
      { name: 'Pure Cold Pressed Extra Virgin Olive Oil (500ml)', qty: 1, price: 8100 },
    ],
  },
];

export default function OrderHistoryPage() {
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<any | null>(null);

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
          {SAMPLE_ORDERS.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 transition-all hover:shadow-md"
            >
              {/* Order Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-gray-900 dark:text-white">{order.id}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-[#0aad0a]' 
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-500 animate-pulse'
                    }`}>
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
          ))}
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
            </div>

            {/* Stepper */}
            <div className="space-y-3">
              {[
                { title: 'Order Placed & Paid (Paystack)', desc: 'Confirmed and sent to merchant', step: 1 },
                { title: 'Picked & Chilled Packaging', desc: 'Fresh farm items packed in cooler box', step: 2 },
                { title: 'Out for Doorstep Delivery', desc: 'Courier is en route to Victoria Island', step: 3 },
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
