'use client';

import { useState } from 'react';
import { 
  Percent, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Calendar, 
  CheckCircle2, 
  X, 
  Filter,
  Copy,
  Tag
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface CouponItem {
  id: number;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minSpend: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'Active' | 'Inactive' | 'Expired';
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 1,
    code: 'WELCOME5000',
    description: 'Flat ₦5,000 discount for newly registered users on first order',
    discountType: 'flat',
    discountValue: 5000,
    minSpend: 15000,
    maxDiscount: 5000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    usedCount: 430,
    status: 'Active',
  },
  {
    id: 2,
    code: 'FRESH30',
    description: '30% OFF on all fresh seasonal fruits and organic greens',
    discountType: 'percentage',
    discountValue: 30,
    minSpend: 8000,
    maxDiscount: 4500,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    usageLimit: 500,
    usedCount: 210,
    status: 'Active',
  },
  {
    id: 3,
    code: 'FREESHIP',
    description: '100% Free Express Delivery waiver on orders over ₦15,000',
    discountType: 'flat',
    discountValue: 1500,
    minSpend: 15000,
    maxDiscount: 1500,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 5000,
    usedCount: 890,
    status: 'Active',
  },
  {
    id: 4,
    code: 'SUMMER50',
    description: 'Summer season 50% flash clearance promotion',
    discountType: 'percentage',
    discountValue: 50,
    minSpend: 20000,
    maxDiscount: 10000,
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    usageLimit: 300,
    usedCount: 300,
    status: 'Expired',
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form fields
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minSpend, setMinSpend] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Expired'>('Active');

  const handleCopyCode = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    setCopiedCode(promoCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue('10');
    setMinSpend('5000');
    setMaxDiscount('2000');
    setStartDate('2026-08-18');
    setEndDate('2026-09-18');
    setUsageLimit('500');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (c: CouponItem) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDescription(c.description);
    setDiscountType(c.discountType);
    setDiscountValue(String(c.discountValue));
    setMinSpend(String(c.minSpend));
    setMaxDiscount(String(c.maxDiscount));
    setStartDate(c.startDate);
    setEndDate(c.endDate);
    setUsageLimit(String(c.usageLimit));
    setStatus(c.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return alert('Promo code is required');
    if (!description.trim()) return alert('Description is required');

    const val = parseFloat(discountValue || '0');
    const minS = parseFloat(minSpend || '0');
    const maxD = parseFloat(maxDiscount || '0');
    const limit = parseInt(usageLimit || '0', 10);

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: code.trim().toUpperCase(),
                description: description.trim(),
                discountType,
                discountValue: val,
                minSpend: minS,
                maxDiscount: maxD,
                startDate,
                endDate,
                usageLimit: limit,
                status,
              }
            : c
        )
      );
    } else {
      const newCoupon: CouponItem = {
        id: Date.now(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        discountValue: val,
        minSpend: minS,
        maxDiscount: maxD,
        startDate,
        endDate,
        usageLimit: limit,
        usedCount: 0,
        status,
      };
      setCoupons([newCoupon, ...coupons]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this coupon campaign?')) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatusMap: Record<CouponItem['status'], CouponItem['status']> = {
            Active: 'Inactive',
            Inactive: 'Active',
            Expired: 'Active',
          };
          return { ...c, status: nextStatusMap[c.status] };
        }
        return c;
      })
    );
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const pendingCount = coupons.filter((c) => c.status === 'Active').length;

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Tag size={24} className="text-[#0aad0a]" /> Discount Coupons &amp; Promotions
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Create, configure, and manage store discount vouchers, percentage promos, and campaign budgets in Naira (₦)
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Create New Coupon</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coupon code or description..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Promo Code</th>
                  <th className="pb-3 px-3">Discount Rule</th>
                  <th className="pb-3 px-3">Spend &amp; Cap (₦)</th>
                  <th className="pb-3 px-3">Validity Window</th>
                  <th className="pb-3 px-3">Usage Redemptions</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filteredCoupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-800/40 transition-colors">
                    {/* Code */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black bg-[#0aad0a]/10 text-[#0aad0a] px-2.5 py-1 rounded-lg border border-[#0aad0a]/20 inline-block font-mono text-xs">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(c.code)}
                            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                            title="Copy Code"
                          >
                            <Copy size={12} />
                          </button>
                          {copiedCode === c.code && (
                            <span className="text-[9px] text-[#0aad0a] font-bold">Copied!</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 max-w-xs truncate">{c.description}</p>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white font-mono">
                        {c.discountType === 'percentage'
                          ? `${c.discountValue}% OFF`
                          : `${formatNaira(c.discountValue)} Flat OFF`}
                      </div>
                      <span className="text-[10px] text-gray-400 capitalize font-mono">
                        {c.discountType} discount
                      </span>
                    </td>

                    {/* Min Spend / Max Discount */}
                    <td className="py-3.5 px-3 font-mono">
                      <div>Min: <strong className="text-white">{formatNaira(c.minSpend)}</strong></div>
                      {c.maxDiscount > 0 && (
                        <div className="text-[11px] text-gray-400">
                          Max Cap: {formatNaira(c.maxDiscount)}
                        </div>
                      )}
                    </td>

                    {/* Validity Window */}
                    <td className="py-3.5 px-3 text-gray-400">
                      <div>{c.startDate}</div>
                      <div className="text-[11px] text-gray-500">to {c.endDate}</div>
                    </td>

                    {/* Usage */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{c.usedCount} / {c.usageLimit}</div>
                      <div className="w-20 bg-gray-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-[#0aad0a] h-full"
                          style={{
                            width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(c.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          c.status === 'Active'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : c.status === 'Expired'
                            ? 'bg-red-950/40 text-red-400 border border-red-900/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                        title="Click to toggle status"
                      >
                        ● {c.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit Coupon"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                          title="Delete Coupon"
                        >
                          <Trash2 size={15} />
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

      {/* Create / Edit Coupon Modal */}
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
              <h3 className="text-xl font-black">
                {editingCoupon ? 'Edit Promotional Coupon' : 'Create New Promotional Coupon'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Define voucher codes, discount formulas, minimum spend requirements, and usage caps in Naira
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Promo Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER25"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="flat">Flat Naira Amount (₦)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Campaign Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 20% discount on fresh organic fruits"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">
                    {discountType === 'percentage' ? 'Discount %' : 'Discount ₦'}
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="20"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Min Order Spend (₦)</label>
                  <input
                    type="number"
                    step="100"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    placeholder="25"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Max Discount (₦)</label>
                  <input
                    type="number"
                    step="100"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="15"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Total Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="500"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingCoupon ? 'Save Coupon Updates' : 'Publish Coupon Campaign'}
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
