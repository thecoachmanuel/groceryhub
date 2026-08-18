'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Store, Star, MapPin, ChevronRight } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

export default function SellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sellers');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setSellers(json.data);
      } else {
        // Fallback to brands if no sellers
        const brandRes = await fetch('/api/admin/brands');
        const brandJson = await brandRes.json();
        if (brandJson.success && Array.isArray(brandJson.data)) {
          setSellers(brandJson.data.map((b: any) => ({
            id: b._id,
            name: b.name,
            store_name: b.name,
            city: 'Lagos, Nigeria',
            rating: 4.9,
            ratingCount: 120,
            slug: b.slug,
            image: b.logo || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500',
            tags: ['Certified Brand', 'Authorized Vendor'],
          })));
        } else {
          setSellers([]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch vendors:', err);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

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
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
            <p className="text-xs text-gray-400">Loading local vendors from database...</p>
          </div>
        ) : sellers.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
            <Store size={40} className="mx-auto text-gray-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">No registered vendors yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No vendor accounts registered in the database. Vendors added from the Admin Hub will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sellers.map((store) => (
              <div
                key={store._id || store.id}
                className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#0aad0a]/40 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center group"
              >
                <div className="relative w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <Image
                    src={store.image || store.logo || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500'}
                    alt={store.name || store.store_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star size={14} fill="currentColor" />
                      <span>{store.rating || 4.9}</span>
                      <span className="text-gray-400">({store.ratingCount || 100})</span>
                    </div>
                    <span className="bg-[#0aad0a]/10 text-[#0aad0a] text-[11px] font-black px-2.5 py-0.5 rounded-full">
                      25 Mins
                    </span>
                  </div>

                  <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-[#0aad0a] transition-colors">
                    {store.store_name || store.name}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin size={13} className="text-[#0aad0a]" />
                    <span>{store.city || 'Lagos, Nigeria'}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(store.tags || ['Verified Vendor', 'Express Delivery']).map((tag: string, i: number) => (
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
                      href={`/category?category=${store.slug || 'all'}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0aad0a] hover:underline"
                    >
                      <span>Visit Vendor Catalog</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
