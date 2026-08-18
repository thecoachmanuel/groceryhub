'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Store, 
  Percent, 
  ChevronRight 
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import ProductCard from '@/components/website/ProductCard';
import CartDrawer, { CartItem } from '@/components/website/CartDrawer';
import { PRODUCTS_CATALOG } from '@/lib/catalog';

// Mock/Initial Display Data matching GroceryHub's database catalog
const CATEGORIES = [
  { id: 1, name: 'Vegetables', slug: 'vegetables', icon: '🥬', count: '120+ Items', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' },
  { id: 2, name: 'Fresh Fruits', slug: 'fruits', icon: '🍎', count: '85+ Items', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' },
  { id: 3, name: 'Dairy & Eggs', slug: 'dairy', icon: '🥛', count: '60+ Items', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600' },
  { id: 4, name: 'Bakery & Bread', slug: 'bakery', icon: '🍞', count: '45+ Items', color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600' },
  { id: 5, name: 'Beverages', slug: 'beverages', icon: '🧃', count: '90+ Items', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600' },
  { id: 6, name: 'Snacks & Munchies', slug: 'snacks', icon: '🍿', count: '140+ Items', color: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600' },
  { id: 7, name: 'Pantry Staples', slug: 'pantry', icon: '🍚', count: '110+ Items', color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600' },
];

// Products sourced from shared catalog — see src/lib/catalog.ts
const POPULAR_PRODUCTS = PRODUCTS_CATALOG.slice(0, 8);


const TOP_SELLERS = [
  {
    id: 1,
    name: 'Green Valley Organic Farms',
    city: 'Epe Industrial Estate, Lagos',
    rating: 4.9,
    slug: 'vegetables',
    products: `${PRODUCTS_CATALOG.filter((p) => p.category === 'Vegetables' || p.category === 'Fruits').length} Products`,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400',
  },
  {
    id: 2,
    name: 'Daily Dairy & Poultry Fresh',
    city: 'Ikeja Wholesale Hub, Lagos',
    rating: 4.8,
    slug: 'dairy',
    products: `${PRODUCTS_CATALOG.filter((p) => p.category === 'Dairy').length} Products`,
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400',
  },
  {
    id: 3,
    name: 'The Artisanal Bakery Co.',
    city: 'Victoria Island Central, Lagos',
    rating: 4.9,
    slug: 'bakery',
    products: `${PRODUCTS_CATALOG.filter((p) => p.category === 'Bakery').length} Products`,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  },
];

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (variantId: number, qty: number) => {
    // Find the product & variant
    let matchedProduct: any = null;
    let matchedVariant: any = null;

    for (const p of POPULAR_PRODUCTS) {
      const v = p.variants.find((item) => item.id === variantId);
      if (v) {
        matchedProduct = p;
        matchedVariant = v;
        break;
      }
    }

    if (!matchedProduct || !matchedVariant) return;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.variant_id === variantId);
      if (qty === 0) {
        return prev.filter((item) => item.variant_id !== variantId);
      }
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = qty;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: Date.now(),
            product_id: matchedProduct.id,
            variant_id: matchedVariant.id,
            name: matchedProduct.name,
            variant_title: matchedVariant.title,
            image: matchedProduct.image,
            price: matchedVariant.discounted_price || matchedVariant.price,
            quantity: qty,
          },
        ];
      }
    });

    if (qty > 0 && !isCartOpen) {
      setIsCartOpen(true);
    }
  };

  const handleUpdateQty = (itemId: number, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14 w-full">
        
        {/* Hero Promotional Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-2xl p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-amber-300">
              <Sparkles size={14} /> Mega Savings Festival
            </div>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              Farm Fresh Daily Groceries <br />
              <span className="text-amber-300">Delivered in 30 Mins</span>
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Order fresh organic vegetables, juicy fruits, dairy, and household essentials directly from local certified stores.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/popular-products"
                className="bg-white text-emerald-800 hover:bg-emerald-50 font-black px-8 py-3.5 rounded-2xl text-sm shadow-lg shadow-black/10 transition-all transform active:scale-95 flex items-center gap-2"
              >
                <span>Shop Deals Now</span>
                <ArrowRight size={18} />
              </Link>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-100 bg-black/20 backdrop-blur-md px-4 py-3 rounded-2xl">
                <Clock size={16} className="text-amber-300" />
                <span>30 Mins Express Guarantee</span>
              </div>
            </div>
          </div>

          <div className="relative w-72 sm:w-96 h-64 sm:h-80 z-10 flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
              alt="Fresh Groceries Basket"
              fill
              className="object-cover rounded-2xl shadow-2xl border-4 border-white/20"
              priority
            />
          </div>
        </section>

        {/* Categories Carousel / Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Shop by Category</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Explore our handpicked organic and pantry categories</p>
            </div>
            <Link
              href="/category"
              className="text-xs sm:text-sm font-bold text-[#0aad0a] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => {
              const catCount = PRODUCTS_CATALOG.filter((p) => p.category === cat.slug).length;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#1e2632] border border-gray-100 dark:border-gray-800 hover:border-[#0aad0a]/40 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform shadow-inner`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#0aad0a] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-gray-400 mt-0.5">{catCount} {catCount === 1 ? 'Item' : 'Items'}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Deal of the Day Banner Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white flex items-center justify-between shadow-lg">
            <div className="space-y-2 max-w-xs z-10">
              <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-[11px] font-black uppercase">
                <Flame size={14} /> Deal of the Day
              </span>
              <h3 className="text-2xl font-black">Organic Fresh Fruits Flat 30% OFF</h3>
              <p className="text-xs text-amber-100">Handpicked apples, berries, bananas & citrus fruits</p>
              <Link
                href="/category/fruits"
                className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 text-xs font-black px-4 py-2 rounded-xl mt-2 transition-transform active:scale-95"
              >
                <span>Shop Fruits</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="relative w-36 h-36 flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400"
                alt="Fruits Deal"
                fill
                className="object-cover rounded-2xl shadow-md border-2 border-white/30"
              />
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white flex items-center justify-between shadow-lg">
            <div className="space-y-2 max-w-xs z-10">
              <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-[11px] font-black uppercase">
                <Percent size={14} /> Daily Special
              </span>
              <h3 className="text-2xl font-black">Pure Dairy & Fresh Farm Eggs</h3>
              <p className="text-xs text-blue-100">Organic milk, cheeses, butter & farm fresh eggs</p>
              <Link
                href="/category/dairy"
                className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-black px-4 py-2 rounded-xl mt-2 transition-transform active:scale-95"
              >
                <span>Shop Dairy</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="relative w-36 h-36 flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400"
                alt="Dairy Deal"
                fill
                className="object-cover rounded-2xl shadow-md border-2 border-white/30"
              />
            </div>
          </div>
        </section>

        {/* Popular Products Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Popular Daily Essentials</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Top-selling fresh items loved by our customers</p>
            </div>
            <Link
              href="/popular-products"
              className="text-xs sm:text-sm font-bold text-[#0aad0a] hover:underline flex items-center gap-1"
            >
              <span>See All Items</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {POPULAR_PRODUCTS.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                name={prod.name}
                slug={prod.slug}
                image={prod.image}
                rating={prod.rating}
                rating_count={prod.rating_count}
                variants={prod.variants}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        {/* Certified Local Stores / Vendors Spotlight */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Featured Local Vendors</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Certified stores delivering in your area</p>
            </div>
            <Link
              href="/sellers"
              className="text-xs sm:text-sm font-bold text-[#0aad0a] hover:underline flex items-center gap-1"
            >
              <span>All Stores</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_SELLERS.map((store) => (
              <Link
                key={store.id}
                href={`/category?category=${store.slug}`}
                className="group relative rounded-2xl bg-white dark:bg-[#1e2632] border border-gray-100 dark:border-gray-800 p-5 hover:shadow-xl hover:border-[#0aad0a]/40 transition-all duration-300 flex items-center gap-4"
              >
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={store.image}
                    alt={store.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-1">
                    <span>★ {store.rating}</span>
                    <span className="text-gray-400">• {store.products}</span>
                  </div>
                  <h4 className="font-black text-sm text-gray-900 dark:text-white truncate group-hover:text-[#0aad0a] transition-colors">
                    {store.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{store.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter / App Download Banner */}
        <section className="rounded-3xl bg-gray-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl z-10">
            <h3 className="text-2xl sm:text-3xl font-black">
              Get ₦5,000 Off Your First Order!
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Subscribe to our newsletter for exclusive weekly discounts, organic seasonal deals, and new store arrivals.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md pt-2">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl text-xs sm:text-sm flex-1 focus:outline-none focus:border-[#0aad0a]"
              />
              <button
                type="submit"
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-400">Available on</p>
              <p className="text-sm font-black text-white">iOS & Android</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#0aad0a] flex items-center justify-center text-white font-black text-2xl shadow-lg">
              <Store size={32} />
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((item) => item.id !== id))}
      />
    </div>
  );
}
