'use client';

import { useState, useEffect } from 'react';
import { Flame, Plus, Trash2, X, Clock } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface HighlightItem {
  _id?: string;
  title: string;
  subtitle: string;
  tag: string;
  bgColor: string;
  icon: string;
  status: 'Active' | 'Inactive';
}

export default function AdminHighlightsPage() {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tag, setTag] = useState('25% OFF');
  const [bgColor, setBgColor] = useState('#0aad0a');

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/highlights');
      const data = await res.json();
      if (data.success) {
        setHighlights(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching highlights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subtitle, tag, bgColor, status: 'Active' }),
      });
      setShowAddModal(false);
      setTitle('');
      setSubtitle('');
      setTag('25% OFF');
      fetchHighlights();
    } catch (err) {
      console.error('Error creating highlight:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal highlight?')) return;
    try {
      await fetch(`/api/admin/highlights?id=${id}`, { method: 'DELETE' });
      fetchHighlights();
    } catch (err) {
      console.error('Error deleting highlight:', err);
    }
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Flame size={24} className="text-orange-500" /> Deal of the Day &amp; Highlights
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage curated flash deals, special promos, and featured hero badges</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Deal Highlight</span>
          </button>
        </div>

        {/* Highlights Cards */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-xs">Loading deal highlights...</div>
        ) : highlights.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">No deal highlights published. Click Add Deal Highlight to create one.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((h) => (
              <div
                key={h._id}
                className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-4 hover:border-orange-500/40 transition-all group"
              >
                <div
                  className="w-full h-32 rounded-2xl flex flex-col justify-between p-4 relative overflow-hidden"
                  style={{ backgroundColor: h.bgColor || '#0aad0a' }}
                >
                  <span className="bg-black/40 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider w-fit">
                    {h.tag || 'Promo'}
                  </span>
                  <div className="text-white">
                    <div className="text-xs font-bold text-white/80">{h.subtitle}</div>
                    <div className="font-black text-lg text-white leading-tight">{h.title}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock size={13} className="text-orange-400" />
                    <span>24h Flash Window</span>
                  </div>

                  <button
                    onClick={() => h._id && handleDelete(h._id)}
                    className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

            <h3 className="text-xl font-black">Create Deal Highlight</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Highlight Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Farm Fresh Mangoes Flat 35% OFF"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Subtitle / Category</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Organic Fruits"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Tag Text</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. 30% OFF"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Card Color</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 bg-transparent border border-gray-700 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30"
                >
                  Publish Deal Highlight
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
