'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Search, Trash2, Edit3, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LocalImageUploader from '@/components/common/LocalImageUploader';

interface AdminBanner {
  id: string;
  title: string;
  placement: string;
  targetType: string;
  targetValue: string;
  image: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const formatBannerFromApi = (b: any): AdminBanner => ({
  id: b._id,
  title: b.title || 'Banner',
  placement: b.placement || 'Header Banner',
  targetType: b.target_type || b.targetType || 'Category',
  targetValue: b.target_value || b.targetValue || '',
  image: b.image || '',
  status: b.status || 'Active',
  createdAt: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-NG') : '—',
});

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);

  const [title, setTitle] = useState('');
  const [placement, setPlacement] = useState('Header Banner');
  const [targetType, setTargetType] = useState('Category');
  const [targetValue, setTargetValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/banners');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBanners(json.data.map(formatBannerFromApi));
      }
    } catch (err) {
      console.warn('Failed to fetch banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setPlacement('Header Banner');
    setTargetType('Category');
    setTargetValue('');
    setImageUrl('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (b: AdminBanner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setPlacement(b.placement);
    setTargetType(b.targetType);
    setTargetValue(b.targetValue);
    setImageUrl(b.image);
    setStatus(b.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Banner title is required');

    const defaultImg = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';
    const finalImage = imageUrl || defaultImg;

    setSaving(true);
    try {
      if (editingBanner) {
        await fetch('/api/admin/banners', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bannerId: editingBanner.id,
            title,
            placement,
            target_type: targetType,
            target_value: targetValue,
            image: finalImage,
            status,
          }),
        });
        setBanners((prev) =>
          prev.map((b) =>
            b.id === editingBanner.id
              ? { ...b, title, placement, targetType, targetValue, image: finalImage, status }
              : b
          )
        );
      } else {
        const res = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            placement,
            target_type: targetType,
            target_value: targetValue,
            image: finalImage,
            status,
          }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setBanners((prev) => [formatBannerFromApi(json.data), ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.warn('Banner submit error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await fetch('/api/admin/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerId: id }),
      });
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.warn('Delete error:', err);
    }
  };

  const handleToggleStatus = async (id: string, current: 'Active' | 'Inactive') => {
    const newStatus = current === 'Active' ? 'Inactive' : 'Active';
    try {
      await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerId: id, status: newStatus }),
      });
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    } catch (err) {
      console.warn('Toggle status error:', err);
    }
  };

  const filtered = banners.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.placement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <ImageIcon size={24} className="text-[#0aad0a]" /> Banners &amp; Promotional Ads
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage homepage hero banners, promotional section popups, and deal placements in MongoDB</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchBanners} disabled={loading} className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={openCreateModal} className="inline-flex items-center gap-1.5 bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-bold px-4 py-2 rounded-xl">
              <Plus size={14} /> Add New Banner
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or placement..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400 font-bold">{banners.length} Banners</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
            <p className="text-xs text-gray-400">Loading banners from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-[#1e2632] border border-gray-800 rounded-3xl p-8">
            <ImageIcon size={36} className="mx-auto text-gray-500" />
            <h4 className="text-sm font-bold">No banners found</h4>
            <p className="text-xs text-gray-400">
              {banners.length === 0
                ? 'No promotional banners in database yet. Click Add New Banner to create one.'
                : 'No banners match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((b) => (
              <div key={b.id} className="bg-[#1e2632] border border-gray-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                <div className="relative h-44 w-full bg-gray-900">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" onError={(e: any) => { e.target.style.display = 'none'; }} />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
                      b.status === 'Active' ? 'bg-emerald-950/80 text-[#0aad0a] border border-[#0aad0a]/30' : 'bg-gray-900/80 text-gray-400 border border-gray-700'
                    }`}>
                      ● {b.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#0aad0a] uppercase tracking-wider block">{b.placement}</span>
                    <h3 className="text-base font-black text-white">{b.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Target: {b.targetType} &rarr; {b.targetValue || 'All'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
                    <button
                      onClick={() => handleToggleStatus(b.id, b.status)}
                      className="font-bold text-gray-400 hover:text-white transition-colors"
                    >
                      {b.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400">
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">{editingBanner ? 'Edit Banner' : 'Create Banner'}</h3>
              <p className="text-xs text-gray-400">Add or edit promotional banner for the storefront</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Banner Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mega Savings Festival 30% OFF"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Placement Slot</label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Header Banner">Header Banner</option>
                    <option value="Deal of Day">Deal of Day</option>
                    <option value="Home Section">Home Section</option>
                    <option value="Footer Banner">Footer Banner</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Target Action</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Category">Open Category</option>
                    <option value="Product">Open Product</option>
                    <option value="URL">External URL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Target Category / Value</label>
                <input
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="e.g. vegetables or fruit"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <LocalImageUploader
                  label="Banner Image"
                  folder="banners"
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Status</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('Active')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      status === 'Active' ? 'bg-[#0aad0a] text-white' : 'bg-gray-900 text-gray-400'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Inactive')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      status === 'Inactive' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
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
