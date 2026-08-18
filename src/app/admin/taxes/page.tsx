'use client';

import { useState, useEffect } from 'react';
import { Receipt, Plus, Trash2, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface TaxItem {
  _id?: string;
  title: string;
  percentage: number;
  status: 'Active' | 'Inactive';
}

export default function AdminTaxesPage() {
  const [taxes, setTaxes] = useState<TaxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [percentage, setPercentage] = useState('');

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/taxes');
      const data = await res.json();
      if (data.success) {
        setTaxes(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching taxes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/taxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, percentage: parseFloat(percentage || '0'), status: 'Active' }),
      });
      setShowAddModal(false);
      setTitle('');
      setPercentage('');
      fetchTaxes();
    } catch (err) {
      console.error('Error creating tax:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tax rule?')) return;
    try {
      await fetch(`/api/admin/taxes?id=${id}`, { method: 'DELETE' });
      fetchTaxes();
    } catch (err) {
      console.error('Error deleting tax:', err);
    }
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Receipt size={24} className="text-[#0aad0a]" /> Tax &amp; VAT Rates Configuration
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Define sales tax, GST, and VAT brackets applied automatically during checkout</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Tax Rate</span>
          </button>
        </div>

        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading tax rules...</div>
          ) : taxes.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No tax rules configured. Click Add Tax Rate to create one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Tax Title / Rule</th>
                    <th className="pb-3 px-3">Percentage (%)</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {taxes.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white">{t.title}</td>
                      <td className="py-3.5 px-3 font-bold text-[#0aad0a]">{Number(t.percentage || 0).toFixed(1)}%</td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/40 text-[#0aad0a]">
                          ● {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => t._id && handleDelete(t._id)}
                            className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black">Add Tax Rule</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Tax Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. State Sales Tax"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Percentage Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="5.0"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30"
                >
                  Save Tax Rate
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
