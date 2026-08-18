'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Flame, Plus, Search, Trash2, Edit3, X, Clock } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const INITIAL_HIGHLIGHTS = [
  { id: 1, title: 'Organic Seasonal Fruits Flat 30% OFF', category: 'Fruits', discount: '30% OFF', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400', status: 'Active' },
  { id: 2, title: 'Pure Dairy & Fresh Farm Eggs', category: 'Dairy & Eggs', discount: '20% OFF', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400', status: 'Active' },
  { id: 3, title: 'Artisan Bakery Sourdough Special', category: 'Bakery', discount: 'Buy 1 Get 1', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', status: 'Active' },
];

export default function AdminHighlightsPage() {
  const [highlights, setHighlights] = useState(INITIAL_HIGHLIGHTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fruits');
  const [discount, setDiscount] = useState('25% OFF');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newH = {
      id: Date.now(),
      title,
      category,
      discount,
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
      status: 'Active',
    };
    setHighlights([newH, ...highlights]);
    setShowAddModal(false);
    setTitle('');
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Flame size={24} className="text-orange-500" /> Deal of the Day & Highlights
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage curated flash deals, special promos, and featured hero badges</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Deal Highlight</span>
          </button>
        </div>

        {/* Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((h) => (
            <div
              key={h.id}
              className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-4 hover:border-orange-500/40 transition-all group"
            >
              <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700">
                <Image src={h.image} alt={h.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {h.discount}
                </span>
                <span className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-full text-[#0aad0a]">
                  ● {h.status}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{h.category}</span>
                <h3 className="font-black text-sm text-white">{h.title}</h3>
              </div>

              <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Clock size={13} className="text-orange-400" />
                  <span>24h Flash Window</span>
                </div>

                <button
                  onClick={() => setHighlights(highlights.filter((item) => item.id !== h.id))}
                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black">Create Deal Highlight</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Highlight Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Farm Fresh Mangoes Flat 35% OFF"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Bakery">Bakery</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Discount Badge Text</label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="e.g. 30% OFF"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30"
                >
                  Publish Deal Highlight
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
