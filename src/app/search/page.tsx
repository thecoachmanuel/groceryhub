'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { useCart } from '@/context/CartContext';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  const formatProduct = (p: any) => {
    const pId = p.product_id || p.id || Math.floor(Math.random() * 10000);
    const rawPrice = typeof p.price === 'number' ? p.price : parseFloat(p.price || '3500') || 3500;
    const originalPrice = Math.round(rawPrice * 1.25);
    const variants = Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants.map((v: any, idx: number) => ({
          id: v.variant_id || v.id || pId + idx,
          title: v.title || 'Standard Pack',
          price: v.price || originalPrice,
          discounted_price: v.discounted_price || rawPrice,
          stock: v.stock ?? 50,
          unit: v.unit || '1 pack',
        }))
      : [
          {
            id: pId,
            title: 'Standard Pack',
            price: originalPrice,
            discounted_price: rawPrice,
            stock: p.stock ?? 50,
            unit: '1 pack',
          },
        ];

    return {
      id: pId,
      name: p.name || 'Grocery Item',
      slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${pId}`),
      category: p.category || 'vegetables',
      image: p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
      rating: p.rating || 4.9,
      rating_count: p.rating_count || p.ratingCount || 120,
      variants,
      description: p.description || p.name || '',
    };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data.map(formatProduct));
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn('Failed to search products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const handleUpdate = () => fetchProducts();
    if (typeof window !== 'undefined') {
      window.addEventListener('groceryhub_catalog_updated', handleUpdate);
      return () => window.removeEventListener('groceryhub_catalog_updated', handleUpdate);
    }
  }, []);

  const handleAddToCart = (variantId: number, qty: number) => {
    let matchedProduct: any = null;
    let matchedVariant: any = null;

    for (const p of products) {
      const v = p.variants?.find((item: any) => item.id === variantId);
      if (v) {
        matchedProduct = p;
        matchedVariant = v;
        break;
      }
    }

    if (!matchedProduct || !matchedVariant) return;

    if (qty <= 0) {
      removeFromCart(matchedVariant.id);
    } else {
      addToCart({
        id: matchedVariant.id,
        product_id: matchedProduct.id,
        name: `${matchedProduct.name} (${matchedVariant.title})`,
        price: matchedVariant.discounted_price || matchedVariant.price,
        image: matchedProduct.image,
        unit: matchedVariant.title,
      }, qty - (cartItems.find((i: any) => String(i.id) === String(matchedVariant.id))?.quantity || 0));
    }

    if (qty > 0 && !isCartOpen) {
      setIsCartOpen(true);
    }
  };

  const handleUpdateQty = (itemId: number | string, newQty: number) => {
    updateQuantity(itemId, newQty);
  };

  const matched = products.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q)
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
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.rating_count || 0) - (a.rating_count || 0);
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
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
            <p className="text-xs text-gray-400">Searching products from database...</p>
          </div>
        ) : matched.length > 0 ? (
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
              {products.length === 0
                ? 'No products in database yet. Add products via the Admin Hub to see them here.'
                : 'Try searching with different keywords.'}
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
        onUpdateQty={(id, qty) => updateQuantity(id, qty)}
        onRemoveItem={(id) => removeFromCart(id)}
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
