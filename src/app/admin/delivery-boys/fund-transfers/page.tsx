'use client';

import { useState } from 'react';
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
  ArrowUpRight
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

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
  const [transfers, setTransfers] = useState<FundTransferItem[]>(INITIAL_TRANSFERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [driverName, setDriverName] = useState('Marcus Vance');
  const [bankName, setBankName] = useState('Access Bank PLC');
  const [accountNo, setAccountNo] = useState('•••• 1049');
  const [amount, setAmount] = useState('64500');
  const [transferType, setTransferType] = useState<'Direct NIBSS' | 'Instant Transfer' | 'Counter Payout'>('Direct NIBSS');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount || '0');
    if (amountNum <= 0) return alert('Enter valid payout amount in Naira');

    const newTransfer: FundTransferItem = {
      id: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
      driverName,
      bankName,
      accountNo,
      amount: amountNum,
      transferType,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Transferred',
    };
    setTransfers([newTransfer, ...transfers]);
    setIsModalOpen(false);
  };

  const filtered = transfers.filter(
    (t) =>
      t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTransferred = transfers.reduce((acc, curr) => acc + curr.amount, 0);

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
              placeholder="Search by transfer ID or driver name..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Transfers Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Transfer Ref</th>
                  <th className="pb-3 px-3">Recipient Courier</th>
                  <th className="pb-3 px-3">Destination Account</th>
                  <th className="pb-3 px-3">Amount Paid (₦)</th>
                  <th className="pb-3 px-3">Transfer Mode</th>
                  <th className="pb-3 px-3">Execution Date</th>
                  <th className="pb-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-white">{t.id}</td>
                    <td className="py-3.5 px-3 font-bold text-white">{t.driverName}</td>
                    <td className="py-3.5 px-3">
                      <div className="text-gray-300 font-semibold">{t.bankName}</div>
                      <span className="text-[11px] text-gray-400">{t.accountNo}</span>
                    </td>
                    <td className="py-3.5 px-3 font-black text-[#0aad0a] text-sm font-mono">{formatNaira(t.amount)}</td>
                    <td className="py-3.5 px-3 text-gray-400">{t.transferType}</td>
                    <td className="py-3.5 px-3 text-gray-400">{t.date}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/40 text-[#0aad0a]">
                        ● {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Payout Modal */}
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
              <h3 className="text-xl font-black">Initiate Courier Payout</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Send commission earnings directly to the courier&apos;s verified bank account in Nigeria
              </p>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Courier Driver</label>
                <select
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Marcus Vance">Marcus Vance (Balance: {formatNaira(64500)})</option>
                  <option value="David Chen">David Chen (Balance: {formatNaira(120000)})</option>
                  <option value="James Wilson">James Wilson (Balance: {formatNaira(45000)})</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Account Mask</label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Payout Amount (₦)</label>
                  <input
                    type="number"
                    step="500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="64500"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Payout Rail</label>
                  <select
                    value={transferType}
                    onChange={(e) => setTransferType(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Direct NIBSS">Direct NIBSS</option>
                    <option value="Instant Transfer">Instant Transfer</option>
                    <option value="Counter Payout">Counter Payout</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                >
                  Send Payout
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
