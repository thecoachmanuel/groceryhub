'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Clock, 
  ShoppingBag, 
  Star, 
  Tag, 
  Store, 
  Percent, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Filter
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { formatNaira } from '@/lib/currency';

interface DealProduct {
  id: number;
  name: string;
  category: string;
  seller_name: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  unit: string;
  rating: number;
  reviews_count: number;
  image: string;
  claimed_percentage: number;
}

const DEAL_PRODUCTS: DealProduct[] = [
  {
    id: 1,
    name: 'Organic Honeycrisp Apples (1kg Bag)',
    category: 'Fresh Fruits',
    seller_name: 'Fresh Harvest Organics',
    price: 3500,
    original_price: 5500,
    discount_percentage: 36,
    unit: '1 kg pack',
    rating: 4.9,
    reviews_count: 128,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=60',
    claimed_percentage: 78
  },
  {
    id: 2,
    name: 'Fresh Atlantic Salmon Fillet (Wild Caught)',
    category: 'Meat & Seafood',
    seller_name: 'Ocean Catch Seafood',
    price: 9500,
    original_price: 15500,
    discount_percentage: 38,
    unit: '500g portion',
    rating: 4.8,
    reviews_count: 85,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&auto=format&fit=crop&q=60',
    claimed_percentage: 92
  },
  {
    id: 3,
    name: 'Artisanal Italian Olive Oil (Cold-Pressed Extra Virgin)',
    category: 'Pantry Essentials',
    seller_name: 'Green Valley Grocers',
    price: 8500,
    original_price: 13500,
    discount_percentage: 37,
    unit: '500ml bottle',
    rating: 5.0,
    reviews_count: 210,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=60',
    claimed_percentage: 64
  },
  {
    id: 4,
    name: 'Organic Hass Avocados (Jumbo 4-Pack)',
    category: 'Vegetables',
    seller_name: 'Fresh Harvest Organics',
    price: 3800,
    original_price: 6500,
    discount_percentage: 41,
    unit: '4 count pack',
    rating: 4.9,
    reviews_count: 340,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=60',
    claimed_percentage: 85
  },
  {
    id: 5,
    name: 'Pure Raw Blossom Honey (Unfiltered 500g)',
    category: 'Pantry Essentials',
    seller_name: 'Green Valley Grocers',
    price: 5500,
    original_price: 9000,
    discount_percentage: 39,
    unit: '500g jar',
    rating: 4.9,
    reviews_count: 95,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop&q=60',
    claimed_percentage: 52
  },
  {
    id: 6,
    name: 'Handcrafted Chocolate Almond Croissants (4-Pack)',
    category: 'Bakery',
    seller_name: 'Daily Baker Market',
    price: 4500,
    original_price: 7500,
    discount_percentage: 40,
    unit: '4 pcs box',
    rating: 4.9,
    reviews_count: 160,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=60',
    claimed_percentage: 90
  }
];

const CATEGORIES = ['All Deals', 'Fresh Fruits', 'Vegetables', 'Meat & Seafood', 'Bakery', 'Pantry Essentials'];

export default function DealOfTheDayPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Deals');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Live Countdown state
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (productName: string) => {
    setAddedItem(productName);
    setTimeout(() => setAddedItem(null), 3000);
  };

  const filtered = selectedCategory === 'All Deals' 
    ? DEAL_PRODUCTS 
    : DEAL_PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820] text-gray-900 dark:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <Link href="/" className="hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Storefront
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Deals of the Day</span>
        </div>

        {/* Hero Banner with Live Countdown Clock */}
        <div className="rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          <div className="space-y-3 max-w-xl z-10">
            <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-amber-300">
              <Flame size={14} className="fill-amber-300" />
              <span>Limited Time Daily Flash Sale</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Deals of the Day 🔥
            </h1>
            <p className="text-sm sm:text-base text-orange-100 font-medium">
              Save up to 45% OFF hand-picked fresh organic produce, bakery delights, and pantry staples in Naira (₦).
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-3 z-10 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Clock size={16} /> Deals Expire In
            </div>

            <div className="flex items-center gap-3 font-mono font-black text-3xl sm:text-4xl text-white">
              <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/10 text-center">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-[9px] font-sans font-normal text-orange-200 mt-1">HRS</span>
              </div>
              <span className="text-amber-300 animate-pulse">:</span>
              <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/10 text-center">
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="block text-[9px] font-sans font-normal text-orange-200 mt-1">MIN</span>
              </div>
              <span className="text-amber-300 animate-pulse">:</span>
              <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/10 text-center text-amber-300">
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="block text-[9px] font-sans font-normal text-orange-200 mt-1">SEC</span>
              </div>
            </div>
          </div>
        </div>

        {addedItem && (
          <div className="bg-emerald-500 text-white p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xl animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> Added &quot;{addedItem}&quot; to cart at exclusive flash sale price!
            </span>
            <Link href="/cart" className="underline font-black hover:text-emerald-100">
              View Cart &amp; Checkout
            </Link>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                selectedCategory === c
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                  : 'bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div 
              key={product.id}
              className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-xl hover:border-[#0aad0a]/40 transition-all group"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-1">
                  <Flame size={12} fill="currentColor" /> -{product.discount_percentage}% OFF
                </span>

                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-xl">
                  {product.category}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Store size={12} className="text-[#0aad0a]" /> {product.seller_name}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <Star size={12} fill="currentColor" /> {product.rating} ({product.reviews_count})
                  </span>
                </div>

                <Link href={`/product/${product.id}`} className="font-black text-base text-gray-900 dark:text-white hover:text-[#0aad0a] transition-colors line-clamp-1">
                  {product.name}
                </Link>

                <div className="flex items-baseline gap-2">
                  <span className="font-black text-xl text-[#0aad0a] font-mono">{formatNaira(product.price)}</span>
                  <span className="text-xs text-gray-400 line-through font-mono">{formatNaira(product.original_price)}</span>
                  <span className="text-xs text-gray-500 font-mono font-medium">/ {product.unit}</span>
                </div>

                {/* Claimed progress */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-red-500">Almost Gone!</span>
                    <span className="text-gray-400">{product.claimed_percentage}% claimed</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full"
                      style={{ width: `${product.claimed_percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => handleAddToCart(product.name)}
                className="w-full bg-gray-900 dark:bg-gray-800 hover:bg-[#0aad0a] dark:hover:bg-[#0aad0a] text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 group-hover:bg-[#0aad0a]"
              >
                <ShoppingBag size={16} />
                <span>Claim Deal &bull; {formatNaira(product.price)}</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
