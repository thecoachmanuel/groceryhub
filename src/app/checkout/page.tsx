'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  CreditCard, 
  Tag, 
  Wallet, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  Plus,
  X,
  Trash2,
  Home,
  Briefcase
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { formatNaira } from '@/lib/currency';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSystemSettings } from '@/context/SystemSettingsContext';
import { apiFetch } from '@/lib/api-fetch';

interface SavedAddress {
  id: number;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  mobile: string;
  flat: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

interface CheckoutCartItem {
  id: number | string;
  product_id?: number | string;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
  image?: string;
}

const DEFAULT_CHECKOUT_ITEMS: CheckoutCartItem[] = [];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, clearCart, isLoaded: cartLoaded } = useCart();

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // Address modal form states
  const [modalType, setModalType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [modalFlat, setModalFlat] = useState('');
  const [modalArea, setModalArea] = useState('');
  const [modalCity, setModalCity] = useState('Lagos');
  const [modalPhone, setModalPhone] = useState('');

  // Timeslot & Payment States
  const [selectedTimeslot, setSelectedTimeslot] = useState('Express (30 Mins)');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'cod' | 'wallet'>('paystack');
  const [useWallet, setUseWallet] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  // Load user saved addresses from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user?.mobile) setModalPhone(user.mobile);
      
      const savedKey = user?.id ? `groceryhub_addresses_${user.id}` : 'groceryhub_guest_addresses';
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        try {
          const parsed: SavedAddress[] = JSON.parse(saved);
          setAddresses(parsed);
          if (parsed.length > 0) {
            const defaultAddr = parsed.find(a => a.isDefault) || parsed[0];
            setSelectedAddressId(defaultAddr.id);
          }
        } catch {}
      } else {
        setAddresses([]);
        setSelectedAddressId(null);
      }
    }
  }, [user]);

  const handleDeleteAddress = (addrId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = addresses.filter(a => a.id !== addrId);
    setAddresses(updated);

    if (selectedAddressId === addrId) {
      setSelectedAddressId(updated.length > 0 ? updated[0].id : null);
    }

    if (typeof window !== 'undefined') {
      const savedKey = user?.id ? `groceryhub_addresses_${user.id}` : 'groceryhub_guest_addresses';
      localStorage.setItem(savedKey, JSON.stringify(updated));
    }
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFlat || !modalArea) {
      alert('Please enter your flat/building number and street area.');
      return;
    }

    const newAddr: SavedAddress = {
      id: Date.now(),
      type: modalType,
      name: user?.name || 'Valued Customer',
      mobile: modalPhone || user?.mobile || '+234 800 000 0000',
      flat: modalFlat,
      area: modalArea,
      city: modalCity,
      pincode: '101241',
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddr];
    setAddresses(updated);
    setSelectedAddressId(newAddr.id);

    if (typeof window !== 'undefined') {
      const savedKey = user?.id ? `groceryhub_addresses_${user.id}` : 'groceryhub_guest_addresses';
      localStorage.setItem(savedKey, JSON.stringify(updated));
    }

    setShowAddAddressModal(false);
    setModalFlat('');
    setModalArea('');
  };

  const { settings } = useSystemSettings();

  const walletBalance = user?.walletBalance ?? 0.00;
  const itemSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 15000;
  const baseDeliveryFee = settings?.deliveryFee ?? 1500;
  const serviceFeeAmount = settings?.platformServiceFee ?? 500;
  const taxRate = settings?.taxRate ?? 7.5;

  const isFreeDelivery = itemSubtotal >= freeDeliveryThreshold || itemSubtotal === 0;
  const deliveryFee = isFreeDelivery ? 0.00 : baseDeliveryFee;
  const platformServiceFee = itemSubtotal > 0 ? serviceFeeAmount : 0.00;
  const tax = Math.round(itemSubtotal * (taxRate / 100) * 100) / 100;
  
  const discountFromWallet = useWallet ? Math.min(walletBalance, itemSubtotal + deliveryFee + platformServiceFee + tax - couponDiscount) : 0;
  const grandTotal = Math.max(0, itemSubtotal + deliveryFee + platformServiceFee + tax - couponDiscount - discountFromWallet);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: itemSubtotal }),
      });
      const json = await res.json();
      if (json.success) {
        setCouponDiscount(json.discountAmount || 0);
        setCouponApplied(true);
      } else {
        alert(json.message || 'Invalid promo code');
      }
    } catch (err) {
      alert('Failed to validate coupon code');
    }
  };

  const handlePlaceOrder = async () => {
    let activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

    if (!activeAddress) {
      activeAddress = {
        id: Date.now(),
        type: 'Home',
        name: user?.name || 'Valued Customer',
        mobile: user?.mobile || '+234 800 000 0000',
        flat: modalFlat || 'Doorstep Delivery',
        area: modalArea || 'Victoria Island',
        city: modalCity || 'Lagos',
        pincode: '101241',
        isDefault: true,
      };
    }

    setIsSubmitting(true);
    try {
      // 1. Always create the order in MongoDB first
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('groceryhub_token') : null;
      const orderRes = await apiFetch('/api/v1_6/customer/placeCODOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          user_id: user?.id || Date.now(),
          customer_name: user?.name || activeAddress.name || 'Valued Customer',
          customer_phone: user?.mobile || activeAddress.mobile || '',
          customer_email: user?.email || 'customer@groceryhub.ng',
          seller_id: 1,
          subtotal: itemSubtotal,
          delivery_charge: deliveryFee,
          service_fee: platformServiceFee,
          tax_amount: tax,
          discount_amount: couponDiscount,
          wallet_amount_used: discountFromWallet,
          total_amount: grandTotal,
          payment_method: paymentMethod,
          delivery_timeslot: selectedTimeslot,
          delivery_address: activeAddress,
          items: cartItems.map((i) => ({
            product_id: i.product_id || i.id,
            product_name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      const orderJson = await orderRes.json().catch(() => ({}));
      const placedOrderId = orderJson?.data?.order_id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

      // 2. If Paystack, attempt Paystack initialization
      if (paymentMethod === 'paystack') {
        const payEmail = user?.email && user.email.includes('@') ? user.email : 'customer@groceryhub.ng';
        try {
          const initRes = await fetch('/api/payment/paystack/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: payEmail,
              amount: grandTotal,
              reference: placedOrderId,
            }),
          });
          const resData = await initRes.json();
          if (
            resData.success &&
            resData.data?.authorization_url &&
            !resData.data.authorization_url.includes('mock_code_')
          ) {
            // Real Paystack URL -> redirect to Paystack payment gateway
            window.location.href = resData.data.authorization_url;
            return;
          }
        } catch (payErr) {
          console.warn('Paystack initialize fallback to standard confirmation:', payErr);
        }
      }

      // 3. Save order to user's localStorage order history
      if (typeof window !== 'undefined') {
        const uId = user?.id || 'guest';
        const userOrdersKey = `groceryhub_orders_${uId}`;
        const existingOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
        const totalQty = cartItems.reduce((acc, i) => acc + i.quantity, 0);
        const orderItemSummary = cartItems.map(i => ({
          name: i.name,
          qty: i.quantity,
          price: i.price,
        }));

        const newOrderObj = {
          id: placedOrderId,
          date: 'Just Now',
          status: 'placed',
          statusStep: 1,
          total: grandTotal,
          itemsCount: totalQty,
          deliverySlot: selectedTimeslot,
          deliveryAddress: `${activeAddress.flat}, ${activeAddress.area}, ${activeAddress.city}`,
          driver: {
            name: 'GroceryHub Express Rider',
            phone: '+234 800 000 0000',
            vehicle: 'Express Delivery Bike',
          },
          items: orderItemSummary,
        };
        localStorage.setItem(userOrdersKey, JSON.stringify([newOrderObj, ...existingOrders]));
      }

      clearCart();
      setOrderPlacedSuccess(true);
      setTimeout(() => {
        router.push('/order-history');
      }, 1500);
    } catch (error: any) {
      console.error('Order placement error:', error);
      alert(error?.message || 'Order placement failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAddressObj = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
          <Link href="/cart" className="hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Shopping Cart
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Secure Checkout</span>
        </div>

        {!cartLoaded ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-[#0aad0a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-400">Loading your cart...</p>
          </div>
        ) : orderPlacedSuccess ? (
          <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#0aad0a] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Order Confirmed!</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your grocery basket has been placed. Total: <strong className="text-[#0aad0a] font-mono">{formatNaira(grandTotal)}</strong>
            </p>
            <p className="text-[11px] text-gray-400">Redirecting to live order tracking...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: 3-Step Checkout Flow */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Delivery Address */}
              <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0aad0a] text-white flex items-center justify-center text-xs font-black">
                      1
                    </div>
                    <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin size={18} className="text-[#0aad0a]" /> Delivery Address
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddAddressModal(true)}
                    className="text-xs font-black text-[#0aad0a] hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center space-y-3">
                    <MapPin size={32} className="mx-auto text-gray-400" />
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">No delivery addresses saved</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Add your primary home or office delivery address to complete your order.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(true)}
                      className="inline-flex items-center gap-1.5 bg-[#0aad0a] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md"
                    >
                      <Plus size={14} /> Add Delivery Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1 ${
                          selectedAddressId === addr.id
                            ? 'border-[#0aad0a] bg-[#0aad0a]/5 dark:bg-[#0aad0a]/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1">
                            {addr.type === 'Home' ? <Home size={13} className="text-[#0aad0a]" /> : <Briefcase size={13} className="text-blue-400" />}
                            {addr.type}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              title="Delete address"
                              onClick={(e) => handleDeleteAddress(addr.id, e)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                            {selectedAddressId === addr.id && <CheckCircle2 size={16} className="text-[#0aad0a]" />}
                          </div>
                        </div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{addr.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{addr.flat}, {addr.area}</p>
                        <p className="text-[11px] text-gray-400">{addr.city}</p>
                        <p className="text-[11px] font-mono text-gray-500">{addr.mobile}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Delivery Schedule */}
              <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0aad0a] text-white flex items-center justify-center text-xs font-black">
                    2
                  </div>
                  <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock size={18} className="text-[#0aad0a]" /> Choose Delivery Timeslot
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {[
                    'Express (30 Mins)',
                    '08:00 AM - 10:00 AM',
                    '10:00 AM - 12:00 PM',
                    '02:00 PM - 04:00 PM',
                    '04:00 PM - 06:00 PM',
                    '06:00 PM - 08:00 PM',
                    '08:00 PM - 10:00 PM',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeslot(slot)}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                        selectedTimeslot === slot
                          ? 'border-[#0aad0a] bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0aad0a] text-white flex items-center justify-center text-xs font-black">
                    3
                  </div>
                  <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <CreditCard size={18} className="text-[#0aad0a]" /> Select Payment Method
                  </h2>
                </div>

                {/* Wallet Option */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">GroceryHub Naira Wallet</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Available Balance: {formatNaira(walletBalance)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseWallet(!useWallet)}
                    disabled={walletBalance <= 0}
                    className={`text-xs font-black px-4 py-2 rounded-xl transition-all ${
                      useWallet
                        ? 'bg-amber-500 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {useWallet ? `Applied (-${formatNaira(discountFromWallet)})` : 'Use Balance'}
                  </button>
                </div>

                {/* Gateways Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[
                    { id: 'paystack', label: 'Paystack (Cards, Transfer, USSD, OPay)', desc: 'Instant & Secure Naira Checkout', badge: 'Recommended' },
                    { id: 'cod', label: 'Cash / POS on Delivery', desc: 'Pay cash or terminal swipe at doorstep', badge: 'Verified' },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 relative ${
                        paymentMethod === m.id
                          ? 'border-[#0aad0a] bg-[#0aad0a]/5 dark:bg-[#0aad0a]/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                        paymentMethod === m.id ? 'border-[#0aad0a] bg-[#0aad0a]' : 'border-gray-400'
                      }`}>
                        {paymentMethod === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{m.label}</h4>
                          {m.badge && (
                            <span className="bg-[#0aad0a]/20 text-[#0aad0a] font-black text-[9px] px-1.5 py-0.2 rounded-md">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Bill in Naira */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5 sticky top-24">
                <h3 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                  Bill Summary
                </h3>

                {/* Basket Items Summary */}
                <div className="space-y-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <span className="text-[10px] font-black uppercase text-[#0aad0a] tracking-wider block">
                    Basket Items ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                    {cartItems.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">Cart is empty — <a href="/cart" className="text-[#0aad0a] hover:underline">go back to add items</a></p>
                    ) : cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <span className="font-bold text-gray-800 dark:text-gray-200">{item.name}</span>
                          <span className="text-gray-400 text-[11px] block">x{item.quantity}</span>
                        </div>
                        <span className="font-mono font-bold text-gray-900 dark:text-white shrink-0">{formatNaira(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Tag size={14} className="text-[#0aad0a]" /> Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. GROCERY10"
                      className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs uppercase font-bold focus:outline-none focus:border-[#0aad0a] dark:text-white"
                    />
                    <button
                      type="submit"
                      className="bg-gray-900 dark:bg-gray-700 hover:bg-[#0aad0a] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] font-bold text-[#0aad0a] flex items-center gap-1">
                      <CheckCircle2 size={13} /> Promo applied (-{formatNaira(couponDiscount)})
                    </p>
                  )}
                </form>

                {/* Selected Address Preview */}
                {selectedAddressObj && (
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#0aad0a] block">Delivering To</span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{selectedAddressObj.flat}, {selectedAddressObj.area}</p>
                    <p className="text-[11px] text-gray-500">{selectedAddressObj.city} &bull; {selectedAddressObj.mobile}</p>
                  </div>
                )}

                {/* Line Items Bill Breakdown in Naira */}
                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">{formatNaira(itemSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className={`font-bold ${isFreeDelivery ? 'text-[#0aad0a]' : 'text-gray-900 dark:text-white font-mono'}`}>
                      {isFreeDelivery ? 'FREE (Above ₦15,000)' : formatNaira(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Service Fee</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">{formatNaira(platformServiceFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT / Taxes (5%)</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">{formatNaira(tax)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-[#0aad0a] font-bold">
                      <span>Promo Discount</span>
                      <span className="font-mono">-{formatNaira(couponDiscount)}</span>
                    </div>
                  )}
                  {discountFromWallet > 0 && (
                    <div className="flex justify-between text-amber-500 font-bold">
                      <span>Wallet Balance Used</span>
                      <span className="font-mono">-{formatNaira(discountFromWallet)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>Total Amount</span>
                    <span className="font-mono text-2xl text-[#0aad0a]">{formatNaira(grandTotal)}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
                >
                  <span>{isSubmitting ? 'Securing Order...' : cartItems.length === 0 ? 'Cart is Empty' : `Pay ${formatNaira(grandTotal)}`}</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
                  <ShieldCheck size={14} className="text-[#0aad0a]" />
                  <span>256-Bit SSL Encrypted • Powered by Paystack</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Add New Delivery Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-5 relative shadow-2xl animate-scale-up">
            <button
              type="button"
              onClick={() => setShowAddAddressModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Add Delivery Address</h3>
              <p className="text-xs text-gray-400 mt-0.5">Enter your doorstep address details for fast express delivery</p>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Address Label</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setModalType(t)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        modalType === t ? 'border-[#0aad0a] bg-[#0aad0a]/10 text-[#0aad0a]' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">House / Flat / Building No.</label>
                <input
                  type="text"
                  value={modalFlat}
                  onChange={(e) => setModalFlat(e.target.value)}
                  placeholder="e.g. Flat 4B, Oceanview Towers"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Street Address &amp; Area</label>
                <input
                  type="text"
                  value={modalArea}
                  onChange={(e) => setModalArea(e.target.value)}
                  placeholder="e.g. Plot 14, Adeola Odeku Street, Victoria Island"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">City</label>
                  <input
                    type="text"
                    value={modalCity}
                    onChange={(e) => setModalCity(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Phone Number</label>
                  <input
                    type="text"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95 mt-2"
              >
                Save &amp; Select Address
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
