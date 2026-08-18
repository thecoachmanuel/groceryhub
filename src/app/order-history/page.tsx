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

const SAMPLE_ORDERS = [
  {
    id: 'ORD-98241',
    date: 'Aug 17, 2026 at 08:30 PM',
    status: 'Out for Delivery',
    statusStep: 3, // 1: Placed, 2: Packed, 3: Out for Delivery, 4: Delivered
    total: 45.00,
    itemsCount: 4,
    deliverySlot: '08:00 PM - 10:00 PM',
    deliveryAddress: 'Apt 4B, 742 Evergreen Terrace, Brooklyn, NY 11201',
    driver: {
      name: 'Marcus Vance',
      phone: '+1 (555) 789-0123',
      vehicle: 'White Honda Scooter (NY-8429)',
    },
    items: [
      { name: 'Fresh Organic Farm Broccoli (500g)', qty: 2, price: 3.49 },
      { name: 'Red Sweet Crisp Apples (1kg)', qty: 1, price: 4.29 },
      { name: 'Farm Fresh Pure Whole Milk (1 Gallon)', qty: 2, price: 3.89 },
    ],
  },
  {
    id: 'ORD-87123',
    date: 'Aug 14, 2026 at 02:15 PM',
    status: 'Delivered',
    statusStep: 4,
    total: 32.40,
    itemsCount: 2,
    deliverySlot: '02:00 PM - 04:00 PM',
    deliveryAddress: 'Apt 4B, 742 Evergreen Terrace, Brooklyn, NY 11201',
    driver: {
      name: 'David Chen',
      phone: '+1 (555) 345-6789',
      vehicle: 'Electric Bike (EB-102)',
    },
    items: [
      { name: 'Artisan Sourdough Bakery Bread (400g)', qty: 2, price: 2.99 },
      { name: 'Pure Cold Pressed Extra Virgin Olive Oil', qty: 1, price: 11.49 },
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
              My Orders & Live Tracking
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              View your order history, live delivery status, and invoices
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
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#0aad0a]'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                    }`}>
                      ● {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedOrderForTracking(order)}
                    className="flex items-center gap-1.5 bg-[#0aad0a]/10 hover:bg-[#0aad0a] text-[#0aad0a] hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <Truck size={15} />
                    <span>Track Live</span>
                  </button>

                  <button
                    onClick={() => alert(`Downloading Invoice for ${order.id}...`)}
                    className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                  >
                    <FileText size={15} />
                    <span className="hidden sm:inline">Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="space-y-2 py-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{item.qty}x {item.name}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <MapPin size={14} className="text-[#0aad0a]" />
                  <span className="truncate max-w-xs">{order.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-black text-gray-900 dark:text-white">
                  <span>Total Paid:</span>
                  <span className="text-[#0aad0a]">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Live Tracking Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative animate-fade-in">
            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] text-xs font-bold px-3 py-1 rounded-full">
                <Truck size={14} /> Live Telemetry
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                Tracking {selectedOrderForTracking.id}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Estimated Delivery: <strong className="text-gray-900 dark:text-white">In 18 Minutes</strong>
              </p>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-4 py-2">
              {[
                { title: 'Order Placed & Confirmed', desc: 'Received by Store', done: true },
                { title: 'Packed & Dispatched', desc: 'Quality checked by vendor', done: true },
                { title: 'Out for Delivery', desc: 'Driver is on the way', done: selectedOrderForTracking.statusStep >= 3, active: selectedOrderForTracking.statusStep === 3 },
                { title: 'Delivered', desc: 'Handed over at doorstep', done: selectedOrderForTracking.statusStep >= 4 },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black z-10 ${
                    step.done
                      ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/30'
                      : step.active
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>
                    {step.done ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${step.done || step.active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Boy Contact Card */}
            {selectedOrderForTracking.driver && (
              <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center font-bold">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      {selectedOrderForTracking.driver.name}
                    </h4>
                    <p className="text-[11px] text-gray-400">{selectedOrderForTracking.driver.vehicle}</p>
                  </div>
                </div>

                <a
                  href={`tel:${selectedOrderForTracking.driver.phone}`}
                  className="flex items-center gap-1 bg-[#0aad0a] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-[#0aad0a]/20 hover:bg-[#088f08]"
                >
                  <Phone size={14} />
                  <span>Call</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
