'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layout, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  ArrowLeft
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface SectionItem {
  _id?: string;
  title: string;
  type: string;
  visibility: string;
  status: 'Active' | 'Inactive';
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Custom');
  const [visibility, setVisibility] = useState('All Users');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sections');
      const data = await res.json();
      if (data.success) {
        setSections(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openCreateModal = () => {
    setEditingSection(null);
    setTitle('');
    setType('Custom');
    setVisibility('All Users');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (s: SectionItem) => {
    setEditingSection(s);
    setTitle(s.title);
    setType(s.type || 'Custom');
    setVisibility(s.visibility || 'All Users');
    setStatus(s.status || 'Active');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Section title is required');

    try {
      if (editingSection) {
        await fetch('/api/admin/sections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingSection._id, title, type, visibility, status }),
        });
      } else {
        await fetch('/api/admin/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, type, visibility, status }),
        });
      }
      setIsModalOpen(false);
      fetchSections();
    } catch (err) {
      console.error('Error saving section:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this Homepage Section?')) return;
    try {
      await fetch(`/api/admin/sections?id=${id}`, { method: 'DELETE' });
      fetchSections();
    } catch (err) {
      console.error('Error deleting section:', err);
    }
  };

  const filtered = sections.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin/home-screens" className="text-xs text-gray-400 hover:text-[#0aad0a] flex items-center gap-1">
                <ArrowLeft size={12} /> Back to Home Screens
              </Link>
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Layout size={24} className="text-[#0aad0a]" /> Content Sections Builder
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Build and sort dynamic homepage feeds, category sliders, and manual product collections
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Section</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content sections by title..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading content sections...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No content sections defined. Click Add New Section to create one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Section Title</th>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Visibility</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white text-sm">{s.title}</td>
                      <td className="py-3.5 px-3">
                        <span className="bg-gray-900 border border-gray-700 text-gray-300 font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase">
                          {s.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#0aad0a] font-semibold">{s.visibility}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            s.status === 'Active'
                              ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          ● {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                            title="Edit Section"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => s._id && handleDelete(s._id)}
                            className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                            title="Delete Section"
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
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">
                {editingSection ? 'Edit Content Section' : 'Create Content Section'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure feed section parameters, visibility, and category/brand sources
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Section Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Featured Organic Specials"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Section Type</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. Category"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="All Users">All Users</option>
                    <option value="Registered Users">Registered Users</option>
                    <option value="VIP Customers">VIP Customers</option>
                  </select>
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
                  {editingSection ? 'Save Section' : 'Create Section'}
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
