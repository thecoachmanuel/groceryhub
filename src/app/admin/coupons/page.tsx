'use client';

import { useState, useEffect } from 'react';
import { Percent, Plus, Search, Trash2, Calendar, X, RefreshCw, Copy, Tag } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface CouponItem {
  id: string;
  code: string;
  title: string;
  discount_type: string;
  discount: number;
  min_purchase: number;
  max_discount: number;
  expiry_date: string;
  is_active: boolean;
  usage_count: number;
  usage_limit: number;
  createdAt: string;
}

const formatCouponFromApi = (c: any): CouponItem => ({
  id: c._id,
  code: c.code || '',
  title: c.title || 'Discount Coupon',
  discount_type: c.discount_type || 'percentage',
  discount: c.discount ?? 0,
  min_purchase: c.min_purchase ?? 0,
  max_discount: c.max_discount ?? 0,
  expiry_date: c.expiry_date ? new Date(c.expiry_date).toISOString().split('T')[0] : '',
  is_active: c.is_active ?? true,
  usage_count: c.usage_count ?? 0,
  usage_limit: c.usage_limit ?? 0,
  createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-NG') : '—',
});

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    title: '',
    discount_type: 'percentage',
    discount: '',
    min_purchase: '',
    max_discount: '',
    expiry_date: '',
    usage_limit: '',
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/coupons');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setCoupons(json.data.map(formatCouponFromApi));
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponId: id, is_active: !current }),
      });
      setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !current } : c));
    } catch (err) { console.warn(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await fetch('/api/admin/coupons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponId: id }),
      });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) { console.warn(err); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discount || !form.expiry_date) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          discount: parseFloat(form.discount),
          min_purchase: parseFloat(form.min_purchase || '0'),
          max_discount: parseFloat(form.max_discount || '0'),
          usage_limit: parseInt(form.usage_limit || '0'),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setCoupons((prev) => [formatCouponFromApi(json.data), ...prev]);
        setShowAddModal(false);
        setForm({ code: '', title: '', discount_type: 'percentage', discount: '', min_purchase: '', max_discount: '', expiry_date: '', usage_limit: '' });
      } else { alert(json.message || 'Failed to create coupon'); }
    } catch (err) { console.warn(err); }
    setSaving(false);
  };

  const isExpired = (dateStr: string) => dateStr && new Date(dateStr) < new Date();

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2"><Percent size={24} className="text-[#0aad0a]" /> Coupon Management</h1>
            <p className="text-xs text-gray-400 mt-0.5">Live discount coupons — create, activate/deactivate, and delete from database</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchCoupons} disabled={loading} className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-1.5 bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-bold px-4 py-2 rounded-xl">
              <Plus size={14} /> Create Coupon
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative max-w-md flex-1">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search coupon code or title..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400 ml-4 font-bold">{coupons.length} Coupons</span>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading coupons from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Tag size={36} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold">No coupons found</h4>
              <p className="text-xs text-gray-400">
                {coupons.length === 0 ? 'No discount coupons created yet. Create your first coupon to offer discounts to customers.' : 'No coupons match your search.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Code</th>
                    <th className="pb-3 px-3">Discount</th>
                    <th className="pb-3 px-3">Min Spend</th>
                    <th className="pb-3 px-3">Expiry</th>
                    <th className="pb-3 px-3">Usage</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono text-sm">{c.code}</span>
                            <button onClick={() => navigator.clipboard.writeText(c.code)} className="text-gray-500 hover:text-gray-300 transition-all"><Copy size={11} /></button>
                          </div>
                          <span className="text-[11px] text-gray-500">{c.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-400">
                        {c.discount_type === 'percentage' ? `${c.discount}%` : formatNaira(c.discount)} OFF
                        {c.max_discount > 0 && <span className="text-[10px] text-gray-500 block">Max: {formatNaira(c.max_discount)}</span>}
                      </td>
                      <td className="py-3 px-3">{c.min_purchase > 0 ? formatNaira(c.min_purchase) : '—'}</td>
                      <td className="py-3 px-3">
                        <span className={isExpired(c.expiry_date) ? 'text-red-400 font-bold' : 'text-gray-300'}>
                          {c.expiry_date || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {c.usage_count} / {c.usage_limit === 0 ? '∞' : c.usage_limit}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isExpired(c.expiry_date) ? 'bg-red-950/40 text-red-400' : c.is_active ? 'bg-emerald-950/40 text-[#0aad0a]' : 'bg-gray-800 text-gray-400'}`}>
                          ● {isExpired(c.expiry_date) ? 'Expired' : c.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleToggleActive(c.id, c.is_active)}
                            className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${c.is_active ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-[#0aad0a]'}`}>
                            {c.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 transition-all">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 border border-gray-800 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"><X size={20} /></button>
            <h3 className="text-xl font-black">Create Coupon</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-300">Coupon Code *</label>
                  <input type="text" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. FRESH30"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]" required />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-300">Title / Description *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. 30% OFF on fresh fruits"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Discount Type</label>
                  <select value={form.discount_type} onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Discount Value *</label>
                  <input type="number" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} placeholder={form.discount_type === 'percentage' ? '30' : '5000'}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Min Purchase (₦)</label>
                  <input type="number" value={form.min_purchase} onChange={(e) => setForm((f) => ({ ...f, min_purchase: e.target.value }))} placeholder="8000"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Max Discount (₦)</label>
                  <input type="number" value={form.max_discount} onChange={(e) => setForm((f) => ({ ...f, max_discount: e.target.value }))} placeholder="4500"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Expiry Date *</label>
                  <input type="date" value={form.expiry_date} onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Usage Limit (0 = unlimited)</label>
                  <input type="number" value={form.usage_limit} onChange={(e) => setForm((f) => ({ ...f, usage_limit: e.target.value }))} placeholder="0"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" />
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3 rounded-xl text-xs mt-2 disabled:opacity-60">
                {saving ? 'Creating...' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
