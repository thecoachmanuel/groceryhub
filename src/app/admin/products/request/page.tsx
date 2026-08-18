'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  PackageCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Eye, 
  Filter, 
  Clock, 
  AlertCircle, 
  Building2, 
  Tag, 
  X,
  ThumbsUp,
  ThumbsDown,
  Layers
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

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
    seller_name: 'Green Valley Organic Farms',
    category_name: 'Fresh Fruits & Vegetables',
    brand_name: 'Exotic Organic',
    price: 8900,
    special_price: 6900,
    unit: '2 pcs pack',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=150&auto=format&fit=crop&q=60',
    submission_date: '2026-08-17 19:20',
    status: 'Pending'
  },
  {
    id: 102,
    product_name: 'Grass-Fed Probiotic Kefir (Vanilla 1L)',
    seller_id: 3,
    seller_name: 'Daily Dairy & Poultry Fresh',
    category_name: 'Dairy & Breakfast',
    brand_name: 'Green Pastures',
    price: 5400,
    special_price: 4800,
    unit: '1L bottle',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=60',
    submission_date: '2026-08-17 18:45',
    status: 'Pending'
  },
  {
    id: 103,
    product_name: 'Raw Unfiltered Wildflower Honey (500g)',
    seller_id: 2,
    seller_name: 'SunFresh Orchard Produce',
    category_name: 'Pantry & Essentials',
    brand_name: 'Nature Nectar',
    price: 12500,
    special_price: 10900,
    unit: '500g jar',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=150&auto=format&fit=crop&q=60',
    submission_date: '2026-08-17 15:30',
    status: 'Pending'
  },
  {
    id: 104,
    product_name: 'Almond Flour Gluten-Free Sourdough (750g)',
    seller_id: 4,
    seller_name: 'The Artisanal Bakery Co.',
    category_name: 'Bakery & Snacks',
    brand_name: 'Pure Bake',
    price: 6500,
    special_price: 5900,
    unit: '1 loaf (750g)',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=60',
    submission_date: '2026-08-16 11:15',
    status: 'Approved'
  },
  {
    id: 105,
    product_name: 'Organic Hass Avocados Box of 8',
    seller_id: 1,
    seller_name: 'Green Valley Organic Farms',
    category_name: 'Fresh Fruits & Vegetables',
    brand_name: 'Avocado King',
    price: 14000,
    special_price: 12000,
    unit: 'Box of 8',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=150&auto=format&fit=crop&q=60',
    submission_date: '2026-08-15 09:40',
    status: 'Rejected',
    reject_reason: 'Image resolution below store guideline.'
  }
];

export default function AdminProductRequestsPage() {
  const [requests, setRequests] = useState<ProductRequestItem[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingItem, setRejectingItem] = useState<ProductRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [inspectingItem, setInspectingItem] = useState<ProductRequestItem | null>(null);

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  const handleApprove = (id: number) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved', reject_reason: undefined } : r))
    );
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;
    if (!rejectReason.trim()) return alert('Please enter a rejection reason.');

    setRequests((prev) =>
      prev.map((r) =>
        r.id === rejectingItem.id ? { ...r, status: 'Rejected', reject_reason: rejectReason.trim() } : r
      )
    );
    setRejectingItem(null);
    setRejectReason('');
  };

  const filtered = requests.filter((r) => {
    const matchesTab = activeTab === 'All' ? true : r.status === activeTab;
    const matchesSearch =
      r.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <PackageCheck size={24} className="text-[#0aad0a]" /> Vendor Product Approval Pipeline
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Review and authorize new product catalog submissions from registered merchant stores in Naira (₦)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              Main Store Catalog
            </Link>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/products" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            All Store Catalog Items
          </Link>
          <Link href="/admin/products/request" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <PackageCheck size={13} /> Product Requests &amp; Approvals ({pendingCount} pending)
          </Link>
          <Link href="/admin/categories" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Product Categories
          </Link>
          <Link href="/admin/brands" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Brand Partners
          </Link>
        </div>

        {/* Filters */}
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
                <span>{tab} Requests</span>
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
              placeholder="Search request by product or vendor..."
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
                  <th className="pb-3 px-3">Item Details</th>
                  <th className="pb-3 px-3">Merchant / Vendor</th>
                  <th className="pb-3 px-3">Category &amp; Brand</th>
                  <th className="pb-3 px-3">Offer / Regular (₦)</th>
                  <th className="pb-3 px-3">Initial Stock</th>
                  <th className="pb-3 px-3">Submitted</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Moderation Actions</th>
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
                      <div className="font-black text-[#0aad0a] font-mono text-sm">{formatNaira(r.special_price)}</div>
                      <span className="text-[11px] text-gray-500 line-through font-mono">{formatNaira(r.price)}</span>
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
                      {r.reject_reason && (
                        <p className="text-[10px] text-red-400 mt-1 truncate max-w-xs">{r.reject_reason}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {r.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(r.id)}
                              className="bg-[#0aad0a] hover:bg-[#088f08] text-white px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-md shadow-[#0aad0a]/20"
                              title="Approve to Live Store"
                            >
                              <ThumbsUp size={13} /> Approve
                            </button>
                            <button
                              onClick={() => setRejectingItem(r)}
                              className="bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-400 hover:text-white px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1"
                              title="Reject Request"
                            >
                              <ThumbsDown size={13} /> Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setInspectingItem(r)}
                            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
                            title="Inspect Details"
                          >
                            <Eye size={15} />
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

      {/* Inspect Item Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setInspectingItem(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4">
              <img 
                src={inspectingItem.image} 
                alt={inspectingItem.product_name} 
                className="w-20 h-20 rounded-2xl object-cover border border-gray-700"
              />
              <div>
                <h3 className="text-lg font-black text-white">{inspectingItem.product_name}</h3>
                <span className="text-xs text-[#0aad0a] font-semibold">{inspectingItem.seller_name}</span>
                <p className="text-[11px] text-gray-400">{inspectingItem.category_name} &bull; {inspectingItem.brand_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-900/60 rounded-2xl border border-gray-800 text-xs">
              <div>
                <span className="text-gray-500 block">Offer Price:</span>
                <span className="font-bold text-[#0aad0a] font-mono text-sm">{formatNaira(inspectingItem.special_price)}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Regular Price:</span>
                <span className="font-bold text-gray-300 font-mono line-through">{formatNaira(inspectingItem.price)}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Packaging:</span>
                <span className="font-bold text-white">{inspectingItem.unit}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Initial Stock:</span>
                <span className="font-bold text-white">{inspectingItem.stock} units</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
