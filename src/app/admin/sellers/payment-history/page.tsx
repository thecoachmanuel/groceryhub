'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Store, 
  Download, 
  Receipt, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  CreditCard,
  Building,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';
import { apiFetch } from '@/lib/api-fetch';

interface PaymentRecord {
  id: number;
  seller_id: number;
  seller_name: string;
  store_name: string;
  txn_id: string;
  amount: number;
  commission_deducted: number;
  net_payout: number;
  bank_account: string;
  payout_date: string;
  payment_method: 'ACH Direct Deposit' | 'Stripe Connect' | 'Manual Wire';
  status: 'Completed' | 'Processing' | 'Failed';
}

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 1,
    seller_id: 1,
    seller_name: 'Fresh Harvest Organics',
    store_name: 'Fresh Harvest Store #1',
    txn_id: 'TXN-PAY-89210',
    amount: 1450.00,
    commission_deducted: 72.50, // 5%
    net_payout: 1377.50,
    bank_account: 'Chase Bank •••• 4891',
    payout_date: '2026-08-16 14:30',
    payment_method: 'ACH Direct Deposit',
    status: 'Completed'
  },
  {
    id: 2,
    seller_id: 2,
    seller_name: 'Green Valley Grocers',
    store_name: 'Green Valley Downtown',
    txn_id: 'TXN-PAY-89209',
    amount: 820.00,
    commission_deducted: 41.00,
    net_payout: 779.00,
    bank_account: 'Bank of America •••• 9012',
    payout_date: '2026-08-15 11:15',
    payment_method: 'Stripe Connect',
    status: 'Completed'
  },
  {
    id: 3,
    seller_id: 3,
    seller_name: 'Brooklyn Artisanal Dairy',
    store_name: 'Artisanal Cheese & Milk',
    txn_id: 'TXN-PAY-89208',
    amount: 640.00,
    commission_deducted: 32.00,
    net_payout: 608.00,
    bank_account: 'Wells Fargo •••• 3341',
    payout_date: '2026-08-14 16:45',
    payment_method: 'ACH Direct Deposit',
    status: 'Completed'
  }
];

export default function AdminSellerPaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sellersList, setSellersList] = useState<any[]>([]);

  // Modal Form
  const [selectedSellerId, setSelectedSellerId] = useState<number>(1);
  const [amount, setAmount] = useState('50000');
  const [bankName, setBankName] = useState('Zenith Bank PLC');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [accountName, setAccountName] = useState('');
  const [transferRef, setTransferRef] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/admin/withdrawals?type=seller');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPayments(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch seller settlements:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const res = await apiFetch('/api/admin/sellers');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSellersList(json.data);
      }
    } catch (err) { console.warn(err); }
  };

  useEffect(() => {
    fetchWithdrawals();
    fetchSellers();
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
      if (json.success) fetchWithdrawals();
      else alert(json.message || 'Failed to approve');
    } catch (err) { alert('Error updating withdrawal'); }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Enter rejection reason for vendor:', 'Bank details invalid or insufficient balance');
    if (!reason) return;
    try {
      const res = await apiFetch('/api/admin/withdrawals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, status: 'rejected', rejection_reason: reason }),
      });
      const json = await res.json();
      if (json.success) fetchWithdrawals();
      else alert(json.message || 'Failed to reject');
    } catch (err) { alert('Error updating withdrawal'); }
  };

  const handleRecordPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount || '0');
    if (val <= 0) return alert('Enter valid payout amount');

    const sellerObj = sellersList.find((s) => (s.id || s.seller_id) === selectedSellerId) || {};
    setSubmitting(true);
    try {
      const res = await apiFetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester_type: 'seller',
          requester_id: selectedSellerId,
          requester_name: sellerObj.store_name || sellerObj.name || 'Vendor',
          amount: val,
          bank_name: bankName,
          account_number: accountNumber,
          account_name: accountName || sellerObj.name || 'Vendor',
          transfer_reference: transferRef || `NIP-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchWithdrawals();
      } else alert(json.message || 'Failed to record payout');
    } catch (err) { alert('Error recording payout'); }
    finally { setSubmitting(false); }
  };

  const totalDisbursed = payments
    .filter((p) => p.status === 'transferred' || p.status === 'approved')
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const filtered = payments.filter((p) =>
    (p.requester_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.request_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.bank_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin/sellers" className="text-xs text-gray-400 hover:text-[#0aad0a] flex items-center gap-1">
                <ArrowLeft size={12} /> Back to Seller Directory
              </Link>
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <DollarSign size={24} className="text-[#0aad0a]" /> Vendor Payment History & Settlements
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Audit log of bank transfers, platform commission deductions, and merchant payout disbursements
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Record Settlement Payout</span>
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/sellers" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Vendors & Stores
          </Link>
          <Link href="/admin/sellers/payment-history" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <Receipt size={13} /> Payment & Payout History ({payments.length})
          </Link>
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
            <span className="text-xs font-bold text-gray-400">Total Disbursed (Transferred)</span>
            <div className="text-2xl font-black text-[#0aad0a] font-mono">
              {formatNaira(totalDisbursed)}
            </div>
            <span className="text-[11px] text-gray-400 font-semibold">Processed payouts to vendor bank accounts</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
            <span className="text-xs font-bold text-gray-400">Pending Payout Requests</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {formatNaira(pendingAmount)}
            </div>
            <span className="text-[11px] text-amber-400 font-semibold">
              {payments.filter((p) => p.status === 'pending').length} request(s) awaiting approval
            </span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
            <span className="text-xs font-bold text-gray-400">Total Settlement Requests</span>
            <div className="text-2xl font-black text-blue-400 font-mono">
              {payments.length} Records
            </div>
            <span className="text-[11px] text-gray-400 font-semibold">Live MongoDB audit log</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vendor name, Request ID, or bank..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button
            onClick={fetchWithdrawals}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
            title="Refresh settlements"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-10 text-xs text-gray-400">Loading vendor settlements...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400">No vendor settlement records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Request ID</th>
                    <th className="pb-3 px-3">Vendor / Store</th>
                    <th className="pb-3 px-3">Payout Amount (₦)</th>
                    <th className="pb-3 px-3">Bank Account</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((p) => (
                    <tr key={p.request_id || p._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-amber-400">
                        {p.request_id}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white text-sm">{p.requester_name}</div>
                        <span className="text-[11px] text-gray-400">Vendor #{p.requester_id}</span>
                      </td>
                      <td className="py-3.5 px-3 text-[#0aad0a] font-mono font-black text-sm">
                        {formatNaira(p.amount)}
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-white">{p.bank_name}</p>
                        <p className="text-gray-400 text-[11px]">{p.account_name}</p>
                        <p className="text-gray-500 font-mono text-[10px]">•••• {p.account_number?.slice(-4)}</p>
                      </td>
                      <td className="py-3.5 px-3 text-gray-400 text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString('en-NG')}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                          p.status === 'transferred' || p.status === 'approved'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : p.status === 'rejected'
                            ? 'bg-red-950/40 text-red-400 border border-red-800/30'
                            : 'bg-amber-950/40 text-amber-400 border border-amber-800/30'
                        }`}>
                          {p.status === 'transferred' ? '✓ Transferred' : p.status === 'approved' ? '✓ Approved' : p.status === 'rejected' ? '✕ Rejected' : '● Pending'}
                        </span>
                        {p.transfer_reference && (
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">{p.transfer_reference}</p>
                        )}
                        {p.rejection_reason && (
                          <p className="text-[10px] text-red-400 mt-0.5">{p.rejection_reason}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {p.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(p.request_id)}
                              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
                            >
                              Approve Payout
                            </button>
                            <button
                              onClick={() => handleReject(p.request_id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">Record Vendor Payout</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Execute direct bank transfer settlement for store online earnings
              </p>
            </div>

            <form onSubmit={handleRecordPayout} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Select Vendor Store</label>
                <select
                  value={selectedSellerId}
                  onChange={(e) => setSelectedSellerId(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  {sellersList.map((s) => (
                    <option key={s._id || s.id} value={s.id || s.seller_id || 1}>
                      {s.store_name || s.name || 'Vendor'} (ID #{s.id || s.seller_id})
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
                  placeholder="Zenith Bank PLC"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    maxLength={10}
                    placeholder="0123456789"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Account Holder Name</label>
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
                  placeholder="NIP-891240"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {submitting ? 'Processing...' : 'Record & Execute Payout'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
