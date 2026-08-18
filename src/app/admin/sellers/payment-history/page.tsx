'use client';

import { useState } from 'react';
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
  Filter
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

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
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form
  const [sellerName, setSellerName] = useState('Fresh Harvest Organics');
  const [amount, setAmount] = useState(500.00);
  const [commissionRate, setCommissionRate] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['payment_method']>('ACH Direct Deposit');
  const [bankAccount, setBankAccount] = useState('Chase Bank •••• 4891');

  const openModal = () => {
    setSellerName('Fresh Harvest Organics');
    setAmount(500.00);
    setCommissionRate(5);
    setPaymentMethod('ACH Direct Deposit');
    setBankAccount('Chase Bank •••• 4891');
    setIsModalOpen(true);
  };

  const handleRecordPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const comm = (amount * commissionRate) / 100;
    const net = amount - comm;

    const newPay: PaymentRecord = {
      id: Date.now(),
      seller_id: 1,
      seller_name: sellerName,
      store_name: sellerName + ' Store',
      txn_id: `TXN-PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      amount,
      commission_deducted: comm,
      net_payout: net,
      bank_account: bankAccount,
      payout_date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      payment_method: paymentMethod,
      status: 'Completed'
    };

    setPayments([newPay, ...payments]);
    setIsModalOpen(false);
  };

  const totalDisbursed = payments.reduce((acc, p) => acc + p.net_payout, 0);
  const totalCommissionEarned = payments.reduce((acc, p) => acc + p.commission_deducted, 0);

  const filtered = payments.filter(p => 
    p.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.txn_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bank_account.toLowerCase().includes(searchQuery.toLowerCase())
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
              onClick={openModal}
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
            <span className="text-xs font-bold text-gray-400">Total Net Disbursed</span>
            <div className="text-2xl font-black text-white font-mono">
              {formatNaira(totalDisbursed)}
            </div>
            <span className="text-[11px] text-[#0aad0a] font-semibold">Processed to partner Nigerian banks</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
            <span className="text-xs font-bold text-gray-400">Platform Commission Retained</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {formatNaira(totalCommissionEarned)}
            </div>
            <span className="text-[11px] text-gray-400 font-semibold">Net platform profit share (5%)</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-1">
            <span className="text-xs font-bold text-gray-400">Total Settlements</span>
            <div className="text-2xl font-black text-blue-400 font-mono">
              {payments.length} Runs
            </div>
            <span className="text-[11px] text-gray-400 font-semibold">Zero failed disbursements</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vendor name, TXN ID, or bank..."
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
                  <th className="pb-3 px-3">Transaction ID</th>
                  <th className="pb-3 px-3">Vendor / Store</th>
                  <th className="pb-3 px-3">Gross Order Total (₦)</th>
                  <th className="pb-3 px-3">Commission Cut (5%)</th>
                  <th className="pb-3 px-3">Net Payout Transferred (₦)</th>
                  <th className="pb-3 px-3">Disbursement Method</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {p.txn_id}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{p.seller_name}</div>
                      <span className="text-[11px] text-gray-400">{p.bank_account}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-300 font-mono font-bold">
                      {formatNaira(p.amount)}
                    </td>
                    <td className="py-3.5 px-3 text-amber-400 font-mono font-bold">
                      -{formatNaira(p.commission_deducted)}
                    </td>
                    <td className="py-3.5 px-3 text-[#0aad0a] font-mono font-black text-sm">
                      {formatNaira(p.net_payout)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-gray-900 border border-gray-700 px-2.5 py-1 rounded-lg text-gray-300 font-medium text-[11px]">
                        {p.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 text-[11px]">
                      {p.payout_date}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30 font-bold px-2.5 py-1 rounded-full text-[10px]">
                        ✓ {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">Record Vendor Payout</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Log bank transfer disbursement and deduct platform commission fees
              </p>
            </div>

            <form onSubmit={handleRecordPayout} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Select Vendor Store</label>
                <select
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Fresh Harvest Organics">Fresh Harvest Organics</option>
                  <option value="Green Valley Grocers">Green Valley Grocers</option>
                  <option value="Brooklyn Artisanal Dairy">Brooklyn Artisanal Dairy</option>
                  <option value="Daily Baker Market">Daily Baker Market</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Gross Sales Value (₦)</label>
                  <input
                    type="number"
                    step="1000"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Platform Commission Cut ({commissionRate}%):</span>
                  <span className="font-mono text-amber-400">{formatNaira((amount * commissionRate) / 100)}</span>
                </div>
                <div className="flex justify-between font-black text-white pt-1 border-t border-gray-800">
                  <span>Net Payout to Bank:</span>
                  <span className="font-mono text-[#0aad0a]">{formatNaira(amount - (amount * commissionRate) / 100)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Transfer Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="ACH Direct Deposit">ACH Direct Deposit</option>
                    <option value="Stripe Connect">Stripe Connect</option>
                    <option value="Manual Wire">Manual Wire</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Destination Bank Account</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="e.g. Chase Bank •••• 4891"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  Confirm & Record Settlement
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
