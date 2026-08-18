'use client';

import { useState } from 'react';
import { Receipt, Plus, Trash2, Edit3, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const INITIAL_TAXES = [
  { id: 1, title: 'Standard Grocery VAT', percentage: 5.0, status: 'Active' },
  { id: 2, title: 'Organic Essentials Tax Exempt', percentage: 0.0, status: 'Active' },
  { id: 3, title: 'Imported Gourmet GST', percentage: 8.5, status: 'Active' },
];

export default function AdminTaxesPage() {
  const [taxes, setTaxes] = useState(INITIAL_TAXES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [percentage, setPercentage] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newTax = {
      id: Date.now(),
      title,
      percentage: parseFloat(percentage || '0'),
      status: 'Active',
    };
    setTaxes([...taxes, newTax]);
    setShowAddModal(false);
    setTitle('');
    setPercentage('');
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Receipt size={24} className="text-[#0aad0a]" /> Tax & VAT Rates Configuration
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
                  <tr key={t.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white">{t.title}</td>
                    <td className="py-3.5 px-3 font-bold text-[#0aad0a]">{t.percentage.toFixed(1)}%</td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/40 text-[#0aad0a]">
                        ● {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setTaxes(taxes.filter((item) => item.id !== t.id))}
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
