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
    name: 'Organic Honeycrisp Apples (3lb Bag)',
    category: 'Fresh Fruits',
    seller_name: 'Fresh Harvest Organics',
    price: 3.99,
    original_price: 6.99,
    discount_percentage: 43,
    unit: '3 lb bag',
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
    price: 9.99,
    original_price: 15.99,
    discount_percentage: 38,
    unit: '1 lb portion',
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
    price: 8.49,
    original_price: 13.99,
    discount_percentage: 39,
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
    price: 4.49,
    original_price: 7.99,
    discount_percentage: 44,
    unit: '4 count pack',
    rating: 4.9,
    reviews_count: 340,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=60',
    claimed_percentage: 85
  },
  {
    id: 5,
    name: 'Pure Raw Blossom Honey (Unfiltered)',
    category: 'Pantry Essentials',
    seller_name: 'Green Valley Grocers',
    price: 6.99,
    original_price: 11.50,
    discount_percentage: 39,
    unit: '16 oz jar',
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
    price: 5.49,
    original_price: 8.99,
    discount_percentage: 39,
    unit: '4 pcs box',
    rating: 4.9,
    reviews_count: 160,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=60',
    claimed_percentage: 90
  }
];

export default function DealOfTheDayPage() {
  const [products] = useState<DealProduct[]>(DEAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  // Countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

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
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (name: string) => {
    setAddedNotification(`Added ${name} to your cart!`);
    setTimeout(() => setAddedNotification(null), 3000);
  };

  const categories = ['All', 'Fresh Fruits', 'Vegetables', 'Meat & Seafood', 'Bakery', 'Pantry Essentials'];

  const filtered = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820] text-gray-900 dark:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
        {/* Toast */}
        {addedNotification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0aad0a] text-white font-black text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={16} /> {addedNotification}
          </div>
        )}

        {/* Hero Deal Banner with Live Countdown */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Flame size={14} className="text-yellow-300" /> Flash Markdown Sale
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">
              Deal of the Day — Up to 50% OFF
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-xl">
              Limited daily inventory flash discounts on premium organic groceries, wild-caught seafood, and artisan pantry staples.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="bg-black/30 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-3xl text-center space-y-2 relative z-10 shrink-0">
            <div className="text-[11px] font-bold text-red-100 flex items-center justify-center gap-1.5 uppercase tracking-wider">
              <Clock size={14} /> Offers Expire In
            </div>
            <div className="flex items-center justify-center gap-2 font-mono font-black text-xl sm:text-2xl">
              <div className="bg-white/20 px-3 py-1.5 rounded-xl">
                {String(timeLeft.hours).padStart(2, '0')}
                <span className="block text-[9px] font-sans font-normal text-red-200">HRS</span>
              </div>
              <span>:</span>
              <div className="bg-white/20 px-3 py-1.5 rounded-xl">
                {String(timeLeft.minutes).padStart(2, '0')}
                <span className="block text-[9px] font-sans font-normal text-red-200">MIN</span>
              </div>
              <span>:</span>
              <div className="bg-white/20 px-3 py-1.5 rounded-xl text-yellow-300">
                {String(timeLeft.seconds).padStart(2, '0')}
                <span className="block text-[9px] font-sans font-normal text-red-200">SEC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
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
                  <span className="font-black text-xl text-[#0aad0a] font-mono">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 line-through font-mono">${product.original_price.toFixed(2)}</span>
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

              {/* Add to cart CTA */}
              <button
                onClick={() => handleAddToCart(product.name)}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/20 transition-all active:scale-95"
              >
                <ShoppingBag size={15} />
                <span>Add to Cart • ${product.price.toFixed(2)}</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
