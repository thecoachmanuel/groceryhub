'use client';

import { useState } from 'react';
import { HelpCircle, Plus, Search, Trash2, Edit3, CheckCircle2, X, Filter } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  status: 'Published' | 'Draft';
}

const INITIAL_FAQS: FaqItem[] = [
  { id: 1, question: 'How quickly will my grocery order be delivered?', answer: 'We specialize in express hyper-local grocery delivery. Orders are typically packed and delivered within 25–35 minutes of placement.', category: 'Delivery', status: 'Published' },
  { id: 2, question: 'What payment methods do you support?', answer: 'We accept Credit/Debit Cards via Stripe, Cash on Delivery (COD), Digital Store Wallet, and PayPal.', category: 'Payments', status: 'Published' },
  { id: 3, question: 'How do returns and refunds work?', answer: 'If an item is damaged or missing, you can submit a return request with photos directly from your Order History for an instant refund to your digital wallet.', category: 'Returns', status: 'Published' },
  { id: 4, question: 'Are all vegetables and fruits organic and farm-fresh?', answer: 'Yes! All fresh produce is sourced directly from certified organic local farms and quality inspected before dispatch.', category: 'General', status: 'Published' },
];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setStatus('Published');
    setIsModalOpen(true);
  };

  const openEditModal = (f: FaqItem) => {
    setEditingFaq(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setStatus(f.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return alert('Question is required');

    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editingFaq.id ? { ...f, question, answer, category, status } : f
        )
      );
    } else {
      const newFaq: FaqItem = {
        id: Date.now(),
        question,
        answer,
        category,
        status,
      };
      setFaqs([newFaq, ...faqs]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this FAQ entry?')) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: f.status === 'Published' ? 'Draft' : 'Published' } : f
      )
    );
  };

  const filtered = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      categoryFilter === 'all' || f.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <HelpCircle size={24} className="text-[#0aad0a]" /> Customer FAQ Knowledge Base
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage public help center frequently asked questions and category answers
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add FAQ Question</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or answers..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="all">All Topics</option>
              <option value="general">General</option>
              <option value="delivery">Delivery</option>
              <option value="payments">Payments</option>
              <option value="returns">Returns</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Question</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Answer Snippet</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white max-w-xs">{f.question}</td>
                    <td className="py-3.5 px-3">
                      <span className="bg-gray-800 text-gray-300 font-bold px-2 py-0.5 rounded-lg">
                        {f.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 max-w-sm truncate">{f.answer}</td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(f.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          f.status === 'Published'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        ● {f.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(f)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit FAQ"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                          title="Delete FAQ"
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
              <h3 className="text-xl font-black">{editingFaq ? 'Edit FAQ' : 'Add FAQ Question'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set customer question, help category, and detailed answer
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. How do I track my active grocery order?"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="General">General</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Payments">Payments</option>
                    <option value="Returns">Returns & Refunds</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Detailed Answer</label>
                <textarea
                  rows={5}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write clear explanation..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] leading-relaxed"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingFaq ? 'Save FAQ Changes' : 'Publish FAQ Question'}
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
