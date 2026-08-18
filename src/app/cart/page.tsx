'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  Truck, 
  Store, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { formatNaira } from '@/lib/currency';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  seller_name: string;
  price: number;
  original_price: number;
  unit: string;
  quantity: number;
  image: string;
  inStock: boolean;
}

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    product_id: 101,
    name: 'Fresh Organic Hass Avocados (Pack of 4)',
    seller_name: 'Fresh Harvest Organics',
    price: 3800,
    original_price: 4500,
    unit: '4 pcs pack',
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 2,
    product_id: 102,
    name: 'Pasture-Raised Organic Grade A Large Eggs',
    seller_name: 'Brooklyn Artisanal Dairy',
    price: 4200,
    original_price: 5000,
    unit: '12 count carton',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 3,
    product_id: 103,
    name: 'Cold-Pressed Valencia Orange Juice (100% Pure)',
    seller_name: 'Fresh Harvest Organics',
    price: 3500,
    original_price: 4000,
    unit: '1 Litre bottle',
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 4,
    product_id: 104,
    name: 'Organic Sliced Country Sourdough Bread',
    seller_name: 'Daily Baker Market',
    price: 3200,
    original_price: 3800,
    unit: '750g loaf',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=60',
    inStock: true
  }
];

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const freeDeliveryThreshold = 15000.00; // ₦15,000
  const platformServiceFee = 500.00; // ₦500
  const taxRate = 0.05; // 5%

  const updateQuantity = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to empty your cart?')) {
      setItems([]);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.toUpperCase() === 'GROCERY10') {
      setCouponDiscount(2000.00); // ₦2,000
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === 'FRESH20') {
      setCouponDiscount(3500.00); // ₦3,500
      setCouponApplied(true);
    } else {
      setCouponError('Invalid promo code. Try GROCERY10 or FRESH20.');
    }
  };

  // Calculations
  const itemSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeDelivery = itemSubtotal >= freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery ? 0.00 : 1500.00;
  const progressToFreeDelivery = Math.min(100, (itemSubtotal / freeDeliveryThreshold) * 100);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - itemSubtotal);
  const tax = itemSubtotal * taxRate;
  const grandTotal = Math.max(0, itemSubtotal + deliveryCharge + platformServiceFee + tax - couponDiscount);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820] text-gray-900 dark:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <Link href="/" className="text-xs font-bold text-gray-500 hover:text-[#0aad0a] flex items-center gap-1">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <ShoppingBag size={28} className="text-[#0aad0a]" /> Shopping Cart ({items.length} Items)
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Review your fresh grocery basket, apply voucher discounts, and proceed to secure checkout
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 size={14} /> Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-12 text-center border border-gray-200 dark:border-gray-800 space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#0aad0a] flex items-center justify-center mx-auto">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Your Shopping Cart is Empty</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Looks like you haven&apos;t added any delicious organic groceries or pantry essentials to your basket yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3 rounded-2xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <span>Explore Fresh Categories</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-6">

              {/* Free Delivery Bar */}
              <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                    <Truck size={16} className="text-[#0aad0a]" />
                    {isFreeDelivery ? (
                      <span className="text-[#0aad0a] font-black">Congratulations! You unlocked FREE 30-Min Delivery</span>
                    ) : (
                      <span>Add <strong className="text-[#0aad0a] font-mono">{formatNaira(amountNeededForFreeDelivery)}</strong> more to get FREE Delivery!</span>
                    )}
                  </span>
                  <span className="font-mono text-gray-500">{progressToFreeDelivery.toFixed(0)}%</span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0aad0a] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeDelivery}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800/60">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Item Details */}
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shrink-0" 
                      />
                      <div className="space-y-1">
                        <Link href={`/product/${item.product_id}`} className="font-black text-sm sm:text-base text-gray-900 dark:text-white hover:text-[#0aad0a] transition-colors line-clamp-1">
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Store size={12} className="text-[#0aad0a]" /> {item.seller_name}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[11px]">{item.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#0aad0a] font-mono text-sm">{formatNaira(item.price)}</span>
                          {item.original_price > item.price && (
                            <span className="text-xs text-gray-400 line-through font-mono">{formatNaira(item.original_price)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center font-black text-xs font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <div className="font-black text-gray-900 dark:text-white font-mono text-base">
                          {formatNaira(item.price * item.quantity)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Order Summary & Coupon */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5 sticky top-24">
                <h3 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                  Cart Bill Summary
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Tag size={14} className="text-[#0aad0a]" /> Apply Promo Voucher
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
                  {couponError && (
                    <p className="text-[11px] font-bold text-red-500">
                      {couponError}
                    </p>
                  )}
                </form>

                {/* Bill Breakdown in Naira */}
                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">{formatNaira(itemSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className={`font-bold ${isFreeDelivery ? 'text-[#0aad0a]' : 'text-gray-900 dark:text-white font-mono'}`}>
                      {isFreeDelivery ? 'FREE' : formatNaira(deliveryCharge)}
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

                  <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>Estimated Total</span>
                    <span className="font-mono text-xl text-[#0aad0a]">{formatNaira(grandTotal)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
                  <ShieldCheck size={14} className="text-[#0aad0a]" />
                  <span>Safe &amp; Secure Paystack 256-Bit SSL Checkout</span>
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
