'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, Plus, Trash2, Edit3, Save, X, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { apiFetch } from '@/lib/api-fetch';

interface FaqItem {
  _id?: string;
  q: string;
  a: string;
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/admin/settings');
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.faqItems)) {
        setFaqs(json.data.faqItems);
      } else {
        setFaqs([]);
      }
    } catch (err) {
      console.warn('Error loading FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingIndex(null);
    setQuestion('');
    setAnswer('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: FaqItem, idx: number) => {
    setEditingIndex(idx);
    setQuestion(item.q);
    setAnswer(item.a);
    setIsModalOpen(true);
  };

  const saveFaqsToDb = async (updatedFaqs: FaqItem[]) => {
    setSubmitting(true);
    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({ faqItems: updatedFaqs }),
      });
      const json = await res.json();
      if (json.success) {
        setFaqs(updatedFaqs);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(json.message || 'Failed to save FAQs');
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving FAQs');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return alert('Question and answer are required');

    let updated: FaqItem[];
    if (editingIndex !== null) {
      updated = faqs.map((item, idx) => (idx === editingIndex ? { q: question.trim(), a: answer.trim() } : item));
    } else {
      updated = [{ q: question.trim(), a: answer.trim() }, ...faqs];
    }

    await saveFaqsToDb(updated);
    setIsModalOpen(false);
  };

  const handleDelete = async (idx: number) => {
    if (confirm('Are you sure you want to delete this FAQ item?')) {
      const updated = faqs.filter((_, i) => i !== idx);
      await saveFaqsToDb(updated);
    }
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin/settings" className="text-xs text-gray-400 hover:text-[#0aad0a] flex items-center gap-1">
                <ArrowLeft size={12} /> Back to Global Settings
              </Link>
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <HelpCircle size={24} className="text-[#0aad0a]" /> Customer Support FAQs Manager
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Add, edit, and organize frequently asked questions displayed on the storefront FAQ page in real time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchFaqs}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={openCreateModal}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add FAQ Question</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-950/80 border border-[#0aad0a] text-[#0aad0a] px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={16} /> Storefront FAQ list updated successfully!
          </div>
        )}

        {/* FAQs List */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading FAQs from database...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <HelpCircle size={36} className="mx-auto text-gray-500" />
              <h3 className="text-base font-bold text-white">No FAQ items defined</h3>
              <p className="text-xs text-gray-400">Click &apos;Add FAQ Question&apos; above to create support questions for storefront users.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <span className="text-[#0aad0a] font-mono text-xs">Q{idx + 1}.</span>
                      {faq.q}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed pl-6">{faq.a}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(faq, idx)}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-blue-400 transition-colors"
                      title="Edit Question"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-950 text-red-400 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black flex items-center gap-2">
                <HelpCircle size={20} className="text-[#0aad0a]" />
                {editingIndex !== null ? 'Edit FAQ Item' : 'Add FAQ Question'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">This will immediately update the live customer FAQ page</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Question Title</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. How fast is GroceryHub delivery?"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Detailed Answer</label>
                <textarea
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide a clear, helpful response..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all flex items-center justify-center gap-2"
              >
                {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
                <span>{editingIndex !== null ? 'Save FAQ Changes' : 'Publish FAQ Question'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
