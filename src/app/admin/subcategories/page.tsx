'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LayoutGrid, Plus, Search, Trash2, Edit3, X, Filter } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const INITIAL_SUBCATEGORIES = [
  { id: 1, name: 'Leafy Greens & Salad', parent: 'Vegetables', slug: 'leafy-greens', count: 32, status: 'Active', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300' },
  { id: 2, name: 'Root Vegetables', parent: 'Vegetables', slug: 'root-vegetables', count: 24, status: 'Active', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' },
  { id: 3, name: 'Citrus & Tropical Fruits', parent: 'Fruits', slug: 'citrus-fruits', count: 40, status: 'Active', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300' },
  { id: 4, name: 'Apples & Pears', parent: 'Fruits', slug: 'apples-pears', count: 28, status: 'Active', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300' },
  { id: 5, name: 'Artisan Cheeses', parent: 'Dairy & Eggs', slug: 'artisan-cheeses', count: 18, status: 'Active', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=300' },
  { id: 6, name: 'Sourdough & Baguettes', parent: 'Bakery', slug: 'sourdough-breads', count: 15, status: 'Active', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300' },
];

export default function AdminSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState(INITIAL_SUBCATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [parent, setParent] = useState('Vegetables');
  const [slug, setSlug] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentFilter, setSelectedParentFilter] = useState('all');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub = {
      id: Date.now(),
      name,
      parent,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
    };
    setSubcategories([newSub, ...subcategories]);
    setShowAddModal(false);
    setName('');
    setSlug('');
  };

  const filtered = subcategories.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.slug.includes(searchQuery);
    const matchesParent = selectedParentFilter === 'all' || s.parent.toLowerCase() === selectedParentFilter.toLowerCase();
    return matchesSearch && matchesParent;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <LayoutGrid size={24} className="text-[#0aad0a]" /> Subcategories Catalog
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage hierarchical product subcategories nested under primary departments</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Subcategory</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subcategory name or slug..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={selectedParentFilter}
              onChange={(e) => setSelectedParentFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="all">All Parent Categories</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="dairy & eggs">Dairy & Eggs</option>
              <option value="bakery">Bakery</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Subcategory</th>
                  <th className="pb-3 px-3">Parent Category</th>
                  <th className="pb-3 px-3">Slug</th>
                  <th className="pb-3 px-3">Products</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                          <Image src={s.image} alt={s.name} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-gray-800 text-gray-200 px-2.5 py-1 rounded-lg font-bold">
                        {s.parent}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400">/{s.slug}</td>
                    <td className="py-3 px-3 font-bold text-white">{s.count} items</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/40 text-[#0aad0a]">
                        ● {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white">
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setSubcategories(subcategories.filter((item) => item.id !== s.id))}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

            <h3 className="text-xl font-black">Add New Subcategory</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Parent Category</label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy & Eggs">Dairy & Eggs</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Pantry">Pantry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Subcategory Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="e.g. Organic Leafy Greens"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. organic-leafy-greens"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30"
                >
                  Create Subcategory
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
