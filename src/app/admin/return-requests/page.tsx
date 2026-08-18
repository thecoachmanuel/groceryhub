'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RotateCcw, CheckCircle2, XCircle, Search, Eye, Filter } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

const INITIAL_REQUESTS = [
  { id: 'RET-1042', orderId: 'ORD-98241', customer: 'Alice Johnson', item: 'Fresh Organic Farm Broccoli (500g)', refundAmount: 3500, reason: 'Bruised during transit', proofImage: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300', date: 'Aug 17, 2026', status: 'Pending' },
  { id: 'RET-1041', orderId: 'ORD-98235', customer: 'Michael Scott', item: 'Farm Fresh Pure Whole Milk (1L)', refundAmount: 3800, reason: 'Packaging seal broken', proofImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300', date: 'Aug 16, 2026', status: 'Approved' },
  { id: 'RET-1040', orderId: 'ORD-98220', customer: 'Eleanor Shellstrop', item: 'Artisan Sourdough Bakery Bread (750g)', refundAmount: 3200, reason: 'Ordered wrong variant', proofImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', date: 'Aug 14, 2026', status: 'Rejected' },
];

export default function AdminReturnRequestsPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (newStatus === 'Approved') {
      const match = requests.find(r => r.id === id);
      alert(`Return ${id} approved! ${formatNaira(match?.refundAmount || 0)} credited to customer's wallet.`);
    }
  };

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <RotateCcw size={24} className="text-[#0aad0a]" /> Customer Return &amp; Refund Requests
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Inspect item condition, reason tickets, and process direct digital wallet credits in Naira (₦)</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ticket ID, Order ID, or customer..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="all">All Request Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved &amp; Refunded</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Ticket / Order</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Item Details</th>
                  <th className="pb-3 px-3">Refund Amount (₦)</th>
                  <th className="pb-3 px-3">Reason</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-bold text-white block font-mono">{r.id}</span>
                        <span className="text-[11px] text-gray-500 font-mono">{r.orderId}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-white font-medium">{r.customer}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                          <Image src={r.proofImage} alt={r.item} fill className="object-cover" />
                        </div>
                        <span className="truncate max-w-xs">{r.item}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#0aad0a] font-mono">{formatNaira(r.refundAmount)}</td>
                    <td className="py-3.5 px-3 text-gray-400">{r.reason}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        r.status === 'Approved'
                          ? 'bg-emerald-950/40 text-[#0aad0a]'
                          : r.status === 'Rejected'
                          ? 'bg-red-950/40 text-red-400'
                          : 'bg-amber-950/40 text-amber-500'
                      }`}>
                        ● {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {r.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(r.id, 'Approved')}
                            className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-bold px-3 py-1.5 rounded-xl text-[11px] transition-all flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 size={13} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'Rejected')}
                            className="bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-400 hover:text-white font-bold px-3 py-1.5 rounded-xl text-[11px] transition-all flex items-center gap-1"
                          >
                            <XCircle size={13} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-500 font-semibold">Resolved</span>
                      )}
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
