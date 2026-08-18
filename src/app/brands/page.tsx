'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, ArrowLeft, Search, CheckCircle2, ChevronRight } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

const ALL_BRANDS = [
  { id: 1, name: 'Organic Valley', slug: 'organic-valley', items: 42, description: '100% certified organic dairy, whole milk, butter, and farm cheeses.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' },
  { id: 2, name: 'Green Farm Estates', slug: 'green-farm', items: 28, description: 'Fresh pesticide-free leafy greens, vine tomatoes, and crisp root veggies.', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400' },
  { id: 3, name: 'Pure Daily Organics', slug: 'pure-daily', items: 19, description: 'Free-range brown eggs, artisanal yogurts, and natural dairy spreads.', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400' },
  { id: 4, name: 'Artisan Bakers Guild', slug: 'artisan-bakers', items: 14, description: 'Slow-fermented sourdoughs, whole grain baguettes, and fresh croissants.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { id: 5, name: 'Nature Sweet Orchards', slug: 'nature-sweet', items: 35, description: 'Hand-picked crisp apples, citrus fruits, and organic berries.', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400' },
  { id: 6, name: 'Golden Harvest Pantry', slug: 'golden-harvest', items: 22, description: 'Cold-pressed extra virgin olive oils, Himalayan salts, and whole spices.', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
];

export default function ShopByBrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ALL_BRANDS.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <Link href="/" className="text-xs font-bold text-gray-500 hover:text-[#0aad0a] flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Store
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Tag size={28} className="text-[#0aad0a]" /> Certified Brand Partners
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Shop directly from verified organic producers and trusted culinary brands
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brands..."
              className="w-full bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((brand) => (
            <Link
              key={brand.id}
              href={`/category?brand=${brand.slug}`}
              className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 hover:border-[#0aad0a]/40 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <Image src={brand.image} alt={brand.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-full text-white">
                    {brand.items} Items
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-[#0aad0a] transition-colors flex items-center gap-1.5">
                    {brand.name}
                    <CheckCircle2 size={15} className="text-[#0aad0a]" />
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {brand.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-bold text-[#0aad0a]">
                <span>Browse Catalog</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
