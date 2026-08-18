'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  ArrowLeft,
  FolderPlus
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface GroupCategoryItem {
  _id?: string;
  name: string;
  description: string;
  categories?: string[];
  icon?: string;
  status: 'Active' | 'Inactive';
}

export default function AdminGroupCategoryPage() {
  const [groups, setGroups] = useState<GroupCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupCategoryItem | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/group-categories');
      const data = await res.json();
      if (data.success) {
        setGroups(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching group categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const openCreateModal = () => {
    setEditingGroup(null);
    setName('');
    setDescription('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (g: GroupCategoryItem) => {
    setEditingGroup(g);
    setName(g.name);
    setDescription(g.description || '');
    setStatus(g.status || 'Active');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Group name is required');

    try {
      if (editingGroup) {
        await fetch('/api/admin/group-categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingGroup._id, name, description, status }),
        });
      } else {
        await fetch('/api/admin/group-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, status }),
        });
      }
      setIsModalOpen(false);
      fetchGroups();
    } catch (err) {
      console.error('Error saving group category:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Category Group?')) return;
    try {
      await fetch(`/api/admin/group-categories?id=${id}`, { method: 'DELETE' });
      fetchGroups();
    } catch (err) {
      console.error('Error deleting group category:', err);
    }
  };

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin/categories" className="text-xs text-gray-400 hover:text-[#0aad0a] flex items-center gap-1">
                <ArrowLeft size={12} /> Back to Categories
              </Link>
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <FolderPlus size={24} className="text-[#0aad0a]" /> Group Categories
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage parent category groupings that cluster related product departments on mobile and web
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/header-category"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-colors"
            >
              <Layers size={14} /> Header Categories
            </Link>
            <button
              onClick={openCreateModal}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Create Group</span>
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
              placeholder="Search group categories by name..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading category groups...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No category groups found. Click Create Group to add one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Group Name</th>
                    <th className="pb-3 px-3">Description</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((g) => (
                    <tr key={g._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white text-sm">{g.name}</td>
                      <td className="py-3.5 px-3 text-gray-400 max-w-xs truncate">
                        {g.description || '—'}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            g.status === 'Active'
                              ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          ● {g.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(g)}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                            title="Edit Group"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => g._id && handleDelete(g._id)}
                            className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                            title="Delete Group"
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

      {/* Create / Edit Modal */}
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
                {editingGroup ? 'Edit Category Group' : 'Create Category Group'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Organize multiple product categories into a single unified department grouping
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Group Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farm Fresh Produce"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of what products belong in this group..."
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
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
                  {editingGroup ? 'Save Group Updates' : 'Create Group Category'}
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
