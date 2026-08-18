'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  ArrowLeft,
  FolderPlus,
  Upload,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface GroupCategoryItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  categoriesCount: number;
  sortOrder: number;
  status: 'Active' | 'Hidden';
  description: string;
}

const INITIAL_GROUPS: GroupCategoryItem[] = [
  { 
    id: 1, 
    name: 'Farm Fresh Produce', 
    slug: 'farm-fresh-produce', 
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=60', 
    categoriesCount: 4, 
    sortOrder: 1, 
    status: 'Active', 
    description: 'Fresh fruits, organic vegetables, and leafy greens from local farms.' 
  },
  { 
    id: 2, 
    name: 'Dairy, Eggs & Cheese', 
    slug: 'dairy-eggs-cheese', 
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=200&auto=format&fit=crop&q=60', 
    categoriesCount: 3, 
    sortOrder: 2, 
    status: 'Active', 
    description: 'Fresh milk, artisanal cheeses, butter, and pasture-raised eggs.' 
  },
  { 
    id: 3, 
    name: 'Bakery & Morning Goods', 
    slug: 'bakery-morning-goods', 
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=60', 
    categoriesCount: 2, 
    sortOrder: 3, 
    status: 'Active', 
    description: 'Artisanal breads, croissants, muffins, and breakfast baked items.' 
  },
  { 
    id: 4, 
    name: 'Beverages & Cold Drinks', 
    slug: 'beverages-cold-drinks', 
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&auto=format&fit=crop&q=60', 
    categoriesCount: 5, 
    sortOrder: 4, 
    status: 'Active', 
    description: 'Organic cold juices, craft sodas, mineral waters, and energy drinks.' 
  }
];

export default function AdminGroupCategoryPage() {
  const [groups, setGroups] = useState<GroupCategoryItem[]>(INITIAL_GROUPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupCategoryItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState<'Active' | 'Hidden'>('Active');

  const openCreateModal = () => {
    setEditingGroup(null);
    setName('');
    setSlug('');
    setImage('https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60');
    setDescription('');
    setSortOrder(groups.length + 1);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (g: GroupCategoryItem) => {
    setEditingGroup(g);
    setName(g.name);
    setSlug(g.slug);
    setImage(g.image);
    setDescription(g.description);
    setSortOrder(g.sortOrder);
    setStatus(g.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Group name is required');

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingGroup) {
      setGroups(prev => prev.map(g => g.id === editingGroup.id ? {
        ...g,
        name,
        slug: generatedSlug,
        image,
        description,
        sortOrder,
        status
      } : g));
    } else {
      const newGroup: GroupCategoryItem = {
        id: Date.now(),
        name,
        slug: generatedSlug,
        image,
        categoriesCount: 0,
        sortOrder,
        status,
        description
      };
      setGroups([...groups, newGroup]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this Category Group?')) {
      setGroups(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, status: g.status === 'Active' ? 'Hidden' : 'Active' } : g));
  };

  const filtered = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.slug.toLowerCase().includes(searchQuery.toLowerCase())
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
              <FolderPlus size={24} className="text-[#0aad0a]" /> Group Categories
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage parent category groupings that cluster related product departments on mobile and web
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/header-category"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-colors"
            >
              <Layers size={14} /> Header Categories
            </Link>
            <button
              onClick={openCreateModal}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Create Group</span>
            </button>
          </div>
        </div>

        {/* Sub-nav banner */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/categories" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Categories Directory
          </Link>
          <Link href="/admin/group-category" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black">
            Group Categories ({groups.length})
          </Link>
          <Link href="/admin/header-category" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Header Categories
          </Link>
          <Link href="/admin/subcategories" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Subcategories
          </Link>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search group categories by name or slug..."
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
                  <th className="pb-3 px-3">Thumbnail</th>
                  <th className="pb-3 px-3">Group Name & Slug</th>
                  <th className="pb-3 px-3">Description</th>
                  <th className="pb-3 px-3">Linked Categories</th>
                  <th className="pb-3 px-3">Sort Order</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <img 
                        src={g.image} 
                        alt={g.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-700 bg-gray-900" 
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{g.name}</div>
                      <span className="text-[11px] text-[#0aad0a] font-mono font-semibold">/{g.slug}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 max-w-xs truncate">
                      {g.description || '—'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-gray-800 px-2.5 py-1 rounded-lg text-white font-bold text-[11px]">
                        {g.categoriesCount} Categories
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      #{g.sortOrder}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(g.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          g.status === 'Active'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        ● {g.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(g)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit Group"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                          title="Delete Group"
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

      {/* Create / Edit Modal */}
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
                {editingGroup ? 'Edit Category Group' : 'Create Category Group'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Organize multiple product categories into a single unified department grouping
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Group Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingGroup) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. Farm Fresh Produce"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Slug Identifier</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. farm-fresh-produce"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Image URL / Banner Icon</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                  {image && (
                    <img src={image} alt="Preview" className="w-11 h-11 rounded-xl object-cover border border-gray-700" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of what products belong in this group..."
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Sort Order</label>
                  <input
                    type="number"
                    min="1"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
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
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingGroup ? 'Save Group Updates' : 'Create Group Category'}
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
