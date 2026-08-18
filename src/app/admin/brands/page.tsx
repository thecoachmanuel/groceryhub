'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Search, Trash2, Edit3, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  status: string;
  is_featured_on_home: boolean;
  products_count: number;
  createdAt: string;
}

const formatBrandFromApi = (b: any): BrandItem => ({
  id: b._id,
  name: b.name || 'Brand',
  slug: b.slug || '',
  logo: b.logo || '',
  description: b.description || '',
  status: b.status || 'Active',
  is_featured_on_home: b.is_featured_on_home ?? false,
  products_count: b.products_count ?? 0,
  createdAt: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-NG') : '—',
});

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', logo: '', description: '', is_featured_on_home: false });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/brands');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setBrands(json.data.map(formatBrandFromApi));
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch('/api/admin/brands', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: id, is_featured_on_home: !current }),
      });
      setBrands((prev) => prev.map((b) => b.id === id ? { ...b, is_featured_on_home: !current } : b));
    } catch (err) { console.warn(err); }
  };

  const handleToggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'Active' ? 'Hidden' : 'Active';
    try {
      await fetch('/api/admin/brands', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: id, status: newStatus }),
      });
      setBrands((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b));
      if (selectedBrand?.id === id) setSelectedBrand((b) => b ? { ...b, status: newStatus } : null);
    } catch (err) { console.warn(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    try {
      await fetch('/api/admin/brands', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: id }),
      });
      setBrands((prev) => prev.filter((b) => b.id !== id));
      setSelectedBrand(null);
    } catch (err) { console.warn(err); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setBrands((prev) => [formatBrandFromApi(json.data), ...prev]);
        setShowAddModal(false);
        setForm({ name: '', logo: '', description: '', is_featured_on_home: false });
      } else { alert(json.message || 'Failed to add brand'); }
    } catch (err) { console.warn(err); }
    setSaving(false);
  };

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.slug.includes(searchQuery)
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2"><Tag size={24} className="text-[#0aad0a]" /> Brand Management</h1>
            <p className="text-xs text-gray-400 mt-0.5">Certified partner brands shown on the frontend /sellers and /brands pages</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchBrands} disabled={loading} className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-1.5 bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-bold px-4 py-2 rounded-xl">
              <Plus size={14} /> Add Brand
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative max-w-md flex-1">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search brand name or slug..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400 ml-4 font-bold">{brands.length} Brands</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
            <p className="text-xs text-gray-400">Loading brands from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Tag size={36} className="mx-auto text-gray-500" />
            <h4 className="text-sm font-bold">No brands found</h4>
            <p className="text-xs text-gray-400">
              {brands.length === 0 ? 'No brands in database. Add your first brand — it will appear on the /brands and /sellers pages instantly.' : 'No brands match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((b) => (
              <div key={b.id} className="bg-[#1e2632] border border-gray-800 rounded-2xl p-4 space-y-3 hover:border-gray-700 transition-all">
                <div className="flex items-center gap-3">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="w-12 h-12 rounded-xl object-cover bg-gray-900" onError={(e: any) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 text-lg font-black">{b.name[0]}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{b.name}</h3>
                    <p className="text-[11px] text-gray-500">/{b.slug} · {b.products_count} products</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.status === 'Active' ? 'bg-emerald-950/40 text-[#0aad0a]' : 'bg-gray-800 text-gray-400'}`}>
                    {b.status}
                  </span>
                  {b.is_featured_on_home && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/40 text-amber-400">Featured</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleFeatured(b.id, b.is_featured_on_home)} className="flex-1 text-[10px] font-bold py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all">
                    {b.is_featured_on_home ? '★ Unfeature' : '☆ Feature'}
                  </button>
                  <button onClick={() => handleToggleStatus(b.id, b.status)} className="flex-1 text-[10px] font-bold py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all">
                    {b.status === 'Active' ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Brand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 border border-gray-800 space-y-4 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"><X size={20} /></button>
            <h3 className="text-xl font-black">Add New Brand</h3>
            <p className="text-xs text-gray-400">This brand will appear on the frontend /brands and /sellers pages immediately.</p>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Brand Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Green Valley Organic"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Logo URL</label>
                <input type="url" value={form.logo} onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))} placeholder="https://example.com/logo.png"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief brand description..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a] resize-none" rows={3} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured_on_home} onChange={(e) => setForm((f) => ({ ...f, is_featured_on_home: e.target.checked }))} className="accent-[#0aad0a]" />
                <span className="text-xs font-bold text-gray-300">Feature on Homepage</span>
              </label>
              <button type="submit" disabled={saving} className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3 rounded-xl text-xs mt-2 disabled:opacity-60">
                {saving ? 'Saving...' : 'Create Brand'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
