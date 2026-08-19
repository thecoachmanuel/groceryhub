'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Truck, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Star, 
  Navigation, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import DeliveryNav from '@/components/delivery/DeliveryNav';
import { formatNaira } from '@/lib/currency';
import { useRiderAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api-fetch';

interface DeliveryOrder {
  _id: string;
  order_id: string;
  customer_name: string;
  delivery_address: string;
  phone: string;
  total_amount: number;
  delivery_charge: number;
  payment_method: string;
  order_status: string;
  createdAt: string;
}

export default function DeliveryDashboardPage() {
  const router = useRouter();
  const { rider, isRiderAuthenticated, isInitialized } = useRiderAuth();

  const [assignedOrders, setAssignedOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const riderId = rider?.id;

  const fetchRiderData = async () => {
    if (!riderId) return;
    try {
      setLoading(true);
      const res = await apiFetch(`/api/orders?delivery_boy_id=${riderId}`);
      const json = await res.json().catch(() => ({}));
      if (json.success && Array.isArray(json.data)) {
        setAssignedOrders(
          json.data.map((o: any) => ({
            _id: o._id,
            order_id: o.order_id || `ORD-${String(o._id).slice(-6)}`,
            customer_name: o.delivery_address?.title || o.user?.name || 'Customer',
            delivery_address: `${o.delivery_address?.address_line || ''}, ${o.delivery_address?.city || 'Lagos'}`,
            phone: o.delivery_address?.phone || o.user?.mobile || '',
            total_amount: o.total_amount || o.final_total || 0,
            delivery_charge: o.delivery_charge || 1500,
            payment_method: (o.payment_method || 'Online').toUpperCase(),
            order_status: o.order_status || 'out_for_delivery',
            createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-NG') : '—',
          }))
        );
      }
    } catch (err) {
      console.warn('Error loading rider dashboard orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized) return;
    const hasRiderToken = typeof window !== 'undefined' && !!localStorage.getItem('groceryhub_rider_token');
    if (!isRiderAuthenticated && !hasRiderToken) {
      router.replace('/delivery/login');
      return;
    }
    fetchRiderData();
  }, [isInitialized, isRiderAuthenticated, riderId, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#121820] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const hasRiderToken = typeof window !== 'undefined' && !!localStorage.getItem('groceryhub_rider_token');
  if (!isRiderAuthenticated && !hasRiderToken) return null;

  // Real Metric Calculations
  const completedRuns = assignedOrders.filter((o) => o.order_status === 'delivered').length;
  const tripEarnings = assignedOrders.reduce((sum, o) => sum + (o.order_status === 'delivered' ? o.delivery_charge : 0), 0);
  const cashInHand = assignedOrders
    .filter((o) => o.payment_method.includes('CASH') && o.order_status === 'delivered')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const activeOrders = assignedOrders.filter((o) => o.order_status !== 'delivered' && o.order_status !== 'cancelled');

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <DeliveryNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Total Completed Runs</span>
              <h3 className="text-2xl font-black text-white">{completedRuns} Completed</h3>
              <p className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
                Real-time Courier Dispatch Ledger
              </p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Trip Earnings</span>
              <h3 className="text-2xl font-black text-[#0aad0a] font-mono">{formatNaira(tripEarnings)}</h3>
              <p className="text-[11px] text-gray-400">Total delivery payouts earned</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Cash in Hand (COD)</span>
              <h3 className="text-2xl font-black text-amber-400 font-mono">{formatNaira(cashInHand)}</h3>
              <Link href="/delivery/earnings" className="text-[11px] text-amber-300 font-bold hover:underline block">
                Deposit to Store Counter &rarr;
              </Link>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Courier Rating</span>
              <h3 className="text-2xl font-black text-white flex items-center gap-1.5">
                5.00 <Star size={18} className="text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-[11px] text-gray-400">Active Delivery Partner</p>
            </div>
          </div>

          {/* Active Deliveries List */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Truck size={20} className="text-amber-400" /> Assigned Delivery Runs
                </h3>
                <p className="text-xs text-gray-400">Active order dispatches assigned to {rider?.name || 'Courier'}</p>
              </div>
              <button
                onClick={fetchRiderData}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
                title="Refresh delivery assignments"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-xs text-gray-400">Loading delivery assignments...</div>
            ) : activeOrders.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-[#0aad0a]" />
                <h4 className="text-sm font-bold text-white">No active delivery runs assigned right now</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  You are online and ready for dispatch. As soon as orders are assigned by store admin, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map((o) => (
                  <div key={o._id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-amber-400">{o.order_id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
                        {o.order_status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-300">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <MapPin size={14} className="text-amber-400" /> {o.customer_name}
                      </p>
                      <p className="text-gray-400 pl-5">{o.delivery_address}</p>
                      {o.phone && <p className="text-gray-400 pl-5">📞 {o.phone}</p>}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
                      <div>
                        <span className="text-[11px] text-gray-400 block">Collect Amount</span>
                        <span className="font-black text-white font-mono">{formatNaira(o.total_amount)} ({o.payment_method})</span>
                      </div>
                      <Link
                        href={`/delivery/orders?id=${o._id}`}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-colors"
                      >
                        Manage Delivery &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
