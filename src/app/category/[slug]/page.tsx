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

const CATEGORY_MAP: Record<string, { title: string; desc: string; icon: string }> = {
  vegetables: {
    title: 'Fresh Vegetables & Greens',
    desc: 'Crisp organic veggies, farm-fresh leafy greens, and culinary herbs delivered within 30 minutes.',
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
    desc: 'Crunchy potato crisps, roasted nuts, gourmet popcorn, cookies, and chocolate delights.',
    icon: '🍿',
  },
  pantry: {
    title: 'Pantry & Cooking Essentials',
    desc: 'Cold-pressed oils, premium grains, pulses, aromatic spices, and cooking ingredients.',
    icon: '🍚',
  },
};

const ALL_CATEGORY_PRODUCTS = [
  {
    id: 1,
    name: 'Fresh Organic Farm Broccoli',
    slug: 'fresh-organic-broccoli',
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500',
    rating: 4.9,
    rating_count: 145,
    variants: [
      { id: 101, title: '500 g', price: 4.99, discounted_price: 3.49, stock: 45, unit: '500 g' },
      { id: 102, title: '1 kg', price: 8.99, discounted_price: 6.49, stock: 30, unit: '1 kg' },
    ],
  },
  {
    id: 6,
    name: 'Organic Baby Spinach (Pre-washed)',
    slug: 'organic-baby-spinach',
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
    rating: 4.8,
    rating_count: 115,
    variants: [
      { id: 110, title: '250 g Tub', price: 3.49, discounted_price: 2.79, stock: 60, unit: '250 g' },
    ],
  },
  {
    id: 2,
    name: 'Red Sweet Crisp Apples (Washington)',
    slug: 'red-sweet-apples',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
    rating: 4.8,
    rating_count: 98,
    variants: [
      { id: 103, title: '1 kg', price: 5.99, discounted_price: 4.29, stock: 50, unit: '1 kg' },
      { id: 104, title: '2 kg Pack', price: 10.99, discounted_price: 7.99, stock: 20, unit: '2 kg' },
    ],
  },
  {
    id: 5,
    name: 'Fresh Ripe Hass Avocados',
    slug: 'fresh-hass-avocados',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500',
    rating: 5.0,
    rating_count: 220,
    variants: [
      { id: 108, title: 'Pack of 3', price: 6.99, discounted_price: 4.99, stock: 35, unit: '3 pcs' },
      { id: 109, title: 'Pack of 6', price: 12.99, discounted_price: 8.99, stock: 25, unit: '6 pcs' },
    ],
  },
  {
    id: 7,
    name: 'Fresh Juicy Strawberries (Local Farm)',
    slug: 'fresh-strawberries',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500',
    rating: 4.9,
    rating_count: 190,
    variants: [
      { id: 111, title: '400 g Box', price: 5.49, discounted_price: 3.99, stock: 40, unit: '400 g' },
    ],
  },
  {
    id: 3,
    name: 'Farm Fresh Pure Whole Milk',
    slug: 'farm-fresh-milk',
    category: 'dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500',
    rating: 4.9,
    rating_count: 310,
    variants: [
      { id: 105, title: '1 Gallon', price: 4.49, discounted_price: 3.89, stock: 100, unit: '1 Gallon' },
      { id: 106, title: '2 Gallons Bundle', price: 8.49, discounted_price: 6.99, stock: 40, unit: 'Bundle' },
    ],
  },
  {
    id: 4,
    name: 'Artisan Sourdough Bakery Bread',
    slug: 'artisan-sourdough-bread',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    rating: 4.7,
    rating_count: 84,
    variants: [
      { id: 107, title: 'Standard Loaf (400g)', price: 3.99, discounted_price: 2.99, stock: 15, unit: '400g' },
    ],
  },
  {
    id: 8,
    name: 'Pure Cold Pressed Extra Virgin Olive Oil',
    slug: 'extra-virgin-olive-oil',
    category: 'pantry',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
    rating: 4.9,
    rating_count: 165,
    variants: [
      { id: 112, title: '500 ml Bottle', price: 14.99, discounted_price: 11.49, stock: 25, unit: '500 ml' },
    ],
  },
];

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

    for (const p of ALL_CATEGORY_PRODUCTS) {
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

  const filteredProducts = ALL_CATEGORY_PRODUCTS.filter((p) =>
    p.category === slug || slug === 'all'
  ).sort((a, b) => {
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
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
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
            <Link href="/category" className="hover:text-[#0aad0a]">
              Categories
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white capitalize">{categoryMeta.title}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-3xl mb-1">{categoryMeta.icon}</div>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white">
                {categoryMeta.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                {categoryMeta.desc}
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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((prod) => (
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
          <div className="text-center py-16 bg-white dark:bg-[#1e2632] rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
            <span className="text-4xl">🥦</span>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mt-3">
              No products found in this category
            </h3>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              We are updating inventory for this category shortly.
            </p>
            <Link
              href="/category"
              className="inline-flex items-center gap-1.5 bg-[#0aad0a] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
            >
              Browse All Categories
            </Link>
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
