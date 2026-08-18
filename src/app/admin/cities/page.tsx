'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Plus, Search, Trash2, Edit3, MapPin, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface CityItem {
  _id?: string;
  name: string;
  state: string;
  country: string;
  status: 'Active' | 'Inactive';
}

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityItem | null>(null);

  const [name, setName] = useState('');
  const [state, setState] = useState('Lagos');
  const [country, setCountry] = useState('Nigeria');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/cities');
      const data = await res.json();
      if (data.success) {
        setCities(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const openCreateModal = () => {
    setEditingCity(null);
    setName('');
    setState('Lagos');
    setCountry('Nigeria');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (c: CityItem) => {
    setEditingCity(c);
    setName(c.name);
    setState(c.state || 'Lagos');
    setCountry(c.country || 'Nigeria');
    setStatus(c.status || 'Active');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('City name is required');

    try {
      if (editingCity) {
        await fetch('/api/admin/cities', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCity._id, name, state, country, status }),
        });
      } else {
        await fetch('/api/admin/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, state, country, status }),
        });
      }
      setIsModalOpen(false);
      fetchCities();
    } catch (err) {
      console.error('Error saving city:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this city territory?')) return;
    try {
      await fetch(`/api/admin/cities?id=${id}`, { method: 'DELETE' });
      fetchCities();
    } catch (err) {
      console.error('Error deleting city:', err);
    }
  };

  const filtered = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Building size={24} className="text-[#0aad0a]" /> City Jurisdictions
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage serviceable municipal territories, geolocation coordinates, and deliverable area zones
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Serviceable City</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city or state..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading cities...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No city jurisdictions configured. Click Add Serviceable City to add one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">City Region</th>
                    <th className="pb-3 px-3">State / Province</th>
                    <th className="pb-3 px-3">Country</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white text-sm">{c.name}</td>
                      <td className="py-3.5 px-3 text-gray-300">{c.state}</td>
                      <td className="py-3.5 px-3 text-gray-400">{c.country}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            c.status === 'Active'
                              ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          ● {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                            title="Edit City"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => c._id && handleDelete(c._id)}
                            className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                            title="Delete City"
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
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">
                {editingCity ? 'Edit City Jurisdiction' : 'Add New Serviceable City'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set city name, state, and country
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">City Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">State / Region</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Lagos"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Nigeria"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingCity ? 'Save City Updates' : 'Add City'}
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
