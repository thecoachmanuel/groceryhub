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
  Sparkles,
  ArrowUpDown,
  Eye
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface HeaderCategoryItem {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  image: string;
  badgeText?: string;
  sortOrder: number;
  status: 'Active' | 'Hidden';
}

const INITIAL_HEADER_CATEGORIES: HeaderCategoryItem[] = [
  { id: 1, name: 'Flash Deals', category_id: 1, category_name: 'Special Deals', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150&auto=format&fit=crop&q=60', badgeText: 'HOT', sortOrder: 1, status: 'Active' },
  { id: 2, name: 'Vegetables', category_id: 2, category_name: 'Fresh Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&auto=format&fit=crop&q=60', badgeText: 'ORGANIC', sortOrder: 2, status: 'Active' },
  { id: 3, name: 'Dairy & Milk', category_id: 3, category_name: 'Dairy & Breakfast', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=60', sortOrder: 3, status: 'Active' },
  { id: 4, name: 'Cold Drinks', category_id: 4, category_name: 'Beverages', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=60', badgeText: 'SUMMER', sortOrder: 4, status: 'Active' },
  { id: 5, name: 'Snacks & Chips', category_id: 5, category_name: 'Instant & Frozen', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=150&auto=format&fit=crop&q=60', sortOrder: 5, status: 'Active' },
  { id: 6, name: 'Bakery', category_id: 6, category_name: 'Bakery & Biscuits', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=60', badgeText: 'FRESH', sortOrder: 6, status: 'Active' },
];

export default function AdminHeaderCategoryPage() {
  const [headerCategories, setHeaderCategories] = useState<HeaderCategoryItem[]>(INITIAL_HEADER_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeaderCategoryItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('Fresh Fruits & Vegetables');
  const [image, setImage] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState<'Active' | 'Hidden'>('Active');

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setCategoryName('Fresh Fruits & Vegetables');
    setImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&auto=format&fit=crop&q=60');
    setBadgeText('');
    setSortOrder(headerCategories.length + 1);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (item: HeaderCategoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategoryName(item.category_name);
    setImage(item.image);
    setBadgeText(item.badgeText || '');
    setSortOrder(item.sortOrder);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Tile label is required');

    if (editingItem) {
      setHeaderCategories(prev => prev.map(item => item.id === editingItem.id ? {
        ...item,
        name,
        category_name: categoryName,
        image,
        badgeText: badgeText.trim() || undefined,
        sortOrder,
        status
      } : item));
    } else {
      const newItem: HeaderCategoryItem = {
        id: Date.now(),
        name,
        category_id: Math.floor(Math.random() * 10) + 1,
        category_name: categoryName,
        image,
        badgeText: badgeText.trim() || undefined,
        sortOrder,
        status
      };
      setHeaderCategories([...headerCategories, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this Header Category tile?')) {
      setHeaderCategories(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setHeaderCategories(prev => prev.map(item => item.id === id ? { ...item, status: item.status === 'Active' ? 'Hidden' : 'Active' } : item));
  };

  const filtered = headerCategories.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category_name.toLowerCase().includes(searchQuery.toLowerCase())
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
              Customize quick horizontal category chips and icons pinned to the top header of the customer web & mobile apps
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

        {/* Sub-nav banner */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/categories" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Categories Directory
          </Link>
          <Link href="/admin/group-category" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Group Categories
          </Link>
          <Link href="/admin/header-category" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black">
            Header Categories ({headerCategories.length})
          </Link>
          <Link href="/admin/subcategories" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Subcategories
          </Link>
        </div>

        {/* Live Visual Preview of Header Strip */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400">
            <span className="flex items-center gap-1.5 text-white">
              <Sparkles size={14} className="text-[#0aad0a]" /> Live Storefront Header Strip Preview
            </span>
            <span className="text-[11px] text-gray-500">Horizontal scroll on small screens</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {headerCategories.filter(item => item.status === 'Active').map(item => (
              <div 
                key={item.id}
                className="flex flex-col items-center gap-2 min-w-[72px] p-2.5 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-[#0aad0a]/40 transition-all cursor-pointer group text-center"
              >
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 group-hover:border-[#0aad0a] transition-colors" 
                  />
                  {item.badgeText && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-gray-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase shadow">
                      {item.badgeText}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-gray-300 group-hover:text-white truncate max-w-[72px]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Icon / Avatar</th>
                  <th className="pb-3 px-3">Tile Label</th>
                  <th className="pb-3 px-3">Linked Category</th>
                  <th className="pb-3 px-3">Promo Tag Badge</th>
                  <th className="pb-3 px-3">Sort Order</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-700 bg-gray-900" 
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-300">
                      <span className="bg-gray-900 border border-gray-700 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                        {item.category_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {item.badgeText ? (
                        <span className="bg-amber-950/60 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          {item.badgeText}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      #{item.sortOrder}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          item.status === 'Active'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        ● {item.status}
                      </button>
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
                          onClick={() => handleDelete(item.id)}
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
                Configure quick tap icon, target category page, and optional promo banner chip
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
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Fresh Fruits & Vegetables">Fresh Fruits & Vegetables</option>
                  <option value="Dairy & Breakfast">Dairy & Breakfast</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Instant & Frozen">Instant & Frozen</option>
                  <option value="Bakery & Biscuits">Bakery & Biscuits</option>
                  <option value="Special Deals">Special Deals</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Icon / Thumbnail URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                  {image && (
                    <img src={image} alt="Preview" className="w-11 h-11 rounded-full object-cover border border-gray-700" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Promo Badge Tag (Optional)</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. HOT, NEW, 20% OFF"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs uppercase font-bold focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

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
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Visibility Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Active">Active</option>
                  <option value="Hidden">Hidden</option>
                </select>
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
