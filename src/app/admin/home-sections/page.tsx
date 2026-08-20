'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, Plus, ArrowUp, ArrowDown, Trash2, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface HomeSectionItem {
  _id?: string;
  title: string;
  type: string;
  categoryRef?: string;
  order: number;
  status: 'Active' | 'Inactive';
}

interface CategoryOption {
  _id?: string;
  name: string;
}

export default function AdminHomeSectionsPage() {
  const [sections, setSections] = useState<HomeSectionItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<HomeSectionItem | null>(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('ProductGrid');
  const [categoryRef, setCategoryRef] = useState('');

  const fetchSectionsAndCategories = async () => {
    try {
      setLoading(true);
      const [secRes, catRes] = await Promise.all([
        fetch('/api/admin/home-sections'),
        fetch('/api/admin/categories'),
      ]);

      const secData = await secRes.json();
      const catData = await catRes.json();

      if (secData.success) {
        setSections(secData.data || []);
      }
      if (catData.success && Array.isArray(catData.data)) {
        setCategories(catData.data);
      }
    } catch (err) {
      console.error('Error fetching home sections/categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionsAndCategories();
  }, []);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);

    for (let i = 0; i < updated.length; i++) {
      if (updated[i]._id) {
        await fetch('/api/admin/home-sections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: updated[i]._id, order: i + 1 }),
        }).catch(() => null);
      }
    }
  };

  const handleToggleStatus = async (sec: HomeSectionItem) => {
    if (!sec._id) return;
    const newStatus = sec.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await fetch('/api/admin/home-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sec._id, status: newStatus }),
      });
      setSections((prev) => prev.map((s) => (s._id === sec._id ? { ...s, status: newStatus } : s)));
    } catch (err) {
      console.error('Error updating section status:', err);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSection && editingSection._id) {
        await fetch('/api/admin/home-sections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingSection._id,
            title,
            type,
            categoryRef,
          }),
        });
      } else {
        await fetch('/api/admin/home-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            type,
            categoryRef,
            order: sections.length + 1,
            status: 'Active',
          }),
        });
      }
      setShowAddModal(false);
      setEditingSection(null);
      setTitle('');
      setCategoryRef('');
      fetchSectionsAndCategories();
    } catch (err) {
      console.error('Error saving home section:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this home layout section?')) return;
    try {
      await fetch(`/api/admin/home-sections?id=${id}`, { method: 'DELETE' });
      fetchSectionsAndCategories();
    } catch (err) {
      console.error('Error deleting home section:', err);
    }
  };

  const openEdit = (sec: HomeSectionItem) => {
    setEditingSection(sec);
    setTitle(sec.title);
    setType(sec.type);
    setCategoryRef(sec.categoryRef || '');
    setShowAddModal(true);
  };

  const openNew = () => {
    setEditingSection(null);
    setTitle('');
    setType('ProductGrid');
    setCategoryRef('');
    setShowAddModal(true);
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
            <p className="text-xs text-gray-400 mt-0.5">Visually reorder, configure, and customize dynamic mobile &amp; web homepage layout sections</p>
          </div>

          <button
            onClick={openNew}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Layout Section</span>
          </button>
        </div>

        {/* Sections Sequence List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-xs">Loading home layout sections...</div>
        ) : sections.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">No home sections configured yet. Click Add Layout Section to build your homepage layout.</div>
        ) : (
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <div
                key={section._id || idx}
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
                        {section.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{section.categoryRef ? `Category Filter: ${section.categoryRef}` : 'All Store Items'}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(section)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${
                      section.status === 'Active'
                        ? 'bg-emerald-950/60 text-[#0aad0a] border border-[#0aad0a]/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    ● {section.status}
                  </button>

                  <button
                    onClick={() => openEdit(section)}
                    className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700 text-xs font-bold hover:bg-gray-800 text-white"
                  >
                    Edit
                  </button>

                  <div className="flex items-center gap-1">
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
                      onClick={() => section._id && handleDelete(section._id)}
                      className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors ml-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black">{editingSection ? 'Edit Section Layout' : 'Configure Home Layout Section'}</h3>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
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
                <label className="text-xs font-bold text-gray-[#0aad0a]">Section Display Style</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="ProductGrid">Product Grid</option>
                  <option value="CategoryIcons">Category Icons Tile</option>
                  <option value="BestSellers">Best Sellers Carousel</option>
                  <option value="DealOfDay">Deal of the Day</option>
                  <option value="ShopByBrand">Shop by Brand</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Target Category Filter</label>
                <select
                  value={categoryRef}
                  onChange={(e) => setCategoryRef(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="">All Categories (No Filter)</option>
                  {categories.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30"
                >
                  {editingSection ? 'Save Section Changes' : 'Insert Section to Layout'}
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
