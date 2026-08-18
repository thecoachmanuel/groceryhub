'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RotateCcw, CheckCircle2, XCircle, Search, Eye, X, AlertCircle } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';

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
    customerName: 'Chinedu Okafor',
    productName: 'Organic Baby Spinach (Pre-washed 250g)',
    productImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200',
    refundAmount: 2800,
    reason: 'Leaf bruising occurred during transit handling',
    proofImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    date: 'Aug 17, 2026',
    status: 'Pending',
  },
  {
    id: 'RET-398',
    orderId: 'ORD-98219',
    customerName: 'Amina Bello',
    productName: 'Red Sweet Crisp Apples (1kg Pack)',
    productImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200',
    refundAmount: 4500,
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

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <RotateCcw size={24} className="text-[#0aad0a]" /> Customer Return &amp; Refund Claims
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Review damaged goods claims, inspect buyer photo evidence, and approve automatic wallet refunds in Naira (₦)
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search claims by Order ID, Buyer..."
                className="bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] w-72"
              />
              <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          {/* Quick Stat Pill */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold block">Pending Actions</span>
                <span className="text-2xl font-black text-amber-400">
                  {returns.filter((r) => r.status === 'Pending').length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold block">Approved Refunds</span>
                <span className="text-2xl font-black text-[#0aad0a]">
                  {returns.filter((r) => r.status === 'Approved').length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold block">Total Refunded This Month</span>
                <span className="text-2xl font-black text-white font-mono">
                  {formatNaira(returns.reduce((acc, curr) => curr.status === 'Approved' ? acc + curr.refundAmount : acc, 0))}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-800 text-gray-300 flex items-center justify-center">
                <RotateCcw size={20} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="pb-3 px-3 font-bold">Return ID</th>
                    <th className="pb-3 px-3 font-bold">Customer</th>
                    <th className="pb-3 px-3 font-bold">Product Details</th>
                    <th className="pb-3 px-3 font-bold">Refund (₦)</th>
                    <th className="pb-3 px-3 font-bold">Reason &amp; Proof</th>
                    <th className="pb-3 px-3 font-bold">Status</th>
                    <th className="pb-3 px-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
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
                      <td className="py-3.5 px-3 font-black text-[#0aad0a] font-mono">{formatNaira(r.refundAmount)}</td>
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
                            : 'bg-amber-950/40 text-amber-300'
                        }`}>
                          ● {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {r.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'Approved')}
                              className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-[#0aad0a] hover:text-white transition-colors"
                              title="Approve Refund"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                              className="p-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-400 hover:text-white transition-colors"
                              title="Reject Claim"
                            >
                              <XCircle size={16} />
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

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 border border-gray-800 space-y-4 relative">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-base font-black text-white">Customer Photo Proof</h3>
              <p className="text-xs text-gray-400">{selectedProof.id} &bull; {selectedProof.productName}</p>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
              {selectedProof.proofImage ? (
                <Image src={selectedProof.proofImage} alt="Proof" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-500">
                  No photographic evidence uploaded
                </div>
              )}
            </div>

            <p className="text-xs text-gray-300 bg-gray-900 p-3 rounded-xl border border-gray-800">
              <strong>Buyer Note:</strong> &ldquo;{selectedProof.reason}&rdquo;
            </p>

            <button
              onClick={() => setSelectedProof(null)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
