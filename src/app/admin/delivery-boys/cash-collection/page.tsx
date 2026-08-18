'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Receipt, 
  Truck, 
  DollarSign, 
  Plus, 
  Search, 
  CheckCircle2, 
  X, 
  ArrowDownLeft, 
  AlertCircle
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface CashCollectionRecord {
  id: number;
  driverName: string;
  driverPhone: string;
  collectedAmount: number;
  remittedAmount: number;
  pendingBalance: number;
  lastRemittanceDate: string;
  status: 'Cleared' | 'Pending Deposit';
}

const INITIAL_COLLECTIONS: CashCollectionRecord[] = [
  { id: 1, driverName: 'Marcus Vance', driverPhone: '+1 (555) 789-0123', collectedAmount: 103.50, remittedAmount: 75.00, pendingBalance: 28.50, lastRemittanceDate: 'Aug 17, 2026', status: 'Pending Deposit' },
  { id: 2, driverName: 'David Chen', driverPhone: '+1 (555) 345-6789', collectedAmount: 180.00, remittedAmount: 180.00, pendingBalance: 0.00, lastRemittanceDate: 'Aug 16, 2026', status: 'Cleared' },
  { id: 3, driverName: 'James Wilson', driverPhone: '+1 (555) 456-7890', collectedAmount: 75.00, remittedAmount: 0.00, pendingBalance: 75.00, lastRemittanceDate: 'Aug 14, 2026', status: 'Pending Deposit' },
];

export default function AdminCashCollectionPage() {
  const [records, setRecords] = useState<CashCollectionRecord[]>(INITIAL_COLLECTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('Marcus Vance');
  const [depositAmount, setDepositAmount] = useState('28.50');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRecordDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount || '0');
    if (amountNum <= 0) return alert('Please enter a valid deposit amount');

    setRecords((prev) =>
      prev.map((r) =>
        r.driverName === selectedDriver
          ? {
              ...r,
              remittedAmount: r.remittedAmount + amountNum,
              pendingBalance: Math.max(0, r.pendingBalance - amountNum),
              lastRemittanceDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: Math.max(0, r.pendingBalance - amountNum) === 0 ? 'Cleared' : 'Pending Deposit',
            }
          : r
      )
    );
    setIsModalOpen(false);
    setDepositAmount('');
    setNotes('');
  };

  const filtered = records.filter(
    (r) =>
      r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.driverPhone.includes(searchQuery)
  );

  const totalPendingCOD = records.reduce((acc, curr) => acc + curr.pendingBalance, 0);

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Receipt size={24} className="text-amber-400" /> Driver COD Cash Collection & Remittances
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Track Cash-on-Delivery collected by delivery boys and register counter cash handovers
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Record Cash Handover</span>
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link
            href="/admin/delivery-boys"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Truck size={14} /> Fleet Directory
          </Link>
          <Link
            href="/admin/delivery-boys/cash-collection"
            className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-2"
          >
            <Receipt size={14} /> COD Cash Collections
          </Link>
          <Link
            href="/admin/delivery-boys/fund-transfers"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <DollarSign size={14} className="text-blue-400" /> Fund Transfers & Payouts
          </Link>
        </div>

        {/* Stats Banner */}
        <div className="bg-[#1e2632] border border-gray-800 p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-gray-400 font-bold">Total Outstanding COD Cash</span>
            <h3 className="text-2xl font-black text-amber-400">${totalPendingCOD.toFixed(2)}</h3>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold">Total Remitted to Store</span>
            <h3 className="text-2xl font-black text-[#0aad0a]">$255.00</h3>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold">Drivers with Pending Cash</span>
            <h3 className="text-2xl font-black text-white">2 Active Couriers</h3>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver by name or phone..."
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
                  <th className="pb-3 px-3">Courier Driver</th>
                  <th className="pb-3 px-3">Total COD Collected</th>
                  <th className="pb-3 px-3">Remitted to Store</th>
                  <th className="pb-3 px-3">Pending Cash in Hand</th>
                  <th className="pb-3 px-3">Last Settlement</th>
                  <th className="pb-3 px-3">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{r.driverName}</div>
                      <span className="text-[11px] text-gray-400">{r.driverPhone}</span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">${r.collectedAmount.toFixed(2)}</td>
                    <td className="py-3.5 px-3 font-bold text-[#0aad0a]">${r.remittedAmount.toFixed(2)}</td>
                    <td className="py-3.5 px-3 font-black text-amber-400">
                      ${r.pendingBalance.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-gray-400">{r.lastRemittanceDate}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        r.status === 'Cleared'
                          ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                          : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                      }`}>
                        ● {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Record Deposit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">Record COD Cash Handover</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Acknowledge physical cash deposited by courier at store collection counter
              </p>
            </div>

            <form onSubmit={handleRecordDeposit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Select Courier</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  {records.map((r) => (
                    <option key={r.id} value={r.driverName}>
                      {r.driverName} (Pending: ${r.pendingBalance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Amount Received ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="28.50"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Receipt / Handover Note</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Counter deposit verified by Admin"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black py-3.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  Confirm Cash Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
