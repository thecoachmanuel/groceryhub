'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Package,
  AlertCircle,
  RefreshCw,
  User
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

// Status step definitions
const STATUS_STEPS = [
  { key: 'placed',           label: 'Order Placed',      icon: CheckCircle2 },
  { key: 'confirmed',        label: 'Order Confirmed',   icon: CheckCircle2 },
  { key: 'preparing',        label: 'Packing at Store',  icon: Package      },
  { key: 'out_for_delivery', label: 'Out for Delivery',  icon: Truck        },
  { key: 'delivered',        label: 'Delivered',         icon: MapPin       },
];

// Map status to active step index (0-4)
const STATUS_TO_STEP: Record<string, number> = {
  placed:           0,
  pending:          0,
  confirmed:        1,
  preparing:        2,
  packed:           2,
  ready_for_pickup: 3,
  out_for_delivery: 3,
  delivered:        4,
  cancelled:        0,
};

// ETA by status
const STATUS_ETA: Record<string, string | null> = {
  placed:           '~45 Minutes',
  confirmed:        '~35 Minutes',
  preparing:        '~25 Minutes',
  ready_for_pickup: '~15 Minutes',
  out_for_delivery: '~12 Minutes',
  delivered:        null,
  cancelled:        null,
};

export default function TrackOrderPage({ params }: { params: { orderId?: string } }) {
  const orderId = params?.orderId || '';

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    if (!orderId) { setLoading(false); return; }
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setOrder(json.data);
        setError('');
      } else {
        setError('Order not found. Please check your order ID.');
      }
    } catch {
      setError('Unable to load order. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Initial fetch
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Auto-poll every 10 seconds so admin status & rider updates reflect instantly
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrder();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const status = (order?.order_status || 'placed').toLowerCase();
  const activeStep = STATUS_TO_STEP[status] ?? 0;
  const isCancelled = status === 'cancelled';
  const isDelivered = status === 'delivered';
  const eta = STATUS_ETA[status];

  const riderName = order?.delivery_boy_name || null;
  const riderPhone = order?.delivery_boy_phone || null;
  const hasRider = !!riderName && riderName !== 'Unassigned Rider' && riderName !== 'Unassigned Courier';

  const deliveryPin = order?.delivery_pin || '—';

  const deliveryAddress = order?.delivery_address
    ? typeof order.delivery_address === 'string'
      ? order.delivery_address
      : [
          order.delivery_address.address_line || order.delivery_address.address || '',
          order.delivery_address.city || '',
        ].filter(Boolean).join(', ')
    : '—';

  const customerName = order?.customer_name || 'Valued Customer';
  const sellerStore = order?.seller_store_name || (order?.seller_id ? `Store #${order.seller_id}` : 'GroceryHub Partner Store');

  // Format placed time
  const placedAt = order?.createdAt
    ? new Date(order.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121820] text-gray-900 dark:text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/order-history"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0aad0a] transition-colors"
          >
            <ArrowLeft size={14} /> Back to My Orders
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gray-400">
              Tracking: {orderId || 'Unknown'}
            </span>
            <button
              onClick={fetchOrder}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
              title="Refresh tracking"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0aad0a] mx-auto" />
            <p className="text-xs text-gray-400">Loading live order tracking...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-950/30 border border-red-800/30 rounded-3xl p-8 text-center space-y-3">
            <AlertCircle size={36} className="mx-auto text-red-400" />
            <h3 className="font-bold text-red-400">{error}</h3>
            <p className="text-xs text-gray-400">Order ID: <span className="font-mono">{orderId}</span></p>
            <button
              onClick={fetchOrder}
              className="mt-2 inline-flex items-center gap-1.5 bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {/* Order Found */}
        {!loading && !error && order && (
          <>
            {/* Hero Banner */}
            {isCancelled ? (
              <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black mb-3">
                  <AlertCircle size={14} /> Order Cancelled
                </div>
                <h1 className="text-2xl font-black">This Order Was Cancelled</h1>
                <p className="text-xs text-red-100 mt-1">Order ID: <span className="font-mono font-bold">{orderId}</span></p>
              </div>
            ) : isDelivered ? (
              <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
                    <CheckCircle2 size={14} /> Order Delivered Successfully
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black">Delivered! Enjoy your groceries 🎉</h1>
                  <p className="text-xs text-emerald-100">From <strong>{sellerStore}</strong> — delivered to {customerName}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center flex-shrink-0 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider block">
                    Placed At
                  </span>
                  <span className="font-mono text-2xl font-black tracking-widest text-white block">
                    {placedAt}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
                    <Clock size={14} className="animate-spin" />
                    {eta ? `Arriving in ${eta}` : 'Processing your order...'}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black">
                    {status === 'out_for_delivery' ? 'Express Delivery in Progress' : 'Order Processing'}
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-lg leading-relaxed">
                    Your groceries from <strong>{sellerStore}</strong> are being prepared for {customerName}.
                  </p>
                </div>

                {/* 4-Digit Handover PIN — shown only when out for delivery */}
                {status === 'out_for_delivery' && deliveryPin !== '—' && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center flex-shrink-0 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider block">
                      Delivery Handover PIN
                    </span>
                    <span className="font-mono text-3xl font-black tracking-widest text-amber-300 block">
                      {deliveryPin}
                    </span>
                    <span className="text-[10px] text-emerald-200 block">Share with courier at door</span>
                  </div>
                )}
              </div>
            )}

            {/* Status Stepper */}
            <div className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <div className="grid grid-cols-4 text-center relative">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx === activeStep && !isCancelled;
                  const isDone = idx < activeStep && !isCancelled;
                  const isPending = idx > activeStep || isCancelled;

                  return (
                    <div key={step.key} className={`space-y-2 ${isPending ? 'opacity-40' : ''}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-md transition-all ${
                          isDone
                            ? 'bg-[#0aad0a] text-white'
                            : isActive
                            ? 'bg-[#0aad0a] text-white shadow-lg shadow-[#0aad0a]/40 animate-pulse'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className={`text-xs font-bold block ${isActive ? 'text-[#0aad0a]' : 'text-gray-900 dark:text-white'}`}>
                        {step.label}
                      </span>
                      <span className={`text-[10px] block ${isActive ? 'text-[#0aad0a] font-bold' : 'text-gray-400'}`}>
                        {idx === 0 ? placedAt : isActive ? 'In Progress' : isDone ? '✓ Done' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rider & Address Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Assigned Rider */}
              <div className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 space-y-5 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  Assigned Delivery Partner
                </h3>

                {hasRider ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md">
                          {riderName!.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{riderName}</h4>
                          <span className="text-xs text-[#0aad0a] font-semibold">On duty • Delivery Rider</span>
                        </div>
                      </div>

                      {riderPhone && (
                        <a
                          href={`tel:${riderPhone}`}
                          className="p-3 bg-[#0aad0a] hover:bg-[#088f08] text-white rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
                        >
                          <Phone size={16} />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <User size={22} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-600 dark:text-gray-300">Awaiting Rider Assignment</p>
                      <p className="text-[11px]">A delivery partner will be assigned shortly</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Address */}
              <div className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  Drop-off Destination
                </h3>

                <div className="flex items-start gap-3 text-xs">
                  <MapPin size={18} className="text-[#0aad0a] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">{customerName}</span>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                      {deliveryAddress}
                    </p>
                    {order?.delivery_address?.phone && (
                      <span className="text-[11px] text-gray-400 mt-1 block font-mono">
                        {order.delivery_address.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Live transit banner */}
                <div className="h-20 rounded-2xl bg-emerald-950/20 dark:bg-emerald-950/30 border border-emerald-900/30 flex items-center justify-center text-center p-4 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0aad0a]">
                    {isDelivered ? (
                      <><CheckCircle2 size={18} /><span>Order successfully delivered</span></>
                    ) : isCancelled ? (
                      <><AlertCircle size={18} className="text-red-400" /><span className="text-red-400">Order was cancelled</span></>
                    ) : status === 'out_for_delivery' ? (
                      <><Truck size={20} className="animate-bounce" /><span>Courier is on the way to your location</span></>
                    ) : (
                      <><Package size={18} className="animate-pulse" /><span>Store is preparing your order</span></>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Order Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                  <span className="text-gray-400 block">Order ID</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{orderId}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                  <span className="text-gray-400 block">Store Partner</span>
                  <span className="font-bold text-gray-900 dark:text-white">{sellerStore}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                  <span className="text-gray-400 block">Payment</span>
                  <span className="font-bold text-gray-900 dark:text-white uppercase">{order?.payment_method || '—'}</span>
                </div>
              </div>

              {/* Items */}
              {Array.isArray(order?.items) && order.items.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-gray-800">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                      <span>{item.quantity || item.qty}× {item.product_name || item.name}</span>
                      <span className="font-mono font-bold">₦{((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs font-black text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span>Total Paid</span>
                    <span className="text-[#0aad0a] font-mono">₦{(order?.total_amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
