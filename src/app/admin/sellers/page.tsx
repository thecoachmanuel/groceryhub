'use client';

import { useState, useEffect } from 'react';
import { Store, Plus, Search, Trash2, Edit3, X, CheckCircle2, ShieldCheck, AlertCircle, Clock, Wallet, RefreshCw, Percent } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface SellerItem {
  id: string;
  name: string;
  store_name: string;
  email: string;
  mobile: string;
  city: string;
  commission_rate: number;
  balance: number;
  status: string;
  status_reason?: string;
  requires_product_approval: boolean;
  logo: string;
  createdAt: string;
}

const formatSellerFromApi = (s: any): SellerItem => ({
  id: s._id,
  name: s.name || s.store_name || 'Seller',
  store_name: s.store_name || s.name || '',
  email: s.email || '',
  mobile: s.mobile || '',
  city: s.city || 'Lagos',
  commission_rate: s.commission_rate ?? 5,
  balance: s.balance ?? 0,
  status: s.status || 'pending',
  status_reason: s.status_reason || '',
  requires_product_approval: s.requires_product_approval ?? true,
  logo: s.logo || '',
  createdAt: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-NG') : '—',
});

const statusIcon = (status: string) => {
  switch (status) {
    case 'approved': return <CheckCircle2 size={13} className="text-[#0aad0a]" />;
    case 'pending': return <Clock size={13} className="text-amber-400" />;
    case 'rejected': return <AlertCircle size={13} className="text-red-400" />;
    case 'suspended': return <ShieldCheck size={13} className="text-orange-400" />;
    default: return null;
  }
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-emerald-950/40 text-[#0aad0a]';
    case 'pending': return 'bg-amber-950/40 text-amber-400';
    case 'rejected': return 'bg-red-950/40 text-red-400';
    case 'suspended': return 'bg-orange-950/40 text-orange-400';
    default: return 'bg-gray-800 text-gray-400';
  }
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [selectedSeller, setSelectedSeller] = useState<SellerItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStoreName, setNewStoreName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newCity, setNewCity] = useState('Lagos');
  const [newCommission, setNewCommission] = useState('5');
  const [newPassword, setNewPassword] = useState('');

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sellers');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSellers(json.data.map(formatSellerFromApi));
      }
    } catch (err) {
      console.warn('Failed to fetch sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSellers(); }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setSaving(true);
    try {
      await fetch('/api/admin/sellers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: id, status }),
      });
      setSellers((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      if (selectedSeller?.id === id) setSelectedSeller((s) => s ? { ...s, status } : null);
    } catch (err) { console.warn(err); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this seller? This cannot be undone.')) return;
    try {
      await fetch('/api/admin/sellers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: id }),
      });
      setSellers((prev) => prev.filter((s) => s.id !== id));
      if (selectedSeller?.id === id) setSelectedSeller(null);
    } catch (err) { console.warn(err); }
  };

  const handleAddSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newMobile || !newPassword) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          store_name: newStoreName || newName,
          email: newEmail,
          mobile: newMobile,
          city: newCity,
          commission_rate: parseFloat(newCommission) || 5,
          password: newPassword,
          status: 'approved',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSellers((prev) => [formatSellerFromApi(json.data), ...prev]);
        setShowAddModal(false);
        setNewName(''); setNewStoreName(''); setNewEmail(''); setNewMobile(''); setNewPassword('');
      } else {
        alert(json.message || 'Failed to add seller');
      }
    } catch (err) { console.warn(err); }
    setSaving(false);
  };

  const handleAutoSettle = async (sellerId: string) => {
    if (!confirm('Auto-settle and execute full withdrawal transfer for this vendor?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/withdrawals/auto-settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: sellerId }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message || 'Vendor settled successfully!');
        fetchSellers();
      } else alert(json.message || 'Auto-settle failed');
    } catch (err) { alert('Error executing auto-settle'); }
    finally { setSaving(false); }
  };

  const handleAutoSettleAll = async () => {
    if (!confirm('Auto-settle withdrawable balances for ALL vendors with positive earnings?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/withdrawals/auto-settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message || 'All vendors auto-settled successfully!');
        fetchSellers();
      } else alert(json.message || 'Auto-settled failed');
    } catch (err) { alert('Error executing auto-settle all'); }
    finally { setSaving(false); }
  };

  const filtered = sellers.filter((s) => {
    const matchTab = activeTab === 'all' || s.status === activeTab;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mobile.includes(searchQuery);
    return matchTab && matchSearch;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Store size={24} className="text-[#0aad0a]" /> Vendor / Seller Management
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage registered vendor accounts and inspect live wallet balances</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchSellers} disabled={loading} className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={handleAutoSettleAll} disabled={saving} className="inline-flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold px-3 py-2 rounded-xl">
              <Wallet size={14} /> Auto-Settle All Vendors
            </button>
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-1.5 bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-bold px-4 py-2 rounded-xl">
              <Plus size={14} /> Add Seller
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-[#0aad0a] text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {tab} {tab === 'all' ? `(${sellers.length})` : `(${sellers.filter(s => s.status === tab).length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl">
          <div className="relative max-w-md">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, mobile..." className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading sellers from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Store size={36} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold">No sellers found</h4>
              <p className="text-xs text-gray-400">
                {sellers.length === 0 ? 'No seller accounts registered yet. Add a seller or have vendors register via the seller portal.' : 'No sellers match your filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Vendor / Store</th>
                    <th className="pb-3 px-3">Contact</th>
                    <th className="pb-3 px-3">City</th>
                    <th className="pb-3 px-3">Commission</th>
                    <th className="pb-3 px-3">Wallet (₦)</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <span className="font-bold text-white block">{s.store_name || s.name}</span>
                          <span className="text-[11px] text-gray-500">Owner: {s.name} · Joined {s.createdAt}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <span className="text-white block">{s.email}</span>
                          <span className="text-gray-400 text-[11px] font-mono">{s.mobile}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-300">{s.city}</td>
                      <td className="py-3 px-3 font-bold text-amber-400">{s.commission_rate}%</td>
                      <td className="py-3 px-3 font-bold text-[#0aad0a] font-mono">{formatNaira(s.balance)}</td>
                      <td className="py-3 px-3">
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full w-fit capitalize ${statusBadge(s.status)}`}>
                          {statusIcon(s.status)} {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.balance > 0 && (
                            <button
                              onClick={() => handleAutoSettle(s.id)}
                              disabled={saving}
                              className="bg-emerald-950/60 hover:bg-emerald-900 border border-[#0aad0a]/40 text-[#0aad0a] font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-all"
                              title="Auto-settle withdrawable balance"
                            >
                              Auto-Settle
                            </button>
                          )}
                          <button onClick={() => setSelectedSeller(s)} className="bg-[#0aad0a]/10 hover:bg-[#0aad0a] text-[#0aad0a] hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all">
                            Manage
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

      {/* Manage Seller Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 border border-gray-800 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedSeller(null)} className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"><X size={20} /></button>
            <div>
              <span className="text-xs font-bold text-[#0aad0a]">Seller Management</span>
              <h3 className="text-xl font-black">{selectedSeller.store_name}</h3>
              <p className="text-xs text-gray-400">Owner: {selectedSeller.name} · {selectedSeller.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-900/60 p-3 rounded-xl">
                <span className="text-gray-400 block">Wallet Balance</span>
                <span className="font-bold text-[#0aad0a] text-base font-mono">{formatNaira(selectedSeller.balance)}</span>
              </div>
              <div className="bg-gray-900/60 p-3 rounded-xl">
                <span className="text-gray-400 block">Commission Rate</span>
                <span className="font-bold text-amber-400 text-base">{selectedSeller.commission_rate}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Update Status</label>
              <div className="grid grid-cols-2 gap-2">
                {['approved', 'pending', 'rejected', 'suspended'].map((s) => (
                  <button key={s} disabled={saving || selectedSeller.status === s}
                    onClick={() => handleStatusUpdate(selectedSeller.id, s)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${selectedSeller.status === s ? 'opacity-60 cursor-default bg-gray-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}>
                    {s === 'approved' ? '✓ Approve' : s === 'rejected' ? '✗ Reject' : s === 'suspended' ? '⊘ Suspend' : '⏱ Pending'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => handleDelete(selectedSeller.id)} className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 font-bold px-4 py-2.5 rounded-xl text-xs">
                <Trash2 size={14} /> Delete Seller
              </button>
              <button onClick={() => setSelectedSeller(null)} className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-bold py-2.5 rounded-xl text-xs">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Seller Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 border border-gray-800 space-y-4 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"><X size={20} /></button>
            <h3 className="text-xl font-black">Add New Seller</h3>
            <form onSubmit={handleAddSeller} className="space-y-3">
              {[
                { label: 'Owner Full Name', value: newName, set: setNewName, placeholder: 'e.g. John Adeyemi' },
                { label: 'Store Name', value: newStoreName, set: setNewStoreName, placeholder: 'e.g. Fresh Farms Lagos' },
                { label: 'Email', value: newEmail, set: setNewEmail, placeholder: 'seller@example.com', type: 'email' },
                { label: 'Mobile', value: newMobile, set: setNewMobile, placeholder: '+234 800 000 0000', type: 'tel' },
                { label: 'Password', value: newPassword, set: setNewPassword, placeholder: 'Minimum 8 characters', type: 'password' },
              ].map(({ label, value, set, placeholder, type }) => (
                <div key={label} className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">{label}</label>
                  <input type={type || 'text'} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" required />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">City</label>
                  <input value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="Lagos"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">Commission (%)</label>
                  <input type="number" value={newCommission} onChange={(e) => setNewCommission(e.target.value)} min="0" max="100"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]" />
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3 rounded-xl text-xs mt-2 disabled:opacity-60">
                {saving ? 'Creating...' : 'Create Seller Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
