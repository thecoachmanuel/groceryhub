'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Plus, Search, Trash2, X, RefreshCw, CheckCircle2, Clock, AlertCircle, DollarSign, Receipt } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface DriverItem {
  id: string;
  name: string;
  mobile: string;
  email: string;
  vehicle_type: string;
  vehicle_description: string;
  license_number: string;
  city: string;
  cashInHand: number;
  balance: number;
  trip_bonus: number;
  is_available: boolean;
  status: string;
  createdAt: string;
}

const formatDriverFromApi = (d: any): DriverItem => ({
  id: d._id,
  name: d.name || 'Rider',
  mobile: d.mobile || '—',
  email: d.email || '—',
  vehicle_type: d.vehicle_type || 'Motorcycle',
  vehicle_description: d.vehicle_description || '',
  license_number: d.license_number || '—',
  city: d.city || 'Lagos',
  cashInHand: d.cash_in_hand ?? 0,
  balance: d.balance ?? 0,
  trip_bonus: d.trip_bonus ?? 500,
  is_available: d.is_available ?? true,
  status: d.status || 'pending',
  createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-NG') : '—',
});

const statusBadge = (status: string) => {
  switch (status) {
    case 'on_duty': return 'bg-emerald-950/40 text-[#0aad0a]';
    case 'pending': return 'bg-amber-950/40 text-amber-400';
    case 'offline': return 'bg-gray-800 text-gray-400';
    case 'suspended': return 'bg-red-950/40 text-red-400';
    default: return 'bg-gray-800 text-gray-400';
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'on_duty': return 'On Duty';
    case 'pending': return 'Pending';
    case 'offline': return 'Offline';
    case 'suspended': return 'Suspended';
    default: return status;
  }
};

export default function AdminDeliveryFleetPage() {
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'on_duty' | 'offline' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<DriverItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', email: '', vehicle_type: 'Motorcycle / Scooter', vehicle_description: '', license_number: '', city: 'Lagos', password: '' });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/delivery-boys');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDrivers(json.data.map(formatDriverFromApi));
      }
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setSaving(true);
    try {
      await fetch('/api/admin/delivery-boys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riderId: id, status }),
      });
      setDrivers((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
      if (selectedDriver?.id === id) setSelectedDriver((d) => d ? { ...d, status } : null);
    } catch (err) { console.warn(err); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this rider?')) return;
    try {
      await fetch('/api/admin/delivery-boys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riderId: id }),
      });
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      setSelectedDriver(null);
    } catch (err) { console.warn(err); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/delivery-boys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'pending' }),
      });
      const json = await res.json();
      if (json.success) {
        setDrivers((prev) => [formatDriverFromApi(json.data), ...prev]);
        setShowAddModal(false);
        setForm({ name: '', mobile: '', email: '', vehicle_type: 'Motorcycle / Scooter', vehicle_description: '', license_number: '', city: 'Lagos', password: '' });
      } else { alert(json.message || 'Failed to add rider'); }
    } catch (err) { console.warn(err); }
    setSaving(false);
  };

  const filtered = drivers.filter((d) => {
    const matchTab = activeTab === 'all' || d.status === activeTab;
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.mobile.includes(searchQuery);
    return matchTab && matchSearch;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2"><Truck size={24} className="text-[#0aad0a]" /> Delivery Fleet Management</h1>
            <p className="text-xs text-gray-400 mt-0.5">Live rider database — approve, suspend, track cash-in-hand</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchDrivers} disabled={loading} className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-1.5 bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-bold px-4 py-2 rounded-xl">
              <Plus size={14} /> Add Rider
            </button>
            <Link href="/admin/delivery-boys/cash-collection" className="inline-flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-2 rounded-xl">
              <DollarSign size={14} /> Cash Collection
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'on_duty', 'pending', 'offline', 'suspended'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-[#0aad0a] text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {statusLabel(tab)} {tab === 'all' ? `(${drivers.length})` : `(${drivers.filter(d => d.status === tab).length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl">
          <div className="relative max-w-md">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search name or mobile..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading fleet from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Truck size={36} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold">No riders found</h4>
              <p className="text-xs text-gray-400">
                {drivers.length === 0 ? 'No delivery riders registered yet. Add a rider or have them register via the rider portal.' : 'No riders match your filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Rider</th>
                    <th className="pb-3 px-3">Contact</th>
                    <th className="pb-3 px-3">Vehicle</th>
                    <th className="pb-3 px-3">Cash in Hand</th>
                    <th className="pb-3 px-3">Wallet Balance</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{d.name}</span>
                        <span className="text-[11px] text-gray-500">Joined {d.createdAt}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-white block">{d.mobile}</span>
                        <span className="text-gray-400 text-[11px]">{d.email}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-300">{d.vehicle_description || d.vehicle_type}</td>
                      <td className="py-3 px-3 font-bold text-amber-400 font-mono">{formatNaira(d.cashInHand)}</td>
                      <td className="py-3 px-3 font-bold text-[#0aad0a] font-mono">{formatNaira(d.balance)}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${statusBadge(d.status)}`}>
                          ● {statusLabel(d.status)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button onClick={() => setSelectedDriver(d)} className="bg-[#0aad0a]/10 hover:bg-[#0aad0a] text-[#0aad0a] hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Manage Rider Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 border border-gray-800 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedDriver(null)} className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"><X size={20} /></button>
            <div>
              <span className="text-xs font-bold text-[#0aad0a]">Rider Management</span>
              <h3 className="text-xl font-black">{selectedDriver.name}</h3>
              <p className="text-xs text-gray-400">{selectedDriver.mobile} · {selectedDriver.vehicle_description || selectedDriver.vehicle_type}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-900/60 p-3 rounded-xl">
                <span className="text-gray-400 block">Cash In Hand</span>
                <span className="font-bold text-amber-400 text-base font-mono">{formatNaira(selectedDriver.cashInHand)}</span>
              </div>
              <div className="bg-gray-900/60 p-3 rounded-xl">
                <span className="text-gray-400 block">Trip Bonus</span>
                <span className="font-bold text-[#0aad0a] text-base font-mono">{formatNaira(selectedDriver.trip_bonus)}/trip</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Update Status</label>
              <div className="grid grid-cols-2 gap-2">
                {[['on_duty', '✓ Activate'], ['pending', '⏱ Set Pending'], ['offline', '— Mark Offline'], ['suspended', '⊘ Suspend']].map(([s, label]) => (
                  <button key={s} disabled={saving || selectedDriver.status === s}
                    onClick={() => handleStatusUpdate(selectedDriver.id, s)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${selectedDriver.status === s ? 'opacity-60 cursor-default bg-gray-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => handleDelete(selectedDriver.id)} className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 font-bold px-4 py-2.5 rounded-xl text-xs">
                <Trash2 size={14} /> Remove
              </button>
              <button onClick={() => setSelectedDriver(null)} className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-bold py-2.5 rounded-xl text-xs">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Rider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 border border-gray-800 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"><X size={20} /></button>
            <h3 className="text-xl font-black">Add New Rider</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'e.g. Marcus Adeyemi' },
                { label: 'Mobile', key: 'mobile', placeholder: '+234 900 000 0000', type: 'tel' },
                { label: 'Email', key: 'email', placeholder: 'rider@example.com', type: 'email' },
                { label: 'Vehicle Type', key: 'vehicle_type', placeholder: 'e.g. Motorcycle / Scooter' },
                { label: 'Vehicle Description', key: 'vehicle_description', placeholder: 'e.g. Honda Super Cub 125cc (LAG-8492)' },
                { label: 'License No.', key: 'license_number', placeholder: 'e.g. DL-LAG-89104' },
                { label: 'City', key: 'city', placeholder: 'e.g. Lagos' },
                { label: 'Password', key: 'password', placeholder: 'Minimum 8 characters', type: 'password' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">{label}</label>
                  <input type={type || 'text'} value={form[key as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required={['name', 'mobile', 'password'].includes(key)} />
                </div>
              ))}
              <button type="submit" disabled={saving} className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3 rounded-xl text-xs mt-2 disabled:opacity-60">
                {saving ? 'Adding...' : 'Add Rider to Fleet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
