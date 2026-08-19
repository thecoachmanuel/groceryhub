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
  Truck
} from 'lucide-react';
import DeliveryNav from '@/components/delivery/DeliveryNav';
import { formatNaira } from '@/lib/currency';
import { useRiderAuth } from '@/context/AuthContext';

interface RiderOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  storeName: string;
  storeAddress: string;
  items: string[];
  totalAmount: number;
  paymentMethod: 'Online (Paystack)' | 'Cash on Delivery (COD)';
  riderFee: number;
  status: 'Assigned' | 'Picked Up' | 'Delivered';
  otp: string;
}

const INITIAL_RIDER_ORDERS: RiderOrder[] = [
  {
    id: 'ORD-98241',
    customerName: 'Alex Johnson',
    customerPhone: '+234 802 345 6789',
    address: 'Plot 14, Adeola Odeku St, Flat 4B, Victoria Island',
    city: 'Lagos',
    storeName: 'Green Valley Organic Farms',
    storeAddress: 'Agro Industrial Estate, Epe, Lagos',
    items: ['Organic Farm Broccoli (500g)', 'Red Crisp Apples (1kg)', 'Farm Pure Milk (1L)', 'Hass Avocados (4pk)'],
    totalAmount: 45000.00,
    paymentMethod: 'Online (Paystack)',
    riderFee: 1500.00,
    status: 'Picked Up',
    otp: '4892',
  },
  {
    id: 'ORD-98240',
    customerName: 'Michael Scott',
    customerPhone: '+234 803 987 6543',
    address: 'Suite 200, 12 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    storeName: 'Daily Dairy & Poultry Fresh',
    storeAddress: 'Ikeja GRA Wholesale Hub, Lagos',
    items: ['Farm Pure Whole Milk (1L)', 'Artisan Sourdough Bread (750g)'],
    totalAmount: 28500.00,
    paymentMethod: 'Cash on Delivery (COD)',
    riderFee: 1200.00,
    status: 'Assigned',
    otp: '1824',
  },
  {
    id: 'ORD-98235',
    customerName: 'Chinedu Okafor',
    customerPhone: '+234 809 111 2233',
    address: 'Flat 12, Oceanview Towers, Victoria Island',
    city: 'Lagos',
    storeName: 'The Artisanal Bakery Co.',
    storeAddress: 'Victoria Island Central',
    items: ['Handcrafted Almond Croissants (4pk)', 'Pure Virgin Olive Oil (500ml)'],
    totalAmount: 62100.00,
    paymentMethod: 'Online (Paystack)',
    riderFee: 2000.00,
    status: 'Delivered',
    otp: '9021',
  },
];

export default function DeliveryOrdersPage() {
  const { rider } = useRiderAuth();
  const [orders, setOrders] = useState<RiderOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'Assigned' | 'Picked Up' | 'Delivered'>('all');
  const [activeOtpModal, setActiveOtpModal] = useState<RiderOrder | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: RiderOrder[] = json.data.map((o: any) => {
          let st: RiderOrder['status'] = 'Assigned';
          if (o.order_status === 'out_for_delivery') st = 'Picked Up';
          if (o.order_status === 'delivered') st = 'Delivered';

          return {
            id: o.order_id || o._id,
            customerName: o.customer_name || o.delivery_address?.title || 'Valued Customer',
            customerPhone: o.customer_phone || o.delivery_address?.phone || '+234 800 000 0000',
            address: typeof o.delivery_address === 'string' ? o.delivery_address : `${o.delivery_address?.address_line || o.delivery_address?.flat || ''}, ${o.delivery_address?.area || ''}`.trim().replace(/^,\s*/, '') || 'Doorstep Location',
            city: o.delivery_address?.city || 'Lagos',
            storeName: o.seller_name || 'GroceryHub Central Warehouse',
            storeAddress: 'Victoria Island Agro Hub, Lagos',
            items: (o.items || []).map((i: any) => `${i.product_name || i.name || 'Item'} x${i.quantity || i.qty || 1}`),
            totalAmount: o.total_amount || o.final_total || 0,
            paymentMethod: o.payment_method === 'cod' ? 'Cash on Delivery (COD)' : 'Online (Paystack)',
            riderFee: o.delivery_charge || 1500.00,
            status: st,
            otp: o.delivery_pin || '4892',
          };
        });
        setOrders(mapped);
      }
    } catch (err) {
      console.warn('Failed to load rider orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: RiderOrder['status']) => {
    try {
      const targetApiStatus = newStatus === 'Picked Up' ? 'out_for_delivery' : newStatus === 'Delivered' ? 'delivered' : 'ready_for_pickup';
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_status: targetApiStatus,
          delivery_boy_id: rider?.id || 1,
          delivery_boy_name: rider?.name || 'Rider',
        }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
      setSuccessToast(`Order ${id} updated to ${newStatus}`);
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert('Error updating order status');
    }
  };

  const handleOpenDeliverModal = (order: RiderOrder) => {
    setActiveOtpModal(order);
    setEnteredOtp('');
    setOtpError('');
  };

  const handleVerifyOtpAndDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOtpModal) return;

    setIsVerifying(true);
    setOtpError('');
    try {
      const res = await fetch(`/api/orders/${activeOtpModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_pin_verify: enteredOtp }),
      });
      const json = await res.json();

      if (json.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === activeOtpModal.id ? { ...o, status: 'Delivered' } : o))
        );
        setSuccessToast(`Delivery PIN verified! Order ${activeOtpModal.id} DELIVERED.`);
        setActiveOtpModal(null);
        setTimeout(() => setSuccessToast(''), 3500);
      } else {
        setOtpError(json.message || 'Invalid Delivery PIN code. Please check customer phone screen.');
      }
    } catch (err) {
      setOtpError('Error connecting to server to verify PIN.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <DeliveryNav />

        <main className="max-w-5xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Truck size={24} className="text-amber-400" /> Active Courier Runs &amp; Trips
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Navigate pickups from merchant stores and complete doorstep drop-offs with OTP confirmation in Nigeria
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#1e2632] border border-gray-800 px-4 py-2 rounded-2xl text-xs font-bold">
              <span className="text-gray-400">Assigned Tasks:</span>
              <span className="text-amber-400 font-mono text-sm">{orders.filter(o => o.status !== 'Delivered').length} Active</span>
            </div>
          </div>

          {successToast && (
            <div className="bg-emerald-950/60 border border-[#0aad0a] text-[#0aad0a] p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> {successToast}
            </div>
          )}

          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-12 text-center space-y-3">
                <Truck size={36} className="mx-auto text-amber-400" />
                <h3 className="text-base font-bold text-white">No delivery tasks assigned yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Your route manifest is clear. Stay online to receive automated dispatch requests from nearby grocery merchants.
                </p>
              </div>
            ) : (
              orders.map((order) => (
              <div
                key={order.id}
                className={`bg-[#1e2632] border rounded-3xl p-6 sm:p-8 space-y-6 transition-all ${
                  order.status === 'Delivered'
                    ? 'border-gray-800 opacity-60'
                    : 'border-[#0aad0a]/40 shadow-xl'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-white">{order.id}</span>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-950 text-[#0aad0a]'
                          : order.status === 'Picked Up'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-blue-950 text-blue-400'
                      }`}>
                        ● {order.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 block pt-0.5 font-semibold">
                      Payment: <strong className={order.paymentMethod.includes('COD') ? 'text-amber-400' : 'text-[#0aad0a]'}>{order.paymentMethod} ({formatNaira(order.totalAmount)})</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block font-semibold">Your Courier Fee</span>
                    <span className="text-lg font-black text-[#0aad0a] font-mono">+{formatNaira(order.riderFee)}</span>
                  </div>
                </div>

                {/* Pickup and Dropoff Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Step 1: Store Pickup */}
                  <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-2">
                    <span className="text-[#0aad0a] font-black uppercase text-[10px] tracking-wider block">
                      1. Store Pickup Location
                    </span>
                    <h4 className="font-bold text-white text-sm">{order.storeName}</h4>
                    <p className="text-gray-400 flex items-start gap-1">
                      <MapPin size={14} className="shrink-0 mt-0.5 text-gray-500" />
                      <span>{order.storeAddress}</span>
                    </p>

                    <div className="pt-2 border-t border-gray-800">
                      <span className="text-[11px] text-gray-400 block font-bold">Package Contents ({order.items.length} items):</span>
                      <ul className="list-disc list-inside text-gray-300 space-y-0.5 mt-1">
                        {order.items.map((it, idx) => (
                          <li key={idx} className="truncate">{it}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Step 2: Customer Delivery */}
                  <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-amber-400 font-black uppercase text-[10px] tracking-wider block">
                        2. Customer Drop-off Destination
                      </span>
                      <h4 className="font-bold text-white text-sm">{order.customerName}</h4>
                      <p className="text-gray-400 flex items-start gap-1">
                        <MapPin size={14} className="shrink-0 mt-0.5 text-gray-500" />
                        <span>{order.address} ({order.city})</span>
                      </p>

                      {order.paymentMethod.includes('COD') && order.status !== 'Delivered' && (
                        <div className="bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl text-[11px] text-amber-300 font-bold">
                          ⚠️ Collect {formatNaira(order.totalAmount)} Cash upon delivery
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold p-2.5 rounded-xl text-center flex items-center justify-center gap-1 transition-colors"
                      >
                        <Phone size={14} />
                        <span>Call Customer</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Progress Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">Customer PIN Verification Required</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.status === 'Assigned' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Picked Up')}
                        className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                      >
                        <CheckCircle2 size={16} />
                        <span>Confirm Store Pickup</span>
                      </button>
                    )}

                    {order.status === 'Picked Up' && (
                      <button
                        onClick={() => handleOpenDeliverModal(order)}
                        className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                      >
                        <KeyRound size={16} />
                        <span>Enter Delivery OTP &amp; Complete Run</span>
                      </button>
                    )}

                    {order.status === 'Delivered' && (
                      <div className="flex items-center gap-2 text-[#0aad0a] font-bold text-xs">
                        <CheckCircle2 size={16} />
                        <span>Completed &bull; Payout Credited</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </main>
      </div>

      {/* OTP Delivery Verification Modal */}
      {activeOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-5 relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setActiveOtpModal(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black">Verify Customer Delivery OTP</h3>
              <p className="text-xs text-gray-400">
                Ask customer <strong className="text-white">{activeOtpModal.customerName}</strong> for the 4-digit delivery security code
              </p>
            </div>

            {activeOtpModal.paymentMethod.includes('COD') && (
              <div className="bg-amber-950/40 border border-amber-900/40 p-3 rounded-xl text-amber-300 text-xs font-bold">
                💵 Collect <strong>{formatNaira(activeOtpModal.totalAmount)} Cash</strong> before handing over the parcel.
              </div>
            )}

            {otpError && (
              <div className="bg-red-950/50 border border-red-800 text-red-400 text-xs font-bold p-3 rounded-xl">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtpAndDeliver} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">4-Digit Security OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="e.g. 4892 (or test 1234)"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3.5 text-center font-mono font-black text-lg tracking-widest focus:outline-none focus:border-[#0aad0a]"
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                >
                  Verify &amp; Mark Delivered
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOtpModal(null)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
