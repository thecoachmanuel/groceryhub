'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import ProductCard from '@/components/website/ProductCard';
import CartDrawer, { CartItem } from '@/components/website/CartDrawer';

const CATEGORIES = [
  { id: 'all', label: 'All Popular' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fresh Fruits' },
  { id: 'dairy', label: 'Dairy & Eggs' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'pantry', label: 'Pantry Staples' },
];

import { useCart } from '@/context/CartContext';

export default function PopularProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
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
      console.warn('Failed to load products:', err);
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
      }, qty - (cartItems.find(i => String(i.id) === String(matchedVariant.id))?.quantity || 0));
    }

    setIsCartOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return (p.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.variants[0]?.discounted_price || 0) - (b.variants[0]?.discounted_price || 0);
    if (sortBy === 'price-high') return (b.variants[0]?.discounted_price || 0) - (a.variants[0]?.discounted_price || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.rating_count || 0) - (a.rating_count || 0);
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820] text-gray-900 dark:text-white">
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

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
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
            <p className="text-xs text-gray-400">Loading products from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
            <ShoppingBag size={40} className="mx-auto text-gray-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">No products found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {products.length === 0
                ? 'No products available in database yet. Admin can add products from the Admin Hub.'
                : 'No products match your selected category filter.'}
            </p>
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
        onUpdateQty={(id, q) => updateQuantity(id, q)}
        onRemoveItem={(id) => removeFromCart(id)}
      />
    </div>
  );
}
