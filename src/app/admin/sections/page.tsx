'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Layout, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ArrowUpDown, 
  X, 
  CheckCircle2, 
  ArrowLeft,
  Eye,
  Smartphone,
  Layers,
  Sparkles,
  Tag
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface SectionItem {
  id: number;
  title: string;
  short_description: string;
  section_type: 'category' | 'brand' | 'manual' | 'discount_deals';
  source_target: string;
  item_limit: number;
  sort_order: number;
  status: 'Active' | 'Hidden';
}

const INITIAL_SECTIONS: SectionItem[] = [
  { id: 1, title: 'Trending Fresh Vegetables', short_description: 'Daily harvest organic produce picked this morning', section_type: 'category', source_target: 'Fresh Fruits & Vegetables', item_limit: 8, sort_order: 1, status: 'Active' },
  { id: 2, title: 'Deal of the Day — Up to 40% OFF', short_description: 'Special flash markdown discounts expiring midnight', section_type: 'discount_deals', source_target: 'Featured Deals', item_limit: 6, sort_order: 2, status: 'Active' },
  { id: 3, title: 'Artisanal Dairy & Cheeses', short_description: 'Pure organic milk, Greek yogurt, and aged cheddar', section_type: 'category', source_target: 'Dairy & Breakfast', item_limit: 8, sort_order: 3, status: 'Active' },
  { id: 4, title: 'Certified Partner Brand Spotlight', short_description: 'Handpicked products from Organic Valley & Nestlé', section_type: 'brand', source_target: 'Organic Valley', item_limit: 6, sort_order: 4, status: 'Active' },
  { id: 5, title: 'Curated Chef Pantry Essentials', short_description: 'Specialty olive oils, rare spices, and gourmet grains', section_type: 'manual', source_target: 'Manual Selection (12 items)', item_limit: 12, sort_order: 5, status: 'Active' },
];

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionItem[]>(INITIAL_SECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [sectionType, setSectionType] = useState<SectionItem['section_type']>('category');
  const [sourceTarget, setSourceTarget] = useState('Fresh Fruits & Vegetables');
  const [itemLimit, setItemLimit] = useState(8);
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState<'Active' | 'Hidden'>('Active');

  const openCreateModal = () => {
    setEditingSection(null);
    setTitle('');
    setShortDesc('');
    setSectionType('category');
    setSourceTarget('Fresh Fruits & Vegetables');
    setItemLimit(8);
    setSortOrder(sections.length + 1);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (s: SectionItem) => {
    setEditingSection(s);
    setTitle(s.title);
    setShortDesc(s.short_description);
    setSectionType(s.section_type);
    setSourceTarget(s.source_target);
    setItemLimit(s.item_limit);
    setSortOrder(s.sort_order);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Section title is required');

    if (editingSection) {
      setSections(prev => prev.map(s => s.id === editingSection.id ? {
        ...s,
        title,
        short_description: shortDesc,
        section_type: sectionType,
        source_target: sourceTarget,
        item_limit: itemLimit,
        sort_order: sortOrder,
        status
      } : s));
    } else {
      const newSec: SectionItem = {
        id: Date.now(),
        title,
        short_description: shortDesc,
        section_type: sectionType,
        source_target: sourceTarget,
        item_limit: itemLimit,
        sort_order: sortOrder,
        status
      };
      setSections([...sections, newSec]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this Homepage Section?')) {
      setSections(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Hidden' : 'Active' } : s));
  };

  const filtered = sections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.source_target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin/home-screens" className="text-xs text-gray-400 hover:text-[#0aad0a] flex items-center gap-1">
                <ArrowLeft size={12} /> Back to Home Screens
              </Link>
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Layout size={24} className="text-[#0aad0a]" /> Content Sections Builder
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Build and sort dynamic homepage feeds, category sliders, and manual product collections
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Section</span>
          </button>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/home-screens" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Home Screen Themes
          </Link>
          <Link href="/admin/sections" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <Layout size={13} /> Content Sections ({sections.length})
          </Link>
          <Link href="/admin/home-sections" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Visual Grid Builder
          </Link>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content sections by title or target source..."
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
                  <th className="pb-3 px-3">Order</th>
                  <th className="pb-3 px-3">Section Title & Description</th>
                  <th className="pb-3 px-3">Section Type</th>
                  <th className="pb-3 px-3">Source Target</th>
                  <th className="pb-3 px-3">Max Items</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-white text-sm">
                      #{s.sort_order}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{s.title}</div>
                      <span className="text-[11px] text-gray-400">{s.short_description}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-gray-900 border border-gray-700 text-gray-300 font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase">
                        {s.section_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#0aad0a] font-semibold">
                      {s.source_target}
                    </td>
                    <td className="py-3.5 px-3 text-white font-mono font-bold">
                      {s.item_limit} items
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(s.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          s.status === 'Active'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        ● {s.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit Section"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                          title="Delete Section"
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
                {editingSection ? 'Edit Content Section' : 'Create Content Section'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure feed section parameters, item limits, and linked category/brand sources
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Section Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deal of the Day — Up to 40% OFF"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="e.g. Fresh organic harvest sourced from local orchards"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Section Type</label>
                  <select
                    value={sectionType}
                    onChange={(e) => setSectionType(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="category">Category-Based</option>
                    <option value="brand">Brand Spotlight</option>
                    <option value="discount_deals">Discount Deals</option>
                    <option value="manual">Manual Product Selection</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Max Items to Display</label>
                  <input
                    type="number"
                    min="2"
                    max="24"
                    value={itemLimit}
                    onChange={(e) => setItemLimit(parseInt(e.target.value) || 8)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Source Target Name / Category</label>
                <input
                  type="text"
                  value={sourceTarget}
                  onChange={(e) => setSourceTarget(e.target.value)}
                  placeholder="e.g. Fresh Fruits & Vegetables or Organic Valley"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Sort Priority Order</label>
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
                    <option value="Active">Active (Visible)</option>
                    <option value="Hidden">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingSection ? 'Save Section' : 'Create Section'}
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
