'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Layout, 
  MapPin,
  Star
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface HomeScreenItem {
  _id?: string;
  screenId: string;
  title: string;
  type: string;
  order: number;
  status: 'Active' | 'Inactive';
}

export default function AdminHomeScreensPage() {
  const [screens, setScreens] = useState<HomeScreenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<HomeScreenItem | null>(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Custom');
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const fetchScreens = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/home-screens');
      const data = await res.json();
      if (data.success) {
        setScreens(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching home screens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  const openCreateModal = () => {
    setEditingScreen(null);
    setTitle('');
    setType('Custom');
    setOrder(screens.length + 1);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (s: HomeScreenItem) => {
    setEditingScreen(s);
    setTitle(s.title);
    setType(s.type || 'Custom');
    setOrder(s.order || 0);
    setStatus(s.status || 'Active');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Screen title is required');

    try {
      if (editingScreen) {
        await fetch('/api/admin/home-screens', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingScreen._id, title, type, order, status }),
        });
      } else {
        await fetch('/api/admin/home-screens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ screenId: `SCR-${Date.now()}`, title, type, order, status }),
        });
      }
      setIsModalOpen(false);
      fetchScreens();
    } catch (err) {
      console.error('Error saving home screen:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Home Screen configuration?')) return;
    try {
      await fetch(`/api/admin/home-screens?id=${id}`, { method: 'DELETE' });
      fetchScreens();
    } catch (err) {
      console.error('Error deleting home screen:', err);
    }
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Smartphone size={24} className="text-[#0aad0a]" /> Mobile App Home Screens
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Design and manage customized home screen themes, top gradient headers, and localized feed layouts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/sections"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-colors"
            >
              <Layout size={14} /> Manage Content Sections
            </Link>
            <button
              onClick={openCreateModal}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Create Screen Theme</span>
            </button>
          </div>
        </div>

        {/* Grid Preview Cards */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-xs">Loading home screens...</div>
        ) : screens.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">No home screen layouts configured. Click Create Screen Theme to start.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {screens.map((s) => (
              <div 
                key={s._id}
                className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 relative"
              >
                <div 
                  className="h-28 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 shadow-inner"
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white">
                      {s.type}
                    </span>
                    <span className="bg-amber-400 text-gray-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Star size={10} fill="currentColor" /> Priority #{s.order}
                    </span>
                  </div>

                  <div className="relative z-10 text-white font-bold text-xs truncate drop-shadow">
                    {s.title}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-black text-white text-base">{s.title}</div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#0aad0a]" /> All Regions
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      s.status === 'Active'
                        ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    ● {s.status}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(s)}
                      className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                      title="Edit Theme"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => s._id && handleDelete(s._id)}
                      className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                      title="Delete Screen"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">
                {editingScreen ? 'Edit Home Screen Theme' : 'Create Home Screen Theme'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Configure screen title, layout type, and order priority</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Screen Layout Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Primary Storefront Theme"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Type</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. FlashSale"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingScreen ? 'Save Theme Settings' : 'Create Home Screen'}
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
