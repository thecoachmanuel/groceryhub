'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowUpDown, 
  Sparkles,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import ProductCard from '@/components/website/ProductCard';
import CartDrawer, { CartItem } from '@/components/website/CartDrawer';

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

export default function CategoryDetailsPage({ params }: { params?: { slug?: string } }) {
  const routerParams = useParams();
  const rawSlug = (params?.slug || (routerParams?.slug as string) || 'all');
  const slug = String(rawSlug).toLowerCase();

  const categoryMeta = CATEGORY_MAP[slug] || {
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    desc: 'Browse quality items in this collection with express delivery.',
    icon: '🛒',
  };

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
      console.warn('Failed to load category products:', err);
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
  }, [slug]);

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

  const filteredProducts = products.filter((p) => {
    if (slug === 'all') return true;
    return (p.category || '').toLowerCase().includes(slug.toLowerCase());
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
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <Link href="/" className="hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <span>/</span>
          <Link href="/category" className="hover:text-[#0aad0a]">Categories</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white capitalize">{categoryMeta.title}</span>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-[#0aad0a] rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-3xl">{categoryMeta.icon}</span>
            <h1 className="text-2xl sm:text-4xl font-black">{categoryMeta.title}</h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
              {categoryMeta.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs font-bold shrink-0">
            <span>{filteredProducts.length} Products Available</span>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500">
            Showing {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
          </p>

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

        {/* Grid */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
            <p className="text-xs text-gray-400">Loading products from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
            <ShoppingBag size={40} className="mx-auto text-gray-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">No products in this category yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {products.length === 0
                ? 'No products found in the database. Add products from the Admin Hub.'
                : 'No items found matching this category.'}
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
