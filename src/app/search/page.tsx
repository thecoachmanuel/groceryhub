'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import ProductCard from '@/components/website/ProductCard';
import CartDrawer, { CartItem } from '@/components/website/CartDrawer';
import { PRODUCTS_CATALOG } from '@/lib/catalog';

const ALL_SEARCH_PRODUCTS = PRODUCTS_CATALOG;

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState('popular');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (variantId: number, qty: number) => {
    let matchedProduct: any = null;
    let matchedVariant: any = null;

    for (const p of ALL_SEARCH_PRODUCTS) {
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

  const matched = ALL_SEARCH_PRODUCTS.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  }).sort((a, b) => {
    if (sortBy === 'price-low') {
      const priceA = a.variants[0]?.discounted_price || a.variants[0]?.price || 0;
      const priceB = b.variants[0]?.discounted_price || b.variants[0]?.price || 0;
      return priceA - priceB;
    }
    if (sortBy === 'price-high') {
      const priceA = a.variants[0]?.discounted_price || a.variants[0]?.price || 0;
      const priceB = b.variants[0]?.discounted_price || b.variants[0]?.price || 0;
      return priceB - priceA;
    }
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.rating_count - a.rating_count;
  });

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Link href="/" className="hover:text-[#0aad0a] flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Search Results</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {searchTerm ? `Results for "${searchTerm}"` : 'All Products'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Found {matched.length} item{matched.length === 1 ? '' : 's'} matching your search
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <ArrowUpDown size={14} /> Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-700 text-xs font-bold rounded-xl px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#0aad0a]"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {matched.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {matched.map((prod) => (
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
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#1e2632] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 space-y-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              No matching groceries found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Try searching with different keywords like &quot;apples&quot;, &quot;broccoli&quot;, &quot;milk&quot;, or &quot;bread&quot;.
            </p>
            <div className="pt-2">
              <Link
                href="/category"
                className="inline-flex items-center gap-1.5 bg-[#0aad0a] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        )}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
