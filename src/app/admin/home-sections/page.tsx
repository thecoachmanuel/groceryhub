'use client';

import { useState } from 'react';
import { LayoutGrid, Plus, ArrowUp, ArrowDown, Trash2, Edit3, CheckCircle2, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface HomeSectionItem {
  id: number;
  title: string;
  shortTitle: string;
  style: 'product_list' | 'category_list' | 'best_seller' | 'deal_of_the_day' | 'shop_by_brand' | 'shop_by_seller' | 'highlight';
  rows: number;
  itemLimit: number;
  loadMore: boolean;
  viewAll: boolean;
  bgColor: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_SECTIONS: HomeSectionItem[] = [
  { id: 1, title: 'Shop by Category', shortTitle: 'Handpicked departments', style: 'category_list', rows: 1, itemLimit: 8, loadMore: false, viewAll: true, bgColor: '#FFFFFF', status: 'Active' },
  { id: 2, title: 'Deal of the Day', shortTitle: 'Up to 30% discount on fresh organics', style: 'deal_of_the_day', rows: 1, itemLimit: 2, loadMore: false, viewAll: false, bgColor: '#FFF8E7', status: 'Active' },
  { id: 3, title: 'Popular Daily Essentials', shortTitle: 'Top-selling grocery staples', style: 'product_list', rows: 2, itemLimit: 12, loadMore: true, viewAll: true, bgColor: '#FFFFFF', status: 'Active' },
  { id: 4, title: 'Certified Local Vendors', shortTitle: 'Delivering within 30 mins', style: 'shop_by_seller', rows: 1, itemLimit: 6, loadMore: false, viewAll: true, bgColor: '#FFFFFF', status: 'Active' },
  { id: 5, title: 'Shop by Trusted Brands', shortTitle: 'Top certified manufacturers', style: 'shop_by_brand', rows: 1, itemLimit: 8, loadMore: false, viewAll: true, bgColor: '#F4FBF7', status: 'Active' },
];

export default function AdminHomeSectionsPage() {
  const [sections, setSections] = useState<HomeSectionItem[]>(INITIAL_SECTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [style, setStyle] = useState<HomeSectionItem['style']>('product_list');
  const [rows, setRows] = useState(1);
  const [itemLimit, setItemLimit] = useState(10);
  const [loadMore, setLoadMore] = useState(true);
  const [viewAll, setViewAll] = useState(true);
  const [bgColor, setBgColor] = useState('#FFFFFF');

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSection: HomeSectionItem = {
      id: Date.now(),
      title,
      shortTitle,
      style,
      rows,
      itemLimit,
      loadMore,
      viewAll,
      bgColor,
      status: 'Active',
    };
    setSections([...sections, newSection]);
    setShowAddModal(false);
    setTitle('');
    setShortTitle('');
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <LayoutGrid size={24} className="text-[#0aad0a]" /> Home Screen Section Builder
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Visually reorder, configure, and customize dynamic mobile & web homepage layout sections</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Layout Section</span>
          </button>
        </div>

        {/* Sections Sequence List */}
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#0aad0a]/40 transition-all"
            >
              {/* Order index & details */}
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center font-black text-sm text-[#0aad0a]">
                  #{idx + 1}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{section.title}</h3>
                    <span className="text-[10px] font-bold bg-[#0aad0a]/10 text-[#0aad0a] px-2 py-0.5 rounded-full uppercase">
                      {section.style.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{section.shortTitle || 'No short description'}</p>
                </div>
              </div>

              {/* Badges & Meta */}
              <div className="flex items-center gap-6 text-xs text-gray-400">
                <div className="hidden lg:flex items-center gap-4">
                  <span>{section.rows} Row(s)</span>
                  <span>Limit: {section.itemLimit} items</span>
                  {section.loadMore && <span className="text-[#0aad0a]">● Load More</span>}
                </div>

                {/* Reorder Buttons & Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-2 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => setSections(sections.filter((s) => s.id !== section.id))}
                    className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors ml-2"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black">Configure Home Layout Section</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Section Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fresh Veggies Special"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Short Subtitle</label>
                <input
                  type="text"
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                  placeholder="e.g. Direct farm produce delivered fast"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Section Display Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="product_list">Product List (Horizontal / Grid)</option>
                  <option value="category_list">Category List (Icon Tiles)</option>
                  <option value="best_seller">Best Seller Category (Compact Cards)</option>
                  <option value="deal_of_the_day">Deal of the Day Banner Duo</option>
                  <option value="shop_by_brand">Shop by Brand</option>
                  <option value="shop_by_seller">Shop by Seller / Store</option>
                  <option value="highlight">Highlight Cards Section</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Number of Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Max Items</label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={itemLimit}
                    onChange={(e) => setItemLimit(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs font-bold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loadMore}
                    onChange={(e) => setLoadMore(e.target.checked)}
                    className="accent-[#0aad0a] w-4 h-4 rounded"
                  />
                  <span>Enable &quot;Load More&quot; Button</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={viewAll}
                    onChange={(e) => setViewAll(e.target.checked)}
                    className="accent-[#0aad0a] w-4 h-4 rounded"
                  />
                  <span>Enable &quot;View All&quot; Link</span>
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30"
                >
                  Insert Section to Layout
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
