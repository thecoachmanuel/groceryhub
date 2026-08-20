'use client';

import { useState, useEffect } from 'react';
import { Flame, Plus, Search, RefreshCw, CheckCircle2, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Image from 'next/image';
import { formatNaira } from '@/lib/currency';

interface DealProduct {
  _id: string;
  product_id: number;
  name: string;
  image: string;
  is_deal_of_the_day: boolean;
  category: string;
  rating: number;
  variants?: any[];
  price?: number;
  discounted_price?: number;
}

export default function AdminDealOfTheDayPage() {
  const [products, setProducts] = useState<DealProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDealsOnly, setFilterDealsOnly] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = filterDealsOnly
        ? '/api/admin/deal-of-day?deals_only=true'
        : '/api/admin/deal-of-day';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      }
    } catch (err) {
      console.warn('Error fetching deal of the day products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterDealsOnly]);

  const toggleDealStatus = async (item: DealProduct) => {
    setUpdatingId(item._id);
    try {
      const newStatus = !item.is_deal_of_the_day;
      const res = await fetch('/api/admin/deal-of-day', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: item._id, is_deal_of_the_day: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setProducts(prev =>
          prev.map(p => (p._id === item._id ? { ...p, is_deal_of_the_day: newStatus } : p))
        );
      } else {
        alert(json.message || 'Failed to update deal status');
      }
    } catch (err) {
      console.error('Error toggling deal status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = products.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dealCount = products.filter(p => p.is_deal_of_the_day).length;

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Flame size={24} className="text-amber-500" /> Deal of the Day Manager
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Select products to showcase in the featured "Deal of the Day 🔥" section on mobile app and storefront
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterDealsOnly(!filterDealsOnly)}
              className={`text-xs font-bold px-4 py-2.5 rounded-2xl border transition-all ${
                filterDealsOnly
                  ? 'bg-amber-950/60 border-amber-500 text-amber-400'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              🔥 Active Deals ({dealCount})
            </button>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2.5 rounded-2xl flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search product name or category..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No products found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Product</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Price</th>
                    <th className="pb-3 px-3">Deal Status</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map(p => {
                    const price = p.variants?.[0]?.price || p.price || 0;
                    const discounted = p.variants?.[0]?.discounted_price || p.discounted_price || price;
                    return (
                      <tr key={p._id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0 border border-gray-700">
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-white text-xs">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 capitalize text-gray-400">{p.category || 'General'}</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                          {formatNaira(discounted)}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              p.is_deal_of_the_day
                                ? 'bg-amber-950/60 text-amber-400 border border-amber-700/50'
                                : 'bg-gray-800 text-gray-400'
                            }`}
                          >
                            {p.is_deal_of_the_day ? '🔥 Deal Active' : 'Regular Item'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => toggleDealStatus(p)}
                            disabled={updatingId === p._id}
                            className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition-all ${
                              p.is_deal_of_the_day
                                ? 'bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-800/40'
                                : 'bg-[#0aad0a] text-white hover:bg-[#088f08]'
                            }`}
                          >
                            {updatingId === p._id ? 'Updating...' : p.is_deal_of_the_day ? 'Remove Deal' : 'Make Deal of Day'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
