'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  CheckCircle2, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Store, 
  ArrowLeft, 
  Eye, 
  Tag, 
  Layers, 
  DollarSign, 
  Boxes,
  AlertCircle
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface ProductRequestItem {
  id: number;
  product_name: string;
  seller_id: number;
  seller_name: string;
  category_name: string;
  brand_name: string;
  price: number;
  special_price: number;
  unit: string;
  stock: number;
  image: string;
  submission_date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reject_reason?: string;
}

const INITIAL_REQUESTS: ProductRequestItem[] = [
  {
    id: 101,
    product_name: 'Organic Dragonfruit (Pitahaya) - 2pk',
    seller_id: 1,
    seller_name: 'Fresh Harvest Organics',
    category_name: 'Fresh Fruits & Vegetables',
    brand_name: 'Exotic Organic',
    price: 8.99,
    special_price: 6.99,
    unit: '2 pcs pack',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=150&auto=format&fit=crop&q=60',
    submission_date: '2026-08-17 19:20',
    status: 'Pending'
  },
  {
    id: 102,
    product_name: 'Grass-Fed Probiotic Kefir (Vanilla)',
    seller_id: 3,
    seller_name: 'Brooklyn Artisanal Dairy',
    category_name: 'Dairy & Breakfast',
    brand_name: 'Brooklyn Farms',
    price: 5.49,
    special_price: 4.89,
    unit: '32 fl oz bottle',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=60',
    submission_date: '2026-08-17 18:45',
    status: 'Pending'
  },
  {
    id: 103,
    product_name: 'Raw Unfiltered Wildflower Honey',
    seller_id: 2,
    seller_name: 'Green Valley Grocers',
    category_name: 'Pantry & Essentials',
    brand_name: 'Nature Nectar',
    price: 12.50,
    special_price: 10.99,
    unit: '16 oz jar',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=150&auto=format&fit=crop&q=60',
    submission_date: '2026-08-16 14:10',
    status: 'Approved'
  }
];

export default function AdminProductRequestsPage() {
  const [requests, setRequests] = useState<ProductRequestItem[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  
  // Reject Modal
  const [rejectingItem, setRejectingItem] = useState<ProductRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved', reject_reason: undefined } : r));
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;
    setRequests(prev => prev.map(r => r.id === rejectingItem.id ? {
      ...r,
      status: 'Rejected',
      reject_reason: rejectReason || 'Product does not meet quality or image guidelines.'
    } : r));
    setRejectingItem(null);
    setRejectReason('');
  };

  const filtered = requests.filter(r => {
    if (activeTab !== 'All' && r.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.product_name.toLowerCase().includes(q) ||
        r.seller_name.toLowerCase().includes(q) ||
        r.category_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin/products" className="text-xs text-gray-400 hover:text-[#0aad0a] flex items-center gap-1">
                <ArrowLeft size={12} /> Back to Product Catalog
              </Link>
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Package size={24} className="text-[#0aad0a]" /> Vendor Product Approval Queue
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Review, approve, or reject new product listings and pricing proposed by marketplace vendor partners
            </p>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/products" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            All Catalog Products
          </Link>
          <Link href="/admin/products/request" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <Package size={13} /> Product Review Requests ({pendingCount} pending)
          </Link>
          <Link href="/admin/stock" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Stock Management
          </Link>
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-[#1e2632] border border-gray-800 p-1.5 rounded-2xl w-fit text-xs font-bold">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab}</span>
                {tab === 'Pending' && pendingCount > 0 && (
                  <span className="bg-amber-400 text-gray-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, vendor, or category..."
              className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Product</th>
                  <th className="pb-3 px-3">Vendor / Store</th>
                  <th className="pb-3 px-3">Category & Brand</th>
                  <th className="pb-3 px-3">Pricing (List / Sale)</th>
                  <th className="pb-3 px-3">Initial Stock</th>
                  <th className="pb-3 px-3">Submitted</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={r.image} 
                          alt={r.product_name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-700 bg-gray-900" 
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{r.product_name}</div>
                          <span className="text-[11px] text-gray-400 font-mono">{r.unit}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-xs">{r.seller_name}</div>
                      <span className="text-[10px] text-[#0aad0a]">Verified Merchant</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="text-gray-300">{r.category_name}</div>
                      <span className="text-[11px] text-gray-400 font-semibold">{r.brand_name}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-black text-[#0aad0a] font-mono text-sm">${r.special_price.toFixed(2)}</div>
                      <span className="text-[11px] text-gray-500 line-through font-mono">${r.price.toFixed(2)}</span>
                    </td>
                    <td className="py-3.5 px-3 text-white font-mono font-bold">
                      {r.stock} units
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 text-[11px]">
                      {r.submission_date}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          r.status === 'Approved'
                            ? 'bg-emerald-950/60 text-[#0aad0a] border border-[#0aad0a]/30'
                            : r.status === 'Pending'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40 animate-pulse'
                            : 'bg-red-950/60 text-red-400 border border-red-800/40'
                        }`}
                      >
                        ● {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {r.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(r.id)}
                              className="bg-[#0aad0a] hover:bg-[#088f08] text-white px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-md shadow-[#0aad0a]/20 transition-all active:scale-95"
                              title="Approve Listing"
                            >
                              <ThumbsUp size={13} /> Approve
                            </button>
                            <button
                              onClick={() => setRejectingItem(r)}
                              className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all"
                              title="Reject Listing"
                            >
                              <ThumbsDown size={13} /> Reject
                            </button>
                          </>
                        ) : r.status === 'Approved' ? (
                          <button
                            onClick={() => setRejectingItem(r)}
                            className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                            title="Revoke Listing"
                          >
                            <X size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="p-1.5 hover:bg-emerald-950/40 rounded-lg text-gray-400 hover:text-[#0aad0a]"
                            title="Re-approve"
                          >
                            <ThumbsUp size={15} />
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

      {/* Reject Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setRejectingItem(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black text-red-400">Reject Product Request</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Explain reason for rejecting &quot;{rejectingItem.product_name}&quot;
              </p>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Feedback for Vendor</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Blurry product image or missing dietary barcode specification..."
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-red-400"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all"
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
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
