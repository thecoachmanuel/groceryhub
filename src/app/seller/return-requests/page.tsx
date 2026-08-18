'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RotateCcw, CheckCircle2, XCircle, Search, Eye, X, AlertCircle } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';

interface ReturnRequestItem {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  productImage: string;
  refundAmount: number;
  reason: string;
  proofImage?: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const INITIAL_RETURNS: ReturnRequestItem[] = [
  {
    id: 'RET-401',
    orderId: 'ORD-98235',
    customerName: 'Emma Davis',
    productName: 'Organic Baby Spinach (Pre-washed)',
    productImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200',
    refundAmount: 2.79,
    reason: 'Leaf bruising occurred during transit handling',
    proofImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    date: 'Aug 17, 2026',
    status: 'Pending',
  },
  {
    id: 'RET-398',
    orderId: 'ORD-98219',
    customerName: 'Lucas Miller',
    productName: 'Red Sweet Crisp Apples',
    productImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200',
    refundAmount: 4.29,
    reason: 'Missing item from delivery package',
    date: 'Aug 16, 2026',
    status: 'Approved',
  },
];

export default function SellerReturnRequestsPage() {
  const [returns, setReturns] = useState<ReturnRequestItem[]>(INITIAL_RETURNS);
  const [selectedProof, setSelectedProof] = useState<ReturnRequestItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const filtered = returns.filter(
    (r) =>
      r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-6 w-full">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <RotateCcw size={24} className="text-[#0aad0a]" /> Customer Return & Refund Requests
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Inspect buyer return tickets, damage proof images, and authorize store wallet refunds
            </p>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID, customer, or product..."
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Ticket & Order</th>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Product Claimed</th>
                    <th className="pb-3 px-3">Refund Value</th>
                    <th className="pb-3 px-3">Claim Reason</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-white block">{r.id}</span>
                        <span className="text-[11px] text-gray-400 font-mono">{r.orderId}</span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-white">{r.customerName}</td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <Image src={r.productImage} alt={r.productName} fill className="object-cover" />
                          </div>
                          <span className="font-bold text-white max-w-xs truncate">{r.productName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-black text-[#0aad0a]">${r.refundAmount.toFixed(2)}</td>
                      <td className="py-3.5 px-3">
                        <div className="max-w-xs text-gray-300 text-[11px]">{r.reason}</div>
                        {r.proofImage && (
                          <button
                            onClick={() => setSelectedProof(r)}
                            className="text-[10px] text-blue-400 font-bold hover:underline flex items-center gap-1 mt-1"
                          >
                            <Eye size={12} /> View Damage Photo
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          r.status === 'Approved'
                            ? 'bg-emerald-950/40 text-[#0aad0a]'
                            : r.status === 'Rejected'
                            ? 'bg-red-950/40 text-red-400'
                            : 'bg-amber-950/40 text-amber-400'
                        }`}>
                          ● {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {r.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'Approved')}
                              className="px-3 py-1.5 bg-[#0aad0a] hover:bg-[#088f08] text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
                            >
                              <CheckCircle2 size={13} /> Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 font-bold rounded-xl text-xs flex items-center gap-1"
                            >
                              <XCircle size={13} /> Reject
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

      {/* Proof Photo Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-4 relative">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-white">Customer Proof Photo</h3>
            <p className="text-xs text-gray-400">{selectedProof.productName} • {selectedProof.reason}</p>

            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700">
              <Image src={selectedProof.proofImage!} alt="Proof" fill className="object-cover" />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedProof(null)}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
