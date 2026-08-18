'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Layers, 
  ChevronRight
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import CartDrawer, { CartItem } from '@/components/website/CartDrawer';

const DEFAULT_CATEGORIES = [
  {
    id: 'vegetables',
    name: 'Vegetables & Greens',
    slug: 'vegetables',
    icon: '🥬',
    description: 'Fresh organic veggies, root vegetables, mushrooms, and exotic herbs picked fresh daily.',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-800',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
    subcategories: ['Leafy Greens', 'Root Vegetables', 'Onions & Potatoes', 'Exotic & Organic', 'Mushrooms'],
  },
  {
    id: 'fruits',
    name: 'Fresh Seasonal Fruits',
    slug: 'fruits',
    icon: '🍎',
    description: 'Sweet apples, tropical mangoes, fresh berries, citrus fruits, and imported delicacies.',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500',
    subcategories: ['Apples & Pears', 'Citrus Fruits', 'Berries & Melons', 'Bananas & Tropical', 'Seasonal Combos'],
  },
  {
    id: 'dairy',
    name: 'Dairy, Eggs & Butter',
    slug: 'dairy',
    icon: '🥛',
    description: 'Pure whole milk, farm eggs, artisanal cheeses, organic butter, yogurts, and cream.',
    color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-200 dark:border-blue-800',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=500',
    subcategories: ['Milk & Cream', 'Farm Fresh Eggs', 'Artisan Cheeses', 'Butter & Ghee', 'Yogurt & Curd'],
  },
  {
    id: 'bakery',
    name: 'Bakery & Fresh Breads',
    slug: 'bakery',
    icon: '🍞',
    description: 'Freshly baked sourdoughs, sandwich loaves, gluten-free bakes, buns, and breakfast treats.',
    color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 border-orange-200 dark:border-orange-800',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    subcategories: ['Sourdough & Artisanal', 'Sandwich Breads', 'Buns & Rolls', 'Cakes & Pastries', 'Gluten Free Bakes'],
  },
  {
    id: 'beverages',
    name: 'Cold Drinks & Beverages',
    slug: 'beverages',
    icon: '🧃',
    description: 'Cold-pressed natural juices, iced teas, organic coffee, health drinks, and mineral water.',
    color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 border-purple-200 dark:border-purple-800',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500',
    subcategories: ['Cold Pressed Juices', 'Mineral Water', 'Iced Teas & Coffees', 'Energy Drinks', 'Soft Drinks'],
  },
  {
    id: 'snacks',
    name: 'Snacks & Munchies',
    slug: 'snacks',
    icon: '🍿',
    description: 'Crunchy plantain chips, roasted cashews, gourmet popcorn, cookies, and chocolate treats.',
    color: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 border-pink-200 dark:border-pink-800',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500',
    subcategories: ['Plantain & Potato Chips', 'Roasted Nuts & Seeds', 'Chocolates & Candies', 'Cookies & Biscuits', 'Popcorn'],
  },
  {
    id: 'pantry',
    name: 'Pantry & Cooking Essentials',
    slug: 'pantry',
    icon: '🍚',
    description: 'Cold-pressed oils, premium Nigerian rice, grains, pulses, aromatic spices, and sauces.',
    color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 border-teal-200 dark:border-teal-800',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
    subcategories: ['Rice & Grains', 'Cooking Oils & Ghee', 'Spices & Masalas', 'Pulses & Dal', 'Flours & Atta'],
  },
];

export default function CategoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch('/api/products');
        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.data)) {
          setProducts(prodJson.data);
        } else {
          setProducts([]);
        }

        const catRes = await fetch('/api/admin/categories');
        const catJson = await catRes.json();
        if (catJson.success && Array.isArray(catJson.data) && catJson.data.length > 0) {
          const dbCats = catJson.data.map((c: any) => ({
            id: c._id,
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            icon: c.icon || '📦',
            description: `Browse all items under ${c.name}`,
            color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-800',
            image: c.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
            subcategories: ['All Products', 'Featured Items'],
          }));
          setCategories(dbCats);
        }
      } catch (err) {
        console.warn('Failed to load category page data:', err);
      }
    };

    fetchData();

    const handleUpdate = () => fetchData();
    if (typeof window !== 'undefined') {
      window.addEventListener('groceryhub_catalog_updated', handleUpdate);
      return () => window.removeEventListener('groceryhub_catalog_updated', handleUpdate);
    }
  }, []);

  const getProductCountForCat = (slug: string) => {
    return products.filter((p) => (p.category || '').toLowerCase().includes(slug.toLowerCase())).length;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Link href="/" className="hover:text-[#0aad0a] flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Store
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">All Categories</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] px-3 py-1 rounded-full text-xs font-black uppercase mb-2">
                <Layers size={14} /> Comprehensive Catalog
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                Explore All Categories
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
                Browse our live catalog of farm fresh vegetables, fruits, dairy, bakery, and pantry staples.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = getProductCountForCat(cat.slug);
            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#0aad0a]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Image + Icon */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center text-2xl shadow-inner`}>
                      {cat.icon}
                    </div>
                  </div>

                  {/* Details */}
                  <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-[#0aad0a] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="inline-block text-xs font-bold text-[#0aad0a] mt-0.5 mb-2">
                    {count} {count === 1 ? 'Product Available' : 'Products Available'}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Subcategories tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cat.subcategories.map((sub: string, i: number) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <Link
                  href={`/category/${cat.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#0aad0a]/10 hover:bg-[#0aad0a] text-[#0aad0a] hover:text-white text-xs font-bold py-3 rounded-2xl transition-all shadow-sm active:scale-98"
                >
                  <span>Browse {cat.name}</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={(id, q) => setCartItems(cartItems.map((c) => (c.id === id ? { ...c, quantity: q } : c)))}
        onRemoveItem={(id) => setCartItems(cartItems.filter((c) => c.id !== id))}
      />
    </div>
  );
}
