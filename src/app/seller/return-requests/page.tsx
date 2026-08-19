'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle2, XCircle, Search, Eye, X, AlertCircle, RefreshCw } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { apiFetch } from '@/lib/api-fetch';
import { useSellerAuth } from '@/context/AuthContext';

interface ReturnRequestItem {
  id: string;
  _id: string;
  orderId: string;
  customerName: string;
  productName: string;
  refundAmount: number;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function SellerReturnRequestsPage() {
  const { seller } = useSellerAuth();
  const [returns, setReturns] = useState<ReturnRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/admin/return-requests');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const sellerId = (seller as any)?.seller_id || (seller as any)?.id;
        const filteredData = sellerId
          ? json.data.filter((o: any) => !o.seller_id || o.seller_id === sellerId)
          : json.data;

        const formatted: ReturnRequestItem[] = filteredData.map((o: any) => {
          const rawStatus = (o.return_status || o.active_status || 'Pending').toLowerCase();
          const normStatus = rawStatus.includes('approved') ? 'Approved' : rawStatus.includes('reject') ? 'Rejected' : 'Pending';
          return {
            id: String(o._id),
            _id: String(o._id),
            orderId: o.order_id || `ORD-${String(o._id).slice(-5).toUpperCase()}`,
            customerName: o.customer_name || (o.user_id ? `Customer #${o.user_id}` : 'Customer'),
            productName: Array.isArray(o.items) && o.items[0] ? o.items[0].product_name || o.items[0].name : 'Grocery Order Package',
            refundAmount: o.total_amount || o.total_payable || 0,
            reason: o.return_reason || o.cancel_reason || 'Product quality or transit claim',
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
            status: normStatus,
          };
        });
        setReturns(formatted);
      }
    } catch (err) {
      console.warn('Error loading return requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [seller]);

  const handleUpdateStatus = async (id: string, newStatus: 'Approved' | 'Rejected') => {
    try {
      await apiFetch('/api/admin/return-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, return_status: newStatus }),
      });
      setActionSuccess(`Return claim marked as ${newStatus}`);
      setTimeout(() => setActionSuccess(''), 3500);
      setReturns((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert('Error updating return request status');
    }
  };

  const filtered = returns.filter((r) =>
    r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-4 sm:p-10 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                <RotateCcw size={24} className="text-[#0aad0a]" /> Customer Return &amp; Refund Claims
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Manage item replacement requests, damage claims, and customer digital wallet refunds</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchReturns}
                className="bg-[#1e2632] hover:bg-gray-800 p-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                title="Refresh Returns"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order ID or item..."
                  className="bg-[#1e2632] border border-gray-800 text-white text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#0aad0a] w-48 sm:w-64"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
              </div>
            </div>
          </div>

          {actionSuccess && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> {actionSuccess}
            </div>
          )}

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-xl">
            {loading ? (
              <div className="py-16 text-center text-gray-400 text-xs font-bold flex flex-col items-center gap-2">
                <RefreshCw size={24} className="animate-spin text-[#0aad0a]" />
                Loading return claims...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <RotateCcw size={36} className="mx-auto text-gray-500" />
                <h3 className="text-base font-bold text-white">No return requests found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Your store has no pending product damage or return claims. High product quality keeps returns low!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="pb-3">Claim ID</th>
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Product / Package</th>
                      <th className="pb-3">Refund Amount</th>
                      <th className="pb-3">Reason</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-medium">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 font-mono font-bold text-[#0aad0a]">{item.id.slice(-6).toUpperCase()}</td>
                        <td className="py-4 font-mono text-gray-300 font-bold">{item.orderId}</td>
                        <td className="py-4 text-white font-bold">{item.customerName}</td>
                        <td className="py-4 text-gray-300 font-semibold max-w-xs truncate">{item.productName}</td>
                        <td className="py-4 font-mono font-bold text-[#0aad0a]">{formatNaira(item.refundAmount)}</td>
                        <td className="py-4 text-gray-400 max-w-xs truncate">{item.reason}</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.status === 'Approved'
                                ? 'bg-emerald-950 text-[#0aad0a]'
                                : item.status === 'Rejected'
                                ? 'bg-red-950 text-red-400'
                                : 'bg-amber-950 text-amber-400'
                            }`}
                          >
                            ● {item.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {item.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'Approved')}
                                className="bg-[#0aad0a] hover:bg-[#088f08] text-white px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all"
                              >
                                <CheckCircle2 size={13} /> Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                                className="bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-400 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all"
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-500 italic">Resolved ({item.status})</span>
                          )}
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
    </div>
  );
}
