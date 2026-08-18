'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PackageCheck, 
  Search, 
  Eye, 
  X,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface ProductRequestItem {
  _id?: string;
  product_name: string;
  seller_id: number;
  category: string;
  brand: string;
  price: number;
  special_price: number;
  unit: string;
  stock: number;
  image: string;
  status: number; // 0 = pending, 1 = approved, 2 = rejected
  createdAt?: string;
}

export default function AdminProductRequestsPage() {
  const [requests, setRequests] = useState<ProductRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingItem, setInspectingItem] = useState<ProductRequestItem | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/product-requests');
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching product requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await fetch('/api/admin/product-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      fetchRequests();
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
    }
  };

  const filtered = requests.filter((r) =>
    r.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request by product name..."
              className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading product requests...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No pending vendor product requests. All catalog items up to date.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Item Details</th>
                    <th className="pb-3 px-3">Offer / Regular (₦)</th>
                    <th className="pb-3 px-3">Initial Stock</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={r.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150'} 
                            alt={r.product_name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-700 bg-gray-900" 
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{r.product_name}</div>
                            <span className="text-[11px] text-gray-400 font-mono">{r.unit || 'Standard'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-black text-[#0aad0a] font-mono text-sm">{formatNaira(r.special_price || r.price)}</div>
                        <span className="text-[11px] text-gray-500 line-through font-mono">{formatNaira(r.price)}</span>
                      </td>
                      <td className="py-3.5 px-3 text-white font-mono font-bold">
                        {r.stock || 0} units
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40 animate-pulse">
                          ● Pending Approval
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => r._id && handleAction(r._id, 'approve')}
                            className="bg-[#0aad0a] hover:bg-[#088f08] text-white px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-md shadow-[#0aad0a]/20"
                            title="Approve to Live Store"
                          >
                            <ThumbsUp size={13} /> Approve
                          </button>
                          <button
                            onClick={() => r._id && handleAction(r._id, 'reject')}
                            className="bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-400 hover:text-white px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1"
                            title="Reject Request"
                          >
                            <ThumbsDown size={13} /> Reject
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
    </div>
  );
}
