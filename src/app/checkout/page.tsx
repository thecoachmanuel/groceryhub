'use client';

import { useState } from 'react';
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
  Percent,
  Smartphone,
  Building
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { formatNaira } from '@/lib/currency';

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedTimeslot, setSelectedTimeslot] = useState('Express (30 Mins)');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'cod' | 'wallet'>('paystack');
  const [useWallet, setUseWallet] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  const walletBalance = 12500.00; // ₦12,500
  const itemSubtotal = 18500.00; // ₦18,500
  const deliveryFee = 0.00; // Free above ₦15,000
  const platformServiceFee = 500.00; // ₦500 hyper-local service charge
  const tax = itemSubtotal * 0.05; // 5% VAT (₦925)
  
  const discountFromWallet = useWallet ? Math.min(walletBalance, itemSubtotal + platformServiceFee + tax - couponDiscount) : 0;
  const grandTotal = Math.max(0, itemSubtotal + deliveryFee + platformServiceFee + tax - couponDiscount - discountFromWallet);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'GROCERY10') {
      setCouponDiscount(2000.00); // ₦2,000 discount
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try GROCERY10 for ₦2,000 OFF!');
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      if (paymentMethod === 'paystack') {
        const initRes = await fetch('/api/payment/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'customer@groceryhub.ng',
            amount: grandTotal,
            reference: `ORD_NG_${Date.now()}`,
          }),
        });
        const resData = await initRes.json();
        if (resData.success && resData.data?.authorization_url) {
          // If in test/live mode, redirect to Paystack checkout URL
          window.location.href = resData.data.authorization_url;
          return;
        }
      }

      // COD or Wallet Direct Checkout
      setTimeout(() => {
        setIsSubmitting(false);
        setOrderPlacedSuccess(true);
        setTimeout(() => {
          router.push('/order-history');
        }, 2000);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      alert('Order placement failed. Please try again.');
    }
  };

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

        {orderPlacedSuccess ? (
          <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#0aad0a] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Order Confirmed!</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your grocery basket has been placed with our local farm partners. Total: <strong className="text-[#0aad0a] font-mono">{formatNaira(grandTotal)}</strong>
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
                  <button className="text-xs font-black text-[#0aad0a] hover:underline flex items-center gap-1">
                    <Plus size={14} /> Add Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[
                    { id: 1, title: 'Home', address: 'Plot 14, Adeola Odeku Street, Victoria Island', city: 'Lagos, Nigeria', phone: '+234 802 345 6789' },
                    { id: 2, title: 'Office', address: '12 Admiralty Way, Lekki Phase 1', city: 'Lagos, Nigeria', phone: '+234 803 987 6543' },
                  ].map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1 ${
                        selectedAddress === addr.id
                          ? 'border-[#0aad0a] bg-[#0aad0a]/5 dark:bg-[#0aad0a]/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900 dark:text-white">{addr.title}</span>
                        {selectedAddress === addr.id && <CheckCircle2 size={16} className="text-[#0aad0a]" />}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{addr.address}</p>
                      <p className="text-[11px] text-gray-400">{addr.city}</p>
                      <p className="text-[11px] font-mono text-gray-500">{addr.phone}</p>
                    </div>
                  ))}
                </div>
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

                {/* Line Items Bill Breakdown in Naira */}
                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">{formatNaira(itemSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-bold text-[#0aad0a]">FREE (Above ₦15,000)</span>
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
                  disabled={isSubmitting}
                  className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
                >
                  <span>{isSubmitting ? 'Securing Order...' : `Pay ${formatNaira(grandTotal)}`}</span>
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

      <Footer />
    </div>
  );
}
