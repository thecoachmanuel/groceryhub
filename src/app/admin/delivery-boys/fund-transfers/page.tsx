'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Truck, 
  Receipt, 
  Plus, 
  Search, 
  Building2, 
  CheckCircle2, 
  X,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';
import { apiFetch } from '@/lib/api-fetch';

interface FundTransferItem {
  id: string;
  driverName: string;
  bankName: string;
  accountNo: string;
  amount: number;
  transferType: 'Direct NIBSS' | 'Instant Transfer' | 'Counter Payout';
  date: string;
  status: 'Transferred' | 'Processing';
}

const INITIAL_TRANSFERS: FundTransferItem[] = [
  { id: 'FT-8910', driverName: 'Marcus Vance', bankName: 'Access Bank PLC', accountNo: '•••• 1049', amount: 45000.00, transferType: 'Direct NIBSS', date: 'Aug 15, 2026', status: 'Transferred' },
  { id: 'FT-8908', driverName: 'David Chen', bankName: 'GTBank PLC', accountNo: '•••• 4821', amount: 68000.00, transferType: 'Direct NIBSS', date: 'Aug 15, 2026', status: 'Transferred' },
  { id: 'FT-8901', driverName: 'James Wilson', bankName: 'Zenith Bank PLC', accountNo: '•••• 9032', amount: 35000.00, transferType: 'Instant Transfer', date: 'Aug 08, 2026', status: 'Transferred' },
];

export default function AdminDeliveryFundTransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ridersList, setRidersList] = useState<any[]>([]);

  // Form states
  const [selectedRiderId, setSelectedRiderId] = useState<number>(1);
  const [bankName, setBankName] = useState('Access Bank PLC');
  const [accountNo, setAccountNo] = useState('0123456789');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('45000');
  const [transferRef, setTransferRef] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/admin/withdrawals?type=delivery');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTransfers(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch courier transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const res = await apiFetch('/api/admin/delivery-boys');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setRidersList(json.data);
      }
    } catch (err) { console.warn(err); }
  };

  useEffect(() => {
    fetchTransfers();
    fetchRiders();
  }, []);

  const handleApprove = async (requestId: string) => {
    const ref = prompt('Enter Bank NIP Transfer Reference Number:', `NIP-${Math.floor(100000 + Math.random() * 900000)}`);
    if (!ref) return;
    try {
      const res = await apiFetch('/api/admin/withdrawals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, status: 'transferred', transfer_reference: ref }),
      });
      const json = await res.json();
      if (json.success) fetchTransfers();
      else alert(json.message || 'Failed to approve');
    } catch (err) { alert('Error updating transfer'); }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Enter rejection reason for rider:', 'Bank details invalid or pending COD remittance');
    if (!reason) return;
    try {
      const res = await apiFetch('/api/admin/withdrawals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, status: 'rejected', rejection_reason: reason }),
      });
      const json = await res.json();
      if (json.success) fetchTransfers();
      else alert(json.message || 'Failed to reject');
    } catch (err) { alert('Error updating transfer'); }
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount || '0');
    if (amountNum <= 0) return alert('Enter valid payout amount in Naira');

    const riderObj = ridersList.find((r) => (r.id || r._id) === selectedRiderId) || {};
    setSubmitting(true);
    try {
      const res = await apiFetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester_type: 'delivery',
          requester_id: selectedRiderId,
          requester_name: riderObj.name || 'Delivery Rider',
          amount: amountNum,
          bank_name: bankName,
          account_number: accountNo,
          account_name: accountName || riderObj.name || 'Rider',
          transfer_reference: transferRef || `NIP-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchTransfers();
      } else alert(json.message || 'Failed to record payout');
    } catch (err) { alert('Error creating payout'); }
    finally { setSubmitting(false); }
  };

  const filtered = transfers.filter(
    (t) =>
      (t.requester_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.request_id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTransferred = transfers
    .filter((t) => t.status === 'transferred' || t.status === 'approved')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Truck size={24} className="text-blue-400" /> Courier Fund Transfers &amp; Payouts
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Execute direct bank commission disbursements in Naira (₦) and inspect payout settlement records
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Initiate Courier Payout</span>
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link
            href="/admin/delivery-boys"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors"
          >
            All Courier Drivers
          </Link>
          <Link
            href="/admin/delivery-boys/cash-collection"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors"
          >
            COD Cash Remittance
          </Link>
          <Link
            href="/admin/delivery-boys/fund-transfers"
            className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5"
          >
            <Building2 size={13} /> Driver Payout Transfers ({transfers.length})
          </Link>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl space-y-2">
            <span className="text-xs text-gray-400 font-bold">Total Paid to Couriers</span>
            <h3 className="text-3xl font-black text-[#0aad0a] font-mono">{formatNaira(totalTransferred)}</h3>
            <p className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
              <ArrowUpRight size={13} /> Direct NIBSS/Nuban Transfers
            </p>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl space-y-2">
            <span className="text-xs text-gray-400 font-bold">Completed Payouts</span>
            <h3 className="text-3xl font-black text-white">{transfers.length} Transfers</h3>
            <p className="text-[11px] text-gray-400">100% verified settlement rate</p>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl space-y-2">
            <span className="text-xs text-gray-400 font-bold">Avg Driver Weekly Pay</span>
            <h3 className="text-3xl font-black text-blue-400 font-mono">{formatNaira(49330)}</h3>
            <p className="text-[11px] text-gray-400">Based on delivery trips + surge</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Request ID, driver name, or bank..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button
            onClick={fetchTransfers}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
            title="Refresh courier transfers"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Transfers Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-10 text-xs text-gray-400">Loading courier payout transfers...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400">No courier payout records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Request ID</th>
                    <th className="pb-3 px-3">Recipient Courier</th>
                    <th className="pb-3 px-3">Destination Account</th>
                    <th className="pb-3 px-3">Amount (₦)</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((t) => (
                    <tr key={t.request_id || t._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-amber-400">{t.request_id}</td>
                      <td className="py-3.5 px-3 font-bold text-white">
                        {t.requester_name}
                        <span className="block text-[11px] text-gray-400">Courier #{t.requester_id}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-gray-300 font-semibold">{t.bank_name}</div>
                        <span className="text-[11px] text-gray-400">{t.account_name} (•••• {t.account_number?.slice(-4)})</span>
                      </td>
                      <td className="py-3.5 px-3 font-black text-[#0aad0a] text-sm font-mono">{formatNaira(t.amount)}</td>
                      <td className="py-3.5 px-3 text-gray-400">{new Date(t.createdAt).toLocaleDateString('en-NG')}</td>
                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          t.status === 'transferred' || t.status === 'approved'
                            ? 'bg-emerald-950/40 text-[#0aad0a]'
                            : t.status === 'rejected'
                            ? 'bg-red-950/40 text-red-400'
                            : 'bg-amber-950/40 text-amber-400'
                        }`}>
                          ● {t.status === 'transferred' ? 'Transferred' : t.status === 'approved' ? 'Approved' : t.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                        {t.transfer_reference && (
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">{t.transfer_reference}</p>
                        )}
                        {t.rejection_reason && (
                          <p className="text-[10px] text-red-400 mt-0.5">{t.rejection_reason}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {t.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(t.request_id)}
                              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
                            >
                              Approve Payout
                            </button>
                            <button
                              onClick={() => handleReject(t.request_id)}
                              className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500">Completed</span>
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

      {/* Payout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">Initiate Courier Payout</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Execute direct bank transfer payout to delivery rider
              </p>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Courier Driver</label>
                <select
                  value={selectedRiderId}
                  onChange={(e) => setSelectedRiderId(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  {ridersList.map((r) => (
                    <option key={r._id || r.id} value={r.id || r._id || 1}>
                      {r.name || 'Rider'} ({r.mobile || 'Courier'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Payout Amount (₦)</label>
                <input
                  type="number"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Access Bank PLC"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Account Number</label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    maxLength={10}
                    placeholder="0123456789"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Account Name"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Bank NIP Transfer Ref # (Optional)</label>
                <input
                  type="text"
                  value={transferRef}
                  onChange={(e) => setTransferRef(e.target.value)}
                  placeholder="NIP-891040"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {submitting ? 'Processing...' : 'Execute Courier Payout'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
