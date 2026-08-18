'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Search, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface ReturnRequest {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  reason: string;
  status: string;
  date: string;
}

const formatReturnFromApi = (o: any): ReturnRequest => ({
  id: o._id,
  orderId: o.order_id || `ORD-${String(o._id).slice(-5).toUpperCase()}`,
  customer: o.user_id || o.customer_name || 'Customer',
  amount: o.total_payable || 0,
  reason: o.return_reason || o.cancel_reason || 'Requested by customer',
  status: o.active_status || o.return_status || 'return_requested',
  date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-NG') : '—',
});

export default function AdminReturnRequestsPage() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/return-requests');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setRequests(json.data.map(formatReturnFromApi));
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setSaving(true);
    try {
      await fetch('/api/admin/return-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, active_status: status, return_status: status }),
      });
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      if (selectedRequest?.id === id) setSelectedRequest((r) => r ? { ...r, status } : null);
    } catch (err) { console.warn(err); }
    setSaving(false);
  };

  const statusBadge = (status: string) => {
    if (status === 'refunded') return 'bg-emerald-950/40 text-[#0aad0a]';
    if (status === 'rejected') return 'bg-red-950/40 text-red-400';
    return 'bg-amber-950/40 text-amber-400';
  };

  const filtered = requests.filter((r) =>
    r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || r.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2"><RotateCcw size={24} className="text-[#0aad0a]" /> Return Requests</h1>
            <p className="text-xs text-gray-400 mt-0.5">Customer return and refund requests from live orders database</p>
          </div>
          <button onClick={fetchRequests} disabled={loading} className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl">
          <div className="relative max-w-md">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search order ID or customer..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading return requests...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <RotateCcw size={36} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold">No return requests</h4>
              <p className="text-xs text-gray-400">
                {requests.length === 0 ? 'No return or refund requests in the database. Requests will appear here when customers request returns from their orders.' : 'No requests match your search.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Order</th>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Amount</th>
                    <th className="pb-3 px-3">Reason</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white font-mono">{r.orderId}</td>
                      <td className="py-3 px-3">{r.customer}</td>
                      <td className="py-3 px-3 font-bold text-white font-mono">{formatNaira(r.amount)}</td>
                      <td className="py-3 px-3 text-gray-400 max-w-xs truncate">{r.reason}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${statusBadge(r.status)}`}>
                          ● {r.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleUpdateStatus(r.id, 'refunded')} disabled={saving || r.status === 'refunded'} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-950/40 text-[#0aad0a] hover:bg-emerald-900/60 disabled:opacity-40 transition-all">
                            ✓ Refund
                          </button>
                          <button onClick={() => handleUpdateStatus(r.id, 'rejected')} disabled={saving || r.status === 'rejected'} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 disabled:opacity-40 transition-all">
                            ✗ Reject
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
