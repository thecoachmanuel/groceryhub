'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  AlertCircle,
  KeyRound,
  X,
  Truck,
  RefreshCw
} from 'lucide-react';
import DeliveryNav from '@/components/delivery/DeliveryNav';
import { formatNaira } from '@/lib/currency';
import { useRiderAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api-fetch';

interface RiderOrder {
  id: string;
  _id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  storeName: string;
  storeAddress: string;
  items: string[];
  totalAmount: number;
  paymentMethod: string;
  riderFee: number;
  status: string;
  deliveryPin: string;
}

export default function DeliveryOrdersPage() {
  const { rider } = useRiderAuth();
  const [orders, setOrders] = useState<RiderOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // PIN Verification Modal State
  const [verifyingOrder, setVerifyingOrder] = useState<RiderOrder | null>(null);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState('');

  const fetchRiderOrders = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Filter orders assigned to rider or recent assigned orders
        const riderId = (rider as any)?.delivery_boy_id || (rider as any)?.id || 1;
        const assigned = json.data.filter(
          (o: any) =>
            o.delivery_boy_id === riderId ||
            (o.delivery_boy_name && o.delivery_boy_name.toLowerCase().includes(rider?.name?.toLowerCase() || 'marcus')) ||
            (o.order_status && o.order_status.toLowerCase() === 'out_for_delivery')
        );

        const formatted: RiderOrder[] = (assigned.length > 0 ? assigned : json.data.slice(0, 5)).map((o: any) => ({
          id: o.order_id || `ORD-${String(o._id).slice(-5).toUpperCase()}`,
          _id: String(o._id),
          customerName: o.customer_name || (o.user_id ? `Customer #${o.user_id}` : 'Customer'),
          customerPhone: o.customer_phone || o.delivery_address?.phone || '+234 800 000 0000',
          address: typeof o.delivery_address === 'string' ? o.delivery_address : [o.delivery_address?.address_line, o.delivery_address?.city].filter(Boolean).join(', ') || 'Lagos, Nigeria',
          city: o.delivery_address?.city || 'Lagos',
          storeName: o.seller_store_name || (o.seller_id ? `Store #${o.seller_id}` : 'GroceryHub Dispatch Hub'),
          storeAddress: 'Victoria Island / Ikeja Zone, Lagos',
          items: Array.isArray(o.items) ? o.items.map((i: any) => i.product_name || i.name || 'Grocery Item') : ['Grocery Package'],
          totalAmount: o.total_amount || o.final_total || 0,
          paymentMethod: (o.payment_method || 'PAYSTACK').toUpperCase().includes('COD') ? 'Cash on Delivery (COD)' : 'Online (Paystack)',
          riderFee: o.delivery_charge || 1500,
          status: (o.order_status || o.active_status || 'out_for_delivery').toLowerCase(),
          deliveryPin: o.delivery_pin || '4892',
        }));
        setOrders(formatted);
      }
    } catch (err) {
      console.warn('Failed to fetch rider orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderOrders();
  }, [rider]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiFetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('Failed to update delivery status');
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingOrder) return;
    setVerifying(true);
    setPinError('');

    try {
      const res = await apiFetch(`/api/orders/${verifyingOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_pin_verify: inputPin }),
      });

      const json = await res.json();
      if (json.success) {
        setVerifySuccess(`Order ${verifyingOrder.id} successfully DELIVERED! Payment confirmed.`);
        setOrders((prev) =>
          prev.map((o) => (o.id === verifyingOrder.id ? { ...o, status: 'delivered' } : o))
        );
        setVerifyingOrder(null);
        setInputPin('');
        setTimeout(() => setVerifySuccess(''), 4000);
      } else {
        setPinError(json.message || 'Invalid delivery PIN. Please ask customer for the correct 4-digit code.');
      }
    } catch (err) {
      setPinError('Connection error verifying delivery PIN.');
    } finally {
      setVerifying(false);
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status.toLowerCase().includes(statusFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <DeliveryNav />

        <main className="max-w-7xl mx-auto p-4 sm:p-10 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                <Truck size={24} className="text-[#0aad0a]" /> Courier Dispatch Pipeline
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Active assigned runs, pickup navigation, and 4-digit PIN customer handover</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchRiderOrders}
                className="bg-[#1e2632] hover:bg-gray-800 p-2.5 rounded-2xl text-gray-400 hover:text-white transition-colors"
                title="Refresh Assigned Runs"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1e2632] border border-gray-800 text-white text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0aad0a]"
              >
                <option value="all">All Assigned Runs</option>
                <option value="out_for_delivery">Active Delivery Runs</option>
                <option value="delivered">Completed Deliveries</option>
              </select>
            </div>
          </div>

          {verifySuccess && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> {verifySuccess}
            </div>
          )}

          {/* Orders Cards Grid */}
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-xs font-bold flex flex-col items-center gap-2">
              <RefreshCw size={24} className="animate-spin text-[#0aad0a]" />
              Loading live assigned courier runs...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-12 text-center space-y-3">
              <Truck size={36} className="mx-auto text-gray-500" />
              <h3 className="text-base font-bold text-white">No delivery runs assigned</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                You are currently on-duty. When nearby store orders are ready for courier pickup, runs will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((order) => (
                <div key={order.id} className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Run Header */}
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Run ID</span>
                        <h3 className="text-sm font-black font-mono text-white">{order.id}</h3>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'delivered' ? 'bg-emerald-950 text-[#0aad0a]' : 'bg-amber-950 text-amber-400 animate-pulse'
                          }`}
                        >
                          ● {order.status === 'delivered' ? 'DELIVERED' : 'OUT FOR DELIVERY'}
                        </span>
                      </div>
                    </div>

                    {/* Store Pickup */}
                    <div className="flex items-start gap-3 bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800/80">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShoppingBag size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Pickup Location</span>
                        <h4 className="text-xs font-bold text-white">{order.storeName}</h4>
                        <p className="text-[11px] text-gray-400">{order.storeAddress}</p>
                      </div>
                    </div>

                    {/* Customer Dropoff */}
                    <div className="flex items-start gap-3 bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800/80">
                      <div className="w-8 h-8 rounded-xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Customer Dropoff</span>
                        <h4 className="text-xs font-bold text-white">{order.customerName}</h4>
                        <p className="text-[11px] text-gray-300 font-medium">{order.address}</p>
                        <a href={`tel:${order.customerPhone}`} className="text-[11px] text-[#0aad0a] font-bold flex items-center gap-1 mt-1 hover:underline">
                          <Phone size={12} /> {order.customerPhone}
                        </a>
                      </div>
                    </div>

                    {/* Package Info & Fee */}
                    <div className="flex items-center justify-between text-xs bg-gray-900/40 p-3 rounded-xl border border-gray-800/60">
                      <div>
                        <span className="text-gray-400 text-[11px]">Payment Mode</span>
                        <p className="font-bold text-white text-xs">{order.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 text-[11px]">Rider Earning</span>
                        <p className="font-mono font-black text-[#0aad0a] text-xs">{formatNaira(order.riderFee)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    {order.status !== 'delivered' ? (
                      <button
                        onClick={() => {
                          setVerifyingOrder(order);
                          setInputPin('');
                          setPinError('');
                        }}
                        className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                      >
                        <KeyRound size={15} /> Verify 4-Digit Customer PIN &amp; Complete Run
                      </button>
                    ) : (
                      <div className="bg-emerald-950/60 text-[#0aad0a] text-xs font-bold py-2.5 rounded-2xl text-center flex items-center justify-center gap-1.5 border border-emerald-800/40">
                        <CheckCircle2 size={16} /> Run Completed &amp; Fee Credited
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* PIN Modal */}
      {verifyingOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <KeyRound size={18} className="text-[#0aad0a]" /> Enter Customer Delivery PIN
              </h3>
              <button onClick={() => setVerifyingOrder(null)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Ask customer <strong className="text-white">{verifyingOrder.customerName}</strong> for the 4-digit security PIN displayed on their order screen.
            </p>

            {pinError && (
              <div className="bg-red-950/60 border border-red-800 text-red-400 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                <AlertCircle size={15} /> {pinError}
              </div>
            )}

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input
                type="text"
                maxLength={4}
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                placeholder="4-Digit PIN e.g. 4892"
                className="w-full bg-gray-900 border border-gray-700 text-white font-mono text-center font-black tracking-widest text-xl rounded-xl p-3 focus:outline-none focus:border-[#0aad0a]"
                required
              />

              <button
                type="submit"
                disabled={verifying}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                {verifying ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={15} />}
                <span>{verifying ? 'Verifying PIN...' : 'Verify & Complete Delivery'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
