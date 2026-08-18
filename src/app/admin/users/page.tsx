'use client';

import { useState } from 'react';
import { Users, Search, Wallet, DollarSign, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

const INITIAL_USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', mobile: '+234 802 987 6543', walletBalance: 24500.00, ordersCount: 14, status: 'Active', joined: 'Jan 12, 2026' },
  { id: 2, name: 'Michael Scott', email: 'michael@dundermifflin.com', mobile: '+234 803 876 5432', walletBalance: 12000.00, ordersCount: 8, status: 'Active', joined: 'Feb 04, 2026' },
  { id: 3, name: 'Eleanor Shellstrop', email: 'eleanor@goodplace.org', mobile: '+234 805 765 4321', walletBalance: 0.00, ordersCount: 5, status: 'Active', joined: 'Mar 18, 2026' },
  { id: 4, name: 'Chinedu Okafor', email: 'chinedu@example.ng', mobile: '+234 809 654 3210', walletBalance: 85000.00, ordersCount: 22, status: 'Active', joined: 'Jan 02, 2026' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForWallet, setSelectedUserForWallet] = useState<any | null>(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletType, setWalletType] = useState<'credit' | 'debit'>('credit');
  const [walletRemark, setWalletRemark] = useState('');

  const handleWalletAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForWallet) return;
    const amount = parseFloat(walletAmount || '0');
    if (amount <= 0) return alert('Please enter a valid positive amount in Naira');

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedUserForWallet.id) {
          const newBal = walletType === 'credit' ? u.walletBalance + amount : Math.max(0, u.walletBalance - amount);
          return { ...u, walletBalance: newBal };
        }
        return u;
      })
    );
    setSelectedUserForWallet(null);
    setWalletAmount('');
    setWalletRemark('');
  };

  const handleToggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u))
    );
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.mobile.includes(searchQuery)
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Users size={24} className="text-[#0aad0a]" /> Customer Directory &amp; Wallet Ledgers
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage customer account access, grant wallet credits in Naira (₦), and inspect transaction history</p>
          </div>
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
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
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
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        u.status === 'Active' ? 'bg-emerald-950/40 text-[#0aad0a]' : 'bg-red-950/40 text-red-400'
                      }`}>
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
                          <span>Adjust Wallet</span>
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
                Customer: <strong className="text-white">{selectedUserForWallet.name}</strong> (Current: {formatNaira(selectedUserForWallet.walletBalance)})
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
                  placeholder="e.g. Compensation for delayed order #ORD-98241"
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
