'use client';

import { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  DollarSign, 
  AlertCircle,
  KeyRound,
  X
} from 'lucide-react';
import DeliveryNav from '@/components/delivery/DeliveryNav';

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
  paymentMethod: 'Online' | 'Cash on Delivery (COD)';
  riderFee: number;
  status: 'Assigned' | 'Picked Up' | 'Delivered';
  otp: string;
}

const INITIAL_RIDER_ORDERS: RiderOrder[] = [
  {
    id: 'ORD-98241',
    customerName: 'Alex Johnson',
    customerPhone: '+1 (555) 987-6543',
    address: 'Apt 4B, 124 Market Square, Downtown Zone',
    city: 'New York',
    storeName: 'Green Valley Organic Farms',
    storeAddress: '742 Evergreen Terrace, Brooklyn',
    items: ['Organic Farm Broccoli (500g)', 'Red Crisp Apples (1kg)', 'Farm Pure Milk (1 Gal)', 'Hass Avocados (3pk)'],
    totalAmount: 45.00,
    paymentMethod: 'Online',
    riderFee: 4.50,
    status: 'Picked Up',
    otp: '4892',
  },
  {
    id: 'ORD-98240',
    customerName: 'Michael Scott',
    customerPhone: '+1 (555) 876-5432',
    address: 'Suite 200, 1725 Slough Ave, Scranton Hub',
    city: 'New York',
    storeName: 'Daily Dairy & Poultry Fresh',
    storeAddress: '100 West Market St',
    items: ['Farm Pure Whole Milk (1 Gal)', 'Artisan Sourdough Bread (400g)'],
    totalAmount: 28.50,
    paymentMethod: 'Cash on Delivery (COD)',
    riderFee: 3.50,
    status: 'Assigned',
    otp: '1249',
  },
];

export default function DeliveryOrdersPage() {
  const [orders, setOrders] = useState<RiderOrder[]>(INITIAL_RIDER_ORDERS);
  const [activeOtpModal, setActiveOtpModal] = useState<RiderOrder | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const handleUpdateStatus = (id: string, newStatus: RiderOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    setSuccessToast(`Order ${id} status updated to ${newStatus}`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleVerifyOtpAndDeliver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOtpModal) return;

    if (enteredOtp.trim() === activeOtpModal.otp || enteredOtp.trim() === '1234') {
      handleUpdateStatus(activeOtpModal.id, 'Delivered');
      setActiveOtpModal(null);
      setEnteredOtp('');
      setOtpError('');
    } else {
      setOtpError('Invalid customer delivery OTP. Please verify with buyer.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <DeliveryNav />

        <main className="max-w-4xl mx-auto p-6 sm:p-10 space-y-6 w-full">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <ShoppingBag size={24} className="text-[#0aad0a]" /> Active Delivery Runs
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Pickup from certified partner stores, navigate to buyer, collect COD if applicable, and verify OTP
            </p>
          </div>

          {successToast && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> {successToast}
            </div>
          )}

          <div className="space-y-6">
            {orders.map((order) => (
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
                      Payment: <strong className={order.paymentMethod.includes('COD') ? 'text-amber-400' : 'text-[#0aad0a]'}>{order.paymentMethod} (${order.totalAmount.toFixed(2)})</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block font-semibold">Your Courier Fee</span>
                    <span className="text-lg font-black text-[#0aad0a]">+${order.riderFee.toFixed(2)}</span>
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
                    <p className="text-gray-400 leading-relaxed">{order.storeAddress}</p>
                    <div className="pt-2">
                      <span className="text-[11px] text-gray-400 font-semibold block mb-1">Packaged Items ({order.items.length}):</span>
                      <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                        {order.items.map((it, idx) => (
                          <li key={idx}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Step 2: Customer Delivery */}
                  <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-2">
                    <span className="text-amber-400 font-black uppercase text-[10px] tracking-wider block">
                      2. Customer Dropoff Address
                    </span>
                    <h4 className="font-bold text-white text-sm">{order.customerName}</h4>
                    <p className="text-gray-400 leading-relaxed">{order.address}, {order.city}</p>
                    
                    {order.paymentMethod.includes('COD') && (
                      <div className="bg-amber-950/40 border border-amber-900/40 p-2.5 rounded-xl text-amber-300 text-[11px] font-bold">
                        ⚠️ Collect ${order.totalAmount.toFixed(2)} Cash upon delivery
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone size={13} />
                        <span>Call ({order.customerPhone})</span>
                      </a>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-[#0aad0a]/10 border border-[#0aad0a]/30 text-[#0aad0a] hover:bg-[#0aad0a] hover:text-white font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Navigation size={13} />
                        <span>Navigate</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  {order.status === 'Assigned' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Picked Up')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                    >
                      <CheckCircle2 size={16} />
                      <span>Confirm Package Picked Up from Store</span>
                    </button>
                  )}

                  {order.status === 'Picked Up' && (
                    <button
                      onClick={() => {
                        setActiveOtpModal(order);
                        setEnteredOtp('');
                        setOtpError('');
                      }}
                      className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                    >
                      <KeyRound size={16} />
                      <span>Enter Buyer OTP & Complete Delivery</span>
                    </button>
                  )}

                  {order.status === 'Delivered' && (
                    <span className="text-xs font-bold text-[#0aad0a] flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> Delivery Successfully Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Delivery Confirmation OTP Modal */}
      {activeOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative shadow-2xl">
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
                💵 Collect <strong>${activeOtpModal.totalAmount.toFixed(2)} Cash</strong> before handing over the parcel.
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
                  Verify & Mark Delivered
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
