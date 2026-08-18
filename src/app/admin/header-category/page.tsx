'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  ArrowLeft
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface HeaderCategoryItem {
  _id?: string;
  name: string;
  category: string;
  icon?: string;
  order: number;
  status: 'Active' | 'Inactive';
}

export default function AdminHeaderCategoryPage() {
  const [headerCategories, setHeaderCategories] = useState<HeaderCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeaderCategoryItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const fetchHeaderCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/header-categories');
      const data = await res.json();
      if (data.success) {
        setHeaderCategories(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching header categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeaderCategories();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('');
    setOrder(headerCategories.length + 1);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (item: HeaderCategoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category || '');
    setOrder(item.order || 1);
    setStatus(item.status || 'Active');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Tile label is required');

    try {
      if (editingItem) {
        await fetch('/api/admin/header-categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem._id, name, category, order, status }),
        });
      } else {
        await fetch('/api/admin/header-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, category, order, status }),
        });
      }
      setIsModalOpen(false);
      fetchHeaderCategories();
    } catch (err) {
      console.error('Error saving header category:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this Header Category tile?')) return;
    try {
      await fetch(`/api/admin/header-categories?id=${id}`, { method: 'DELETE' });
      fetchHeaderCategories();
    } catch (err) {
      console.error('Error deleting header category:', err);
    }
  };

  const filtered = headerCategories.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin/categories" className="text-xs text-gray-400 hover:text-[#0aad0a] flex items-center gap-1">
                <ArrowLeft size={12} /> Back to Categories
              </Link>
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Layers size={24} className="text-[#0aad0a]" /> Storefront Header Categories
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Customize quick horizontal category chips and icons pinned to the top header of the customer web &amp; mobile apps
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Header Tile</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search header category tiles..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading header categories...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No header category tiles found. Click Add Header Tile to create one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Tile Label</th>
                    <th className="pb-3 px-3">Linked Category</th>
                    <th className="pb-3 px-3">Sort Order</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white text-sm">{item.name}</td>
                      <td className="py-3.5 px-3 text-gray-300">{item.category || '—'}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">#{item.order}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            item.status === 'Active'
                              ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          ● {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                            title="Edit Header Tile"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => item._id && handleDelete(item._id)}
                            className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                            title="Delete Header Tile"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">
                {editingItem ? 'Edit Header Category Tile' : 'Add Header Category Tile'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure quick tap icon and target category page
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Display Label</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vegetables"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Linked Catalog Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Fresh Fruits & Vegetables"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Sort Order</label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingItem ? 'Save Tile Updates' : 'Add Header Category'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
