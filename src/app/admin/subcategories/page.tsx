'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Search, Trash2, Edit3, X, Filter } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface SubcategoryItem {
  _id?: string;
  name: string;
  slug: string;
  parent_id?: string;
  parent_name?: string;
  status: 'Active' | 'Hidden';
}

export default function AdminSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [slug, setSlug] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        const allCats = data.categories || [];
        setCategories(allCats);
        // Filter subcategories (items that have parent_id)
        const subs = allCats.filter((c: any) => c.parent_id);
        const mappedSubs = subs.map((s: any) => {
          const p = allCats.find((c: any) => String(c._id) === String(s.parent_id));
          return {
            _id: s._id,
            name: s.name,
            slug: s.slug,
            parent_id: s.parent_id,
            parent_name: p ? p.name : 'Parent Category',
            status: s.status || 'Active',
          };
        });
        setSubcategories(mappedSubs);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Subcategory name is required');

    try {
      const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: finalSlug,
          parent_id: parentId || null,
          status: 'Active',
        }),
      });
      setShowAddModal(false);
      setName('');
      setSlug('');
      fetchCategoriesData();
    } catch (err) {
      console.error('Error creating subcategory:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      fetchCategoriesData();
    } catch (err) {
      console.error('Error deleting subcategory:', err);
    }
  };

  const filtered = subcategories.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
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
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading subcategories...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No subcategories found. Click Add Subcategory to create one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Subcategory</th>
                    <th className="pb-3 px-3">Parent Category</th>
                    <th className="pb-3 px-3">Slug</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white text-sm">{s.name}</td>
                      <td className="py-3 px-3">
                        <span className="bg-gray-800 text-gray-200 px-2.5 py-1 rounded-lg font-bold">
                          {s.parent_name}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 font-mono">/{s.slug}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/40 text-[#0aad0a]">
                          ● {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => s._id && handleDelete(s._id)}
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
          )}
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
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="">Select Parent Category</option>
                  {categories
                    .filter((c: any) => !c.parent_id)
                    .map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
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
