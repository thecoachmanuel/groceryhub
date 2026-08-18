'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  MessageSquare, 
  Search, 
  Trash2, 
  CheckCircle2, 
  User, 
  ShoppingBag,
  Eye,
  EyeOff,
  ThumbsUp,
  Filter
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface FeedbackItem {
  id: number;
  productName: string;
  orderId: string;
  customerName: string;
  customerMobile: string;
  rating: number;
  title: string;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  date: string;
  isApproved: boolean;
  verifiedBuyer: boolean;
}

const INITIAL_FEEDBACK: FeedbackItem[] = [
  { 
    id: 1, 
    productName: 'Fresh Organic Farm Broccoli', 
    orderId: 'ORD-98240', 
    customerName: 'Amina Bello', 
    customerMobile: '+234 803 111 2222', 
    rating: 5, 
    title: 'Extremely fresh and crisp!',
    comment: 'Groceries arrived in under 20 minutes! Broccoli and avocados were extremely fresh and organic.', 
    sentiment: 'Positive', 
    date: 'Aug 17, 2026', 
    isApproved: true, 
    verifiedBuyer: true 
  },
  { 
    id: 2, 
    productName: 'Pasture-Raised Grade A Eggs', 
    orderId: 'ORD-98238', 
    customerName: 'Emeka Nwosu', 
    customerMobile: '+234 802 345 6789', 
    rating: 5, 
    title: 'Top tier grocery quality',
    comment: 'Driver was very polite and used the insulated delivery bag. Perfect experience.', 
    sentiment: 'Positive', 
    date: 'Aug 17, 2026', 
    isApproved: true, 
    verifiedBuyer: true 
  },
  { 
    id: 3, 
    productName: 'Baby Spinach (250g Pack)', 
    orderId: 'ORD-98235', 
    customerName: 'Fatima Sanusi', 
    customerMobile: '+234 809 555 6789', 
    rating: 3, 
    title: 'Fast delivery, minor packing issue',
    comment: 'Delivery was on time but one spinach box had slight bruised leaves.', 
    sentiment: 'Neutral', 
    date: 'Aug 16, 2026', 
    isApproved: true, 
    verifiedBuyer: true 
  },
  { 
    id: 4, 
    productName: 'Cold-Pressed Valencia Orange Juice', 
    orderId: 'ORD-98230', 
    customerName: 'Chinedu Okafor', 
    customerMobile: '+234 805 444 3333', 
    rating: 5, 
    title: 'NutriGuide recommended perfect produce',
    comment: 'NutriGuide recommended great high-protein produce. Very easy Paystack checkout.', 
    sentiment: 'Positive', 
    date: 'Aug 16, 2026', 
    isApproved: true, 
    verifiedBuyer: true 
  },
];

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this customer feedback record?')) {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleToggleApproval = (id: number) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isApproved: !f.isApproved } : f))
    );
  };

  const filtered = feedbacks.filter((f) => {
    const matchesSearch =
      f.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || String(f.rating) === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const avgRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Star size={24} className="text-amber-400 fill-amber-400" /> Customer Ratings &amp; Reviews Moderation
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Moderate verified customer ratings, product reviews, and delivery experience sentiment
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
            <span className="text-xs font-bold text-gray-400">Average Platform Rating</span>
            <div className="text-3xl font-black text-amber-400 font-mono flex items-center gap-2">
              <span>{avgRating}</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            <span className="text-[11px] text-[#0aad0a] font-semibold">Across {feedbacks.length} verified reviews</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
            <span className="text-xs font-bold text-gray-400">Positive Sentiment Ratio</span>
            <div className="text-3xl font-black text-[#0aad0a] font-mono">
              {Math.round((feedbacks.filter((f) => f.sentiment === 'Positive').length / feedbacks.length) * 100)}%
            </div>
            <span className="text-[11px] text-gray-400 font-semibold">Customer satisfaction benchmark</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
            <span className="text-xs font-bold text-gray-400">Verified Buyer Reviews</span>
            <div className="text-3xl font-black text-blue-400 font-mono">
              {feedbacks.filter((f) => f.verifiedBuyer).length} / {feedbacks.length}
            </div>
            <span className="text-[11px] text-gray-400 font-semibold">100% verified order buyers</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex bg-[#1e2632] border border-gray-800 p-1.5 rounded-2xl w-fit text-xs font-bold">
            {['all', '5', '4', '3', '2', '1'].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  ratingFilter === r
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'All Ratings' : `${r} ★`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feedback by customer or product..."
              className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Product &amp; Order</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Star Rating</th>
                  <th className="pb-3 px-3">Review &amp; Feedback</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Moderation</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-xs">{f.productName}</div>
                      <span className="text-[11px] text-[#0aad0a] font-mono">{f.orderId}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>{f.customerName}</span>
                        {f.verifiedBuyer && (
                          <span className="bg-emerald-950/60 text-[#0aad0a] border border-[#0aad0a]/30 text-[9px] font-black px-1.5 py-0.2 rounded-md">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">{f.customerMobile}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill={i < f.rating ? 'currentColor' : 'none'} className={i >= f.rating ? 'text-gray-700' : ''} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 max-w-sm">
                      <div className="font-bold text-white text-xs">{f.title}</div>
                      <p className="text-gray-400 text-[11px] truncate">{f.comment}</p>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 text-[11px]">
                      {f.date}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleApproval(f.id)}
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          f.isApproved
                            ? 'bg-emerald-950/60 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        ● {f.isApproved ? 'Approved (Live)' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
