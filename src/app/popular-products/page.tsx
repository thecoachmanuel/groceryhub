'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Filter, 
  Flame, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import ProductCard from '@/components/website/ProductCard';
import CartDrawer, { CartItem } from '@/components/website/CartDrawer';
import { formatNaira } from '@/lib/currency';

const ALL_POPULAR_PRODUCTS = [
  {
    id: 1,
    name: 'Fresh Organic Farm Broccoli',
    slug: 'fresh-organic-broccoli',
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500',
    rating: 4.9,
    rating_count: 145,
    variants: [
      { id: 101, title: '500 g', price: 4500, discounted_price: 3500, stock: 45, unit: '500 g' },
      { id: 102, title: '1 kg', price: 8500, discounted_price: 6500, stock: 30, unit: '1 kg' },
    ],
  },
  {
    id: 2,
    name: 'Red Sweet Crisp Apples (1kg Pack)',
    slug: 'red-sweet-apples',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
    rating: 4.8,
    rating_count: 98,
    variants: [
      { id: 103, title: '1 kg', price: 5500, discounted_price: 4500, stock: 50, unit: '1 kg' },
      { id: 104, title: '2 kg Pack', price: 10500, discounted_price: 8500, stock: 20, unit: '2 kg' },
    ],
  },
  {
    id: 3,
    name: 'Farm Fresh Pure Whole Milk (1L)',
    slug: 'farm-fresh-milk',
    category: 'dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500',
    rating: 4.9,
    rating_count: 310,
    variants: [
      { id: 105, title: '1 Litre', price: 4200, discounted_price: 3800, stock: 100, unit: '1 Litre' },
      { id: 106, title: '2 Litres Bundle', price: 8000, discounted_price: 7200, stock: 40, unit: 'Bundle' },
    ],
  },
  {
    id: 4,
    name: 'Artisan Sourdough Country Bread (750g)',
    slug: 'artisan-sourdough-bread',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    rating: 4.7,
    rating_count: 84,
    variants: [
      { id: 107, title: 'Standard Loaf (750g)', price: 3800, discounted_price: 3200, stock: 15, unit: '750g' },
    ],
  },
  {
    id: 5,
    name: 'Fresh Ripe Hass Avocados (Pack of 4)',
    slug: 'fresh-hass-avocados',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500',
    rating: 5.0,
    rating_count: 220,
    variants: [
      { id: 108, title: 'Pack of 4', price: 4800, discounted_price: 3800, stock: 35, unit: '4 pcs' },
      { id: 109, title: 'Pack of 8 Box', price: 9500, discounted_price: 7200, stock: 25, unit: '8 pcs' },
    ],
  },
  {
    id: 6,
    name: 'Organic Baby Spinach (Pre-washed 250g)',
    slug: 'organic-baby-spinach',
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
    rating: 4.8,
    rating_count: 115,
    variants: [
      { id: 110, title: '250 g Tub', price: 3400, discounted_price: 2800, stock: 60, unit: '250 g' },
    ],
  },
  {
    id: 7,
    name: 'Fresh Juicy Strawberries (Local Farm Box)',
    slug: 'fresh-strawberries',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500',
    rating: 4.9,
    rating_count: 190,
    variants: [
      { id: 111, title: '400 g Box', price: 5500, discounted_price: 4200, stock: 40, unit: '400 g' },
    ],
  },
  {
    id: 8,
    name: 'Pure Cold Pressed Extra Virgin Olive Oil (500ml)',
    slug: 'extra-virgin-olive-oil',
    category: 'pantry',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
    rating: 4.9,
    rating_count: 165,
    variants: [
      { id: 112, title: '500 ml Bottle', price: 11500, discounted_price: 9500, stock: 25, unit: '500 ml' },
    ],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Popular' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fresh Fruits' },
  { id: 'dairy', label: 'Dairy & Eggs' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'pantry', label: 'Pantry Staples' },
];

export default function PopularProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (variantId: number, qty: number) => {
    let matchedProduct: any = null;
    let matchedVariant: any = null;

    for (const p of ALL_POPULAR_PRODUCTS) {
      const v = p.variants.find((item) => item.id === variantId);
      if (v) {
        matchedProduct = p;
        matchedVariant = v;
        break;
      }
    }

    if (!matchedProduct || !matchedVariant) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.variant_id === variantId);
      if (qty === 0) {
        return prev.filter((item) => item.variant_id !== variantId);
      }
      if (existing) {
        return prev.map((item) =>
          item.variant_id === variantId ? { ...item, quantity: qty } : item
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          product_id: matchedProduct.id,
          variant_id: matchedVariant.id,
          name: matchedProduct.name,
          variant_title: matchedVariant.title,
          image: matchedProduct.image,
          price: matchedVariant.discounted_price,
          quantity: qty,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const filteredProducts = ALL_POPULAR_PRODUCTS.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.variants[0].discounted_price - b.variants[0].discounted_price;
    if (sortBy === 'price-high') return b.variants[0].discounted_price - a.variants[0].discounted_price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.rating_count - a.rating_count;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820] text-gray-900 dark:text-white">
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <Link href="/" className="hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Popular &amp; Best Sellers</span>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0aad0a] to-emerald-800 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Flame size={13} className="text-amber-300 fill-amber-300" />
              <span>Trending Across Lagos</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">Most Popular Farm Produce</h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
              Top-rated fresh vegetables, fruits, and dairy essentials in Nigerian Naira (₦).
            </p>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
            <Sparkles size={36} />
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/30'
                    : 'bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-2xl px-3 py-2 text-xs font-bold shadow-sm">
              <ArrowUpDown size={14} className="text-[#0aad0a]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High (₦)</option>
                <option value="price-high">Price: High to Low (₦)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              image={product.image}
              rating={product.rating}
              rating_count={product.rating_count}
              variants={product.variants}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={(id, q) =>
          setCartItems((prev) =>
            q > 0 ? prev.map((item) => (item.id === id ? { ...item, quantity: q } : item)) : prev.filter((i) => i.id !== id)
          )
        }
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
      />
    </div>
  );
}
