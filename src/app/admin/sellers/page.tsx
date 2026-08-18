'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Store, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X, 
  Percent, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Wallet, 
  Eye, 
  ThumbsUp, 
  ThumbsDown 
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface SellerItem {
  id: number;
  name: string;
  owner: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  products: number;
  commission: number;
  walletBalance: number;
  taxId: string;
  bankAccount: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  statusReason?: string;
  requireProductApproval: boolean;
  image: string;
}

const INITIAL_SELLERS: SellerItem[] = [
  {
    id: 1,
    name: 'Green Valley Organic Farms',
    owner: 'Robert Jenkins',
    email: 'robert@greenvalley.ng',
    phone: '+234 802 345 6789',
    city: 'Lagos',
    area: 'Victoria Island Zone',
    products: 240,
    commission: 5.0,
    walletBalance: 489050.00,
    taxId: 'TIN-12345678',
    bankAccount: 'Zenith Bank •••• 9102',
    status: 'Approved',
    requireProductApproval: false,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300',
  },
  {
    id: 2,
    name: 'Daily Dairy & Poultry Fresh',
    owner: 'Sarah Miller',
    email: 'sarah@dailydairy.ng',
    phone: '+234 803 234 5678',
    city: 'Lagos',
    area: 'Ikeja GRA Wholesale Hub',
    products: 180,
    commission: 5.0,
    walletBalance: 312000.00,
    taxId: 'TIN-98765432',
    bankAccount: 'GTBank •••• 4812',
    status: 'Approved',
    requireProductApproval: false,
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=300',
  },
  {
    id: 3,
    name: 'SunFresh Orchard Produce',
    owner: 'Marcus Vance',
    email: 'marcus@sunfresh.ng',
    phone: '+234 809 890 1234',
    city: 'Lagos',
    area: 'Lekki Phase 1 Corridor',
    products: 45,
    commission: 6.0,
    walletBalance: 0.00,
    taxId: 'TIN-54987123',
    bankAccount: 'Access Bank •••• 7721',
    status: 'Pending',
    requireProductApproval: true,
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300',
  },
  {
    id: 4,
    name: 'The Artisanal Bakery Co.',
    owner: 'Jean-Luc Dupont',
    email: 'jean@artisanalbakery.ng',
    phone: '+234 807 345 6789',
    city: 'Lagos',
    area: 'Ikoyi Gourmet Zone',
    products: 32,
    commission: 5.0,
    walletBalance: 120500.00,
    taxId: 'TIN-77123984',
    bankAccount: 'First Bank •••• 3341',
    status: 'Approved',
    requireProductApproval: false,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
  },
];

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerItem[]>(INITIAL_SELLERS);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit / Commission Modal
  const [selectedSeller, setSelectedSeller] = useState<SellerItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCommission, setEditCommission] = useState(5.0);
  const [editRequireApproval, setEditRequireApproval] = useState(false);

  // Reject Reason Modal
  const [rejectingSeller, setRejectingSeller] = useState<SellerItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: number) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Approved', statusReason: undefined } : s))
    );
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingSeller) return;
    setSellers((prev) =>
      prev.map((s) =>
        s.id === rejectingSeller.id
          ? { ...s, status: 'Rejected', statusReason: rejectReason || 'Incomplete registration documents' }
          : s
      )
    );
    setRejectingSeller(null);
    setRejectReason('');
  };

  const openEditModal = (s: SellerItem) => {
    setSelectedSeller(s);
    setEditCommission(s.commission);
    setEditRequireApproval(s.requireProductApproval);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeller) return;
    setSellers((prev) =>
      prev.map((s) =>
        s.id === selectedSeller.id
          ? { ...s, commission: editCommission, requireProductApproval: editRequireApproval }
          : s
      )
    );
    setIsEditModalOpen(false);
  };

  const filtered = sellers.filter((s) => {
    if (activeTab !== 'All' && s.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.owner.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = sellers.filter((s) => s.status === 'Pending').length;

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Store size={24} className="text-[#0aad0a]" /> Vendor Store Applications & Commissions
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Review new merchant applications, approve stores, set platform service fees, and track earnings
            </p>
          </div>
        </div>

        {/* Tab Filter & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-[#1e2632] border border-gray-800 p-1.5 rounded-2xl w-fit text-xs font-bold">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab} Stores</span>
                {tab === 'Pending' && pendingCount > 0 && (
                  <span className="bg-amber-400 text-gray-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor by store or owner..."
              className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Store & Merchant</th>
                  <th className="pb-3 px-3">City / Zone</th>
                  <th className="pb-3 px-3">Tax ID & Bank</th>
                  <th className="pb-3 px-3">Platform Fee</th>
                  <th className="pb-3 px-3">Wallet Balance</th>
                  <th className="pb-3 px-3">Approval Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                          <Image src={s.image} alt={s.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">{s.name}</span>
                          <span className="text-gray-400 text-[11px]">{s.owner} • {s.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-white font-semibold block">{s.city}</span>
                      <span className="text-gray-400 text-[10px]">{s.area}</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px]">
                      <span className="text-gray-300 block">EIN: {s.taxId}</span>
                      <span className="text-gray-500">Bank: {s.bankAccount}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-emerald-400 font-black bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md font-mono">
                        {s.commission}% commission
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white font-mono">
                      {formatNaira(s.walletBalance)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          s.status === 'Approved'
                            ? 'bg-emerald-950/60 text-[#0aad0a] border border-[#0aad0a]/30'
                            : s.status === 'Pending'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40 animate-pulse'
                            : 'bg-red-950/60 text-red-400 border border-red-800/40'
                        }`}
                      >
                        ● {s.status === 'Pending' ? 'Pending Review' : s.status}
                      </span>
                      {s.statusReason && (
                        <p className="text-[10px] text-red-400 mt-1 truncate max-w-xs">{s.statusReason}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(s.id)}
                              className="bg-[#0aad0a] hover:bg-[#088f08] text-white px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-md shadow-[#0aad0a]/20"
                              title="Approve Store"
                            >
                              <ThumbsUp size={13} /> Approve
                            </button>
                            <button
                              onClick={() => setRejectingSeller(s)}
                              className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1"
                              title="Reject Application"
                            >
                              <ThumbsDown size={13} /> Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-2 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white"
                              title="Edit Commission & Rules"
                            >
                              <Edit3 size={15} />
                            </button>
                            {s.status === 'Approved' ? (
                              <button
                                onClick={() => setRejectingSeller(s)}
                                className="p-2 hover:bg-red-950/40 rounded-xl text-gray-400 hover:text-red-400"
                                title="Suspend Store"
                              >
                                <X size={15} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApprove(s.id)}
                                className="p-2 hover:bg-emerald-950/40 rounded-xl text-gray-400 hover:text-[#0aad0a]"
                                title="Re-approve Store"
                              >
                                <CheckCircle2 size={15} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Commission Modal */}
      {isEditModalOpen && selectedSeller && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">{selectedSeller.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Configure platform commission & store policies</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Platform Service Fee / Commission Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={editCommission}
                    onChange={(e) => setEditCommission(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 pl-10 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                  <Percent size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
                <p className="text-[11px] text-gray-400">
                  Deducted automatically from vendor payouts upon order delivery.
                </p>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-gray-300 pt-2">
                <input
                  type="checkbox"
                  checked={editRequireApproval}
                  onChange={(e) => setEditRequireApproval(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0aad0a] bg-gray-900 border-gray-700 focus:ring-0"
                />
                <span>Require Admin Approval for new product listings</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  Save Store Settings
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Application Modal */}
      {rejectingSeller && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setRejectingSeller(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black text-red-400">Reject Application</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Provide feedback to {rejectingSeller.name} regarding application status
              </p>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Rejection Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Incomplete food hygiene certification or invalid Tax ID..."
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-red-400"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all"
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingSeller(null)}
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
