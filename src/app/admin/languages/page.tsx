'use client';

import { useState } from 'react';
import { Globe, Plus, Search, Trash2, Edit3, CheckCircle2, X, ArrowLeftRight } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface LanguageItem {
  id: number;
  name: string;
  code: string;
  isRtl: boolean;
  isDefault: boolean;
  status: 'Active' | 'Inactive';
}

const INITIAL_LANGUAGES: LanguageItem[] = [
  { id: 1, name: 'English (US)', code: 'en', isRtl: false, isDefault: true, status: 'Active' },
  { id: 2, name: 'Arabic (العربية)', code: 'ar', isRtl: true, isDefault: false, status: 'Active' },
  { id: 3, name: 'Spanish (Español)', code: 'es', isRtl: false, isDefault: false, status: 'Active' },
  { id: 4, name: 'French (Français)', code: 'fr', isRtl: false, isDefault: false, status: 'Active' },
  { id: 5, name: 'Hindi (हिन्दी)', code: 'hi', isRtl: false, isDefault: false, status: 'Active' },
];

export default function AdminLanguagesPage() {
  const [languages, setLanguages] = useState<LanguageItem[]>(INITIAL_LANGUAGES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<LanguageItem | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isRtl, setIsRtl] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [searchQuery, setSearchQuery] = useState('');

  const openCreateModal = () => {
    setEditingLang(null);
    setName('');
    setCode('');
    setIsRtl(false);
    setIsDefault(false);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (lang: LanguageItem) => {
    setEditingLang(lang);
    setName(lang.name);
    setCode(lang.code);
    setIsRtl(lang.isRtl);
    setIsDefault(lang.isDefault);
    setStatus(lang.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return alert('Name and language code are required');

    if (isDefault) {
      // Unset other defaults
      setLanguages((prev) => prev.map((l) => ({ ...l, isDefault: false })));
    }

    if (editingLang) {
      setLanguages((prev) =>
        prev.map((l) =>
          l.id === editingLang.id ? { ...l, name, code: code.toLowerCase(), isRtl, isDefault, status } : l
        )
      );
    } else {
      const newLang: LanguageItem = {
        id: Date.now(),
        name,
        code: code.toLowerCase(),
        isRtl,
        isDefault,
        status,
      };
      setLanguages([newLang, ...languages]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    const target = languages.find((l) => l.id === id);
    if (target?.isDefault) return alert('Cannot delete default system language');
    if (confirm('Are you sure you want to delete this language locale?')) {
      setLanguages((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setLanguages((prev) =>
      prev.map((l) => ({
        ...l,
        isDefault: l.id === id,
      }))
    );
  };

  const filtered = languages.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Globe size={24} className="text-[#0aad0a]" /> Multi-Language & RTL Locale Configuration
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage international storefront languages, ISO-639 locale codes, and Right-to-Left (RTL) text rendering
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Language</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language name or code..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Language</th>
                  <th className="pb-3 px-3">Locale Code</th>
                  <th className="pb-3 px-3">Text Direction</th>
                  <th className="pb-3 px-3">Default Status</th>
                  <th className="pb-3 px-3">Active Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white text-sm">{l.name}</td>
                    <td className="py-3.5 px-3 font-mono text-xs uppercase text-gray-300 font-bold">
                      {l.code}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        l.isRtl ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' : 'bg-gray-800 text-gray-300'
                      }`}>
                        {l.isRtl ? 'RTL (Right-to-Left)' : 'LTR (Left-to-Right)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {l.isDefault ? (
                        <span className="text-[10px] font-black bg-emerald-950/60 text-[#0aad0a] border border-[#0aad0a]/40 px-2.5 py-1 rounded-full">
                          ★ Default System
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(l.id)}
                          className="text-[10px] text-gray-400 hover:text-white font-semibold underline"
                        >
                          Make Default
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        l.status === 'Active'
                          ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        ● {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(l)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit Language"
                        >
                          <Edit3 size={15} />
                        </button>
                        {!l.isDefault && (
                          <button
                            onClick={() => handleDelete(l.id)}
                            className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                            title="Delete Language"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">{editingLang ? 'Edit Language Locale' : 'Add New Language'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set locale code, language display name, and text direction
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Language Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arabic (العربية)"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Locale Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. ar or es"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono uppercase focus:outline-none focus:border-[#0aad0a]"
                    required
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
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-gray-300">
                  <input
                    type="checkbox"
                    checked={isRtl}
                    onChange={(e) => setIsRtl(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0aad0a] bg-gray-900 border-gray-700 focus:ring-0"
                  />
                  <span>Enable Right-to-Left (RTL) Layout</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-gray-300">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0aad0a] bg-gray-900 border-gray-700 focus:ring-0"
                  />
                  <span>Set as Default Storefront Language</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingLang ? 'Save Language' : 'Create Language'}
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
