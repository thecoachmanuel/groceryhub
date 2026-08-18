'use client';

import { useState } from 'react';
import { Tag, Plus, Search, Trash2, Edit3, CheckCircle2, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface TagItem {
  id: number;
  name: string;
  slug: string;
  color: string;
  productsCount: number;
  status: 'Active' | 'Inactive';
}

const INITIAL_TAGS: TagItem[] = [
  { id: 1, name: '100% Organic', slug: 'organic', color: '#0aad0a', productsCount: 142, status: 'Active' },
  { id: 2, name: 'Gluten-Free', slug: 'gluten-free', color: '#f59e0b', productsCount: 56, status: 'Active' },
  { id: 3, name: 'Sugar-Free', slug: 'sugar-free', color: '#3b82f6', productsCount: 38, status: 'Active' },
  { id: 4, name: 'Flash Deal', slug: 'flash-deal', color: '#ef4444', productsCount: 24, status: 'Active' },
  { id: 5, name: 'Farm Fresh Direct', slug: 'farm-direct', color: '#10b981', productsCount: 95, status: 'Active' },
  { id: 6, name: 'Best Seller', slug: 'best-seller', color: '#8b5cf6', productsCount: 68, status: 'Active' },
];

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#0aad0a');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [searchQuery, setSearchQuery] = useState('');

  const openCreateModal = () => {
    setEditingTag(null);
    setName('');
    setSlug('');
    setColor('#0aad0a');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (t: TagItem) => {
    setEditingTag(t);
    setName(t.name);
    setSlug(t.slug);
    setColor(t.color);
    setStatus(t.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Tag name is required');

    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

    if (editingTag) {
      setTags((prev) =>
        prev.map((t) =>
          t.id === editingTag.id
            ? { ...t, name, slug: finalSlug, color, status }
            : t
        )
      );
    } else {
      const newTag: TagItem = {
        id: Date.now(),
        name,
        slug: finalSlug,
        color,
        productsCount: 0,
        status,
      };
      setTags([newTag, ...tags]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product badge tag?')) {
      setTags((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setTags((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } : t
      )
    );
  };

  const filtered = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Tag size={24} className="text-[#0aad0a]" /> Product Badges & Dietary Tags
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage product badge tags for organic attributes, dietary preferences, and promo labels
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Create New Tag</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tag name or slug..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Badge Label</th>
                  <th className="pb-3 px-3">Slug</th>
                  <th className="pb-3 px-3">Color Accent</th>
                  <th className="pb-3 px-3">Tagged Items</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <span
                        className="font-bold px-3 py-1 rounded-lg text-xs border"
                        style={{
                          backgroundColor: `${t.color}15`,
                          borderColor: `${t.color}40`,
                          color: t.color,
                        }}
                      >
                        {t.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 font-mono text-xs">#{t.slug}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: t.color }}
                        />
                        <span className="font-mono text-gray-300">{t.color}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">{t.productsCount} products</td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(t.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          t.status === 'Active'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        ● {t.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit Tag"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                          title="Delete Tag"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">{editingTag ? 'Edit Badge Tag' : 'Create Badge Tag'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set badge text, slug identifier, and theme color
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Tag Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingTag) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="e.g. 100% Organic"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. organic"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Badge Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                    />
                  </div>
                </div>
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

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingTag ? 'Save Badge Tag' : 'Publish Badge Tag'}
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
