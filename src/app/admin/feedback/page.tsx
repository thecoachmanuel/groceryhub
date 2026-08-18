'use client';

import { useState, useEffect } from 'react';
import { Star, Search, Trash2, RefreshCw } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface FeedbackItem {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
}

const formatFeedbackFromApi = (r: any): FeedbackItem => ({
  id: r._id,
  customerName: r.customer_name || r.user_id || 'Customer',
  productName: r.product_name || r.product_id || 'Product',
  rating: r.rating ?? r.value ?? 5,
  comment: r.comment || r.review || r.review_comment || '',
  date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-NG') : '—',
});

export default function AdminFeedbackPage() {
  const [reviews, setReviews] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/feedback');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setReviews(json.data.map(formatFeedbackFromApi));
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this review?')) return;
    try {
      await fetch('/api/admin/feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: id }),
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) { console.warn(err); }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';

  const filtered = reviews.filter((r) =>
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={11} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />
    ));

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2"><Star size={24} className="text-[#0aad0a]" /> Customer Feedback & Reviews</h1>
            <p className="text-xs text-gray-400 mt-0.5">All product reviews submitted by customers — moderate and remove as needed</p>
          </div>
          <button onClick={fetchReviews} disabled={loading} className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Stats pills */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl">
            <span className="text-xs text-gray-400 font-bold block">Total Reviews</span>
            <span className="text-2xl font-black text-white">{reviews.length}</span>
          </div>
          <div className="bg-[#1e2632] border border-amber-800/30 p-4 rounded-2xl">
            <span className="text-xs text-amber-400 font-bold block">Average Rating</span>
            <span className="text-2xl font-black text-amber-400">★ {avgRating}</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl">
          <div className="relative max-w-md">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by customer, product, or comment..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading reviews from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Star size={36} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold">No reviews found</h4>
              <p className="text-xs text-gray-400">
                {reviews.length === 0 ? 'No customer reviews yet. Reviews submitted by customers on product pages will appear here.' : 'No reviews match your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((r) => (
                <div key={r.id} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">{renderStars(r.rating)}</div>
                      <span className="text-xs font-bold text-white">{r.customerName}</span>
                      <span className="text-[10px] text-gray-500 ml-auto">{r.date}</span>
                    </div>
                    <p className="text-[11px] text-[#0aad0a] font-bold">{r.productName}</p>
                    <p className="text-xs text-gray-300">{r.comment || <span className="text-gray-500 italic">No written comment</span>}</p>
                  </div>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 transition-all self-start">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
