'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Store, Star, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

const SELLERS = [
  {
    id: 1,
    name: 'Green Valley Organic Farms',
    city: 'Downtown Zone, New York',
    rating: 4.9,
    ratingCount: 340,
    products: '240 Products',
    deliveryTime: '25 Mins',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500',
    tags: ['Organic Certified', 'Fresh Veggies', 'Farm Direct'],
  },
  {
    id: 2,
    name: 'Daily Dairy & Poultry Fresh',
    city: 'Westside Market, New York',
    rating: 4.8,
    ratingCount: 210,
    products: '180 Products',
    deliveryTime: '20 Mins',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=500',
    tags: ['Pure Whole Milk', 'Farm Eggs', 'Artisan Cheeses'],
  },
  {
    id: 3,
    name: 'The Artisanal Bakery Co.',
    city: 'East Midtown, New York',
    rating: 4.9,
    ratingCount: 185,
    products: '95 Products',
    deliveryTime: '30 Mins',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    tags: ['Fresh Sourdough', 'Gluten Free', 'Artisan Pastries'],
  },
  {
    id: 4,
    name: 'Sunny Orchards Fruit Market',
    city: 'Brooklyn Heights, New York',
    rating: 4.9,
    ratingCount: 290,
    products: '120 Products',
    deliveryTime: '25 Mins',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500',
    tags: ['Imported Fruits', 'Local Apples', 'Berries & Melons'],
  },
];

export default function SellersPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb & Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Link href="/" className="hover:text-[#0aad0a] flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Local Stores</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] px-3 py-1 rounded-full text-xs font-black uppercase">
              <Store size={14} /> Certified Vendor Network
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white">
            Certified Local Grocery Stores
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            Order directly from authorized neighborhood farms, dairy outlets, and bakeries with 30-minute hyper-local delivery.
          </p>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SELLERS.map((store) => (
            <div
              key={store.id}
              className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#0aad0a]/40 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center group"
            >
              <div className="relative w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star size={14} fill="currentColor" />
                    <span>{store.rating}</span>
                    <span className="text-gray-400">({store.ratingCount})</span>
                  </div>
                  <span className="bg-[#0aad0a]/10 text-[#0aad0a] text-[11px] font-black px-2.5 py-0.5 rounded-full">
                    {store.deliveryTime}
                  </span>
                </div>

                <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-[#0aad0a] transition-colors">
                  {store.name}
                </h3>

                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin size={13} className="text-[#0aad0a]" />
                  <span>{store.city}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {store.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/popular-products`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0aad0a] hover:underline"
                  >
                    <span>Visit Store Catalog ({store.products})</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
