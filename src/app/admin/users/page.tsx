'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Wallet, RefreshCw, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  walletBalance: number;
  ordersCount: number;
  status: string;
  joined: string;
}

const formatUserFromApi = (u: any): AdminUser => ({
  id: u._id,
  name: u.name || u.f_name || `${u.f_name || ''} ${u.l_name || ''}`.trim() || 'Unknown',
  email: u.email || '—',
  mobile: u.mobile || u.phone || '—',
  walletBalance: u.wallet_balance || 0,
  ordersCount: u.orders_count || 0,
  status: u.is_active !== false ? 'Active' : 'Blocked',
  joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-NG') : '—',
});

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForWallet, setSelectedUserForWallet] = useState<AdminUser | null>(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletType, setWalletType] = useState<'credit' | 'debit'>('credit');
  const [walletRemark, setWalletRemark] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUsers(json.data.map(formatUserFromApi));
      }
    } catch (err) {
      console.warn('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleWalletAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForWallet) return;
    const amount = parseFloat(walletAmount || '0');
    if (amount <= 0) return alert('Please enter a valid positive amount in Naira');

    const newBal =
      walletType === 'credit'
        ? selectedUserForWallet.walletBalance + amount
        : Math.max(0, selectedUserForWallet.walletBalance - amount);

    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserForWallet.id, walletBalance: newBal }),
      });
    } catch (err) {
      console.warn('Wallet update error:', err);
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUserForWallet.id ? { ...u, walletBalance: newBal } : u
      )
    );
    setSelectedUserForWallet(null);
    setWalletAmount('');
    setWalletRemark('');
  };

  const handleToggleStatus = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const newStatus = user.status === 'Active' ? 'Blocked' : 'Active';

    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, status: newStatus }),
      });
    } catch (err) {
      console.warn('Status toggle error:', err);
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobile.includes(searchQuery)
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Users size={24} className="text-[#0aad0a]" /> Customer Directory &amp; Wallet Ledgers
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage customer account access, grant wallet credits in Naira (₦), and inspect transaction history
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or mobile..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400 ml-4 font-bold">{users.length} Registered Customers</span>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading customers from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Users size={36} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold">No customers found</h4>
              <p className="text-xs text-gray-400">
                {users.length === 0
                  ? 'No customer accounts in database yet. Customers who register will appear here.'
                  : 'No customers match your search.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Contact</th>
                    <th className="pb-3 px-3">Wallet Balance</th>
                    <th className="pb-3 px-3">Orders Placed</th>
                    <th className="pb-3 px-3">Account Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div>
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-[11px] text-gray-500">Joined {u.joined}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div>
                          <span className="text-white block">{u.email}</span>
                          <span className="text-gray-400 text-[11px] font-mono">{u.mobile}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#0aad0a] font-mono">
                        {formatNaira(u.walletBalance)}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-white">{u.ordersCount} orders</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            u.status === 'Active'
                              ? 'bg-emerald-950/40 text-[#0aad0a]'
                              : 'bg-red-950/40 text-red-400'
                          }`}
                        >
                          ● {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUserForWallet(u)}
                            className="flex items-center gap-1 bg-[#0aad0a]/10 hover:bg-[#0aad0a] text-[#0aad0a] hover:text-white font-bold px-3 py-1.5 rounded-xl transition-all"
                          >
                            <Wallet size={13} />
                            <span>Wallet</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                              u.status === 'Active'
                                ? 'bg-red-950/40 text-red-400 hover:bg-red-900/60'
                                : 'bg-emerald-950/40 text-[#0aad0a] hover:bg-emerald-900/60'
                            }`}
                          >
                            {u.status === 'Active' ? 'Block' : 'Unblock'}
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

      {/* Adjust Wallet Modal */}
      {selectedUserForWallet && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
            <button
              onClick={() => setSelectedUserForWallet(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black">Adjust Customer Wallet</h3>
              <p className="text-xs text-gray-400">
                Customer: <strong className="text-white">{selectedUserForWallet.name}</strong> (Current:{' '}
                {formatNaira(selectedUserForWallet.walletBalance)})
              </p>
            </div>

            <form onSubmit={handleWalletAdjustment} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 bg-gray-900 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setWalletType('credit')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    walletType === 'credit' ? 'bg-[#0aad0a] text-white shadow-sm' : 'text-gray-400'
                  }`}
                >
                  + Add Credit (Top-up)
                </button>
                <button
                  type="button"
                  onClick={() => setWalletType('debit')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    walletType === 'debit' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-400'
                  }`}
                >
                  - Debit Funds
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Amount (₦)</label>
                <input
                  type="number"
                  step="100"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Adjustment Note / Reference</label>
                <input
                  type="text"
                  value={walletRemark}
                  onChange={(e) => setWalletRemark(e.target.value)}
                  placeholder="e.g. Compensation for delayed order"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  Apply {walletType === 'credit' ? 'Credit' : 'Debit'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserForWallet(null)}
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
