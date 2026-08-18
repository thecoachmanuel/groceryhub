'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Filter, 
  ArrowUpDown, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import ProductCard from '@/components/website/ProductCard';
import CartDrawer, { CartItem } from '@/components/website/CartDrawer';
import { formatNaira } from '@/lib/currency';
import { PRODUCTS_CATALOG } from '@/lib/catalog';

const CATEGORY_MAP: Record<string, { title: string; desc: string; icon: string }> = {
  vegetables: {
    title: 'Fresh Vegetables & Greens',
    desc: 'Crisp organic veggies, farm-fresh leafy greens, and culinary herbs delivered within 30 minutes in Nigeria.',
    icon: '🥬',
  },
  fruits: {
    title: 'Fresh Seasonal Fruits',
    desc: 'Sweet, juicy, hand-picked seasonal fruits directly sourced from local certified farms.',
    icon: '🍎',
  },
  dairy: {
    title: 'Pure Dairy, Eggs & Cheeses',
    desc: 'Farm pure milk, organic butter, artisan cheeses, yogurts, and free-range fresh eggs.',
    icon: '🥛',
  },
  bakery: {
    title: 'Artisan Bakery & Breads',
    desc: 'Freshly baked sourdough breads, sandwich loaves, gluten-free bakes, and breakfast pastries.',
    icon: '🍞',
  },
  beverages: {
    title: 'Cold Drinks & Juices',
    desc: 'Cold-pressed natural juices, iced teas, organic coffee, and health beverages.',
    icon: '🧃',
  },
  snacks: {
    title: 'Snacks & Munchies',
    desc: 'Crunchy plantain chips, roasted cashews, gourmet popcorn, cookies, and chocolate delights.',
    icon: '🍿',
  },
  pantry: {
    title: 'Pantry & Cooking Essentials',
    desc: 'Cold-pressed oils, premium Nigerian rice, grains, pulses, aromatic spices, and cooking ingredients.',
    icon: '🍚',
  },
};

// Products sourced from the shared catalog — see src/lib/catalog.ts


export default function CategoryDetailsPage({ params }: { params?: { slug?: string } }) {
  const routerParams = useParams();
  const rawSlug = (params?.slug || (routerParams?.slug as string) || 'all');
  const slug = String(rawSlug).toLowerCase();

  const categoryMeta = CATEGORY_MAP[slug] || {
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    desc: 'Browse quality items in this collection with express delivery.',
    icon: '🛒',
  };

  const [sortBy, setSortBy] = useState('popular');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (variantId: number, qty: number) => {
    let matchedProduct: any = null;
    let matchedVariant: any = null;

    for (const p of PRODUCTS_CATALOG) {
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

  const filteredProducts = PRODUCTS_CATALOG.filter((p) => {
    if (slug === 'all') return true;
    return p.category === slug;
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
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <Link href="/" className="hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <span>/</span>
          <Link href="/category" className="hover:text-[#0aad0a]">
            Categories
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{categoryMeta.title}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles size={13} className="text-amber-300" />
              <span>30-Minute Doorstep Delivery</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">{categoryMeta.title}</h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg leading-relaxed">
              {categoryMeta.desc}
            </p>
          </div>

          <div className="text-6xl sm:text-7xl p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
            {categoryMeta.icon}
          </div>
        </div>

        {/* Action / Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
            Showing <span className="text-[#0aad0a] font-black">{filteredProducts.length}</span> fresh products
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
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-12 text-center border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="text-5xl">🌾</div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">No products found in this category</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Check back soon as our farm partners restock fresh harvests daily.
            </p>
            <Link
              href="/category"
              className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3 rounded-2xl text-xs shadow-md"
            >
              <span>Explore All Categories</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
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
        )}
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
