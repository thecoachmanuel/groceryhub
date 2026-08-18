'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Phone, 
  CheckCircle2, 
  X, 
  DollarSign, 
  Receipt,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ShieldCheck,
  Percent
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface DriverItem {
  id: number;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  licenseNo: string;
  city: string;
  activeOrders: number;
  completed: number;
  cashInHand: number;
  tripBonus: number;
  status: 'Pending' | 'On Duty' | 'Offline' | 'Suspended';
  statusReason?: string;
}

const INITIAL_DRIVERS: DriverItem[] = [
  { id: 1, name: 'Marcus Vance', phone: '+234 809 111 2233', email: 'marcus.v@groceryhub.ng', vehicle: 'Honda Super Cub 125cc (LAG-8492)', licenseNo: 'DL-LAG-89104', city: 'Lagos (Victoria Island)', activeOrders: 1, completed: 342, cashInHand: 15500, tripBonus: 500, status: 'On Duty' },
  { id: 2, name: 'David Chen', phone: '+234 803 987 6543', email: 'david.chen@groceryhub.ng', vehicle: 'Electric Cargo Bike (EB-102)', licenseNo: 'DL-LAG-44821', city: 'Lagos (Ikeja)', activeOrders: 0, completed: 512, cashInHand: 0, tripBonus: 500, status: 'On Duty' },
  { id: 3, name: 'Alex Rivera', phone: '+234 802 345 6789', email: 'alex.rivera@groceryhub.ng', vehicle: 'Yamaha Zuma 125', licenseNo: 'DL-LAG-19034', city: 'Lagos (Lekki Phase 1)', activeOrders: 0, completed: 0, cashInHand: 0, tripBonus: 500, status: 'Pending' },
  { id: 4, name: 'James Wilson', phone: '+234 805 123 4567', email: 'j.wilson@groceryhub.ng', vehicle: 'TVS Star HLX 150', licenseNo: 'DL-LAG-90234', city: 'Lagos (Surulere)', activeOrders: 0, completed: 189, cashInHand: 42000, tripBonus: 500, status: 'Offline' },
];

export default function AdminDeliveryFleetPage() {
  const [drivers, setDrivers] = useState<DriverItem[]>(INITIAL_DRIVERS);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'On Duty' | 'Offline' | 'Suspended'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('groceryhub_admin_drivers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDrivers(parsed);
          }
        } catch {}
      }
    }
  }, []);

  const saveDriversToStorage = (updated: DriverItem[]) => {
    setDrivers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryhub_admin_drivers', JSON.stringify(updated));
    }
  };

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverItem | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [city, setCity] = useState('New York');
  const [tripBonus, setTripBonus] = useState(2.50);
  const [status, setStatus] = useState<DriverItem['status']>('On Duty');

  // Reject Modal
  const [rejectingDriver, setRejectingDriver] = useState<DriverItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: number) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'On Duty', statusReason: undefined } : d))
    );
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingDriver) return;
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === rejectingDriver.id
          ? { ...d, status: 'Suspended', statusReason: rejectReason || 'Incomplete driving background documents' }
          : d
      )
    );
    setRejectingDriver(null);
    setRejectReason('');
  };

  const openCreateModal = () => {
    setEditingDriver(null);
    setName('');
    setPhone('');
    setEmail('');
    setVehicle('Honda Scooter (125cc)');
    setLicenseNo('');
    setCity('New York');
    setTripBonus(2.50);
    setStatus('On Duty');
    setIsModalOpen(true);
  };

  const openEditModal = (d: DriverItem) => {
    setEditingDriver(d);
    setName(d.name);
    setPhone(d.phone);
    setEmail(d.email);
    setVehicle(d.vehicle);
    setLicenseNo(d.licenseNo);
    setCity(d.city);
    setTripBonus(d.tripBonus);
    setStatus(d.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Driver name is required');

    if (editingDriver) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === editingDriver.id
            ? {
                ...d,
                name,
                phone,
                email,
                vehicle,
                licenseNo,
                city,
                tripBonus,
                status,
              }
            : d
        )
      );
    } else {
      const newDriver: DriverItem = {
        id: Date.now(),
        name,
        phone,
        email,
        vehicle,
        licenseNo,
        city,
        activeOrders: 0,
        completed: 0,
        cashInHand: 0.00,
        tripBonus,
        status,
      };
      setDrivers([newDriver, ...drivers]);
    }
    setIsModalOpen(false);
  };

  const filtered = drivers.filter((d) => {
    if (activeTab !== 'All' && d.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.vehicle.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = drivers.filter((d) => d.status === 'Pending').length;

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Truck size={24} className="text-[#0aad0a]" /> Delivery Fleet & Driver Approvals
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Review courier registrations, activate riders, set trip delivery bonuses, and track COD remittances
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Courier Driver</span>
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link
            href="/admin/delivery-boys"
            className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-2"
          >
            <Truck size={14} /> Fleet Directory ({drivers.length})
          </Link>
          <Link
            href="/admin/delivery-boys/cash-collection"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Receipt size={14} className="text-amber-400" /> COD Cash Collections
          </Link>
          <Link
            href="/admin/delivery-boys/fund-transfers"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <DollarSign size={14} className="text-blue-400" /> Fund Transfers & Payouts
          </Link>
        </div>

        {/* Status Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-[#1e2632] border border-gray-800 p-1.5 rounded-2xl w-fit text-xs font-bold">
            {(['All', 'Pending', 'On Duty', 'Offline', 'Suspended'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab}</span>
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
              placeholder="Search driver by name, phone, or vehicle..."
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
                  <th className="pb-3 px-3">Courier Name</th>
                  <th className="pb-3 px-3">Contact Details</th>
                  <th className="pb-3 px-3">Vehicle & License</th>
                  <th className="pb-3 px-3">Trip Bonus</th>
                  <th className="pb-3 px-3">COD in Hand</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{d.name}</div>
                      <span className="text-[11px] text-gray-400">{d.city}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="text-white font-medium">{d.phone}</div>
                      <span className="text-[11px] text-gray-400">{d.email}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="text-white font-medium">{d.vehicle}</div>
                      <span className="text-[11px] text-gray-400 font-mono">{d.licenseNo || 'Verified'}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-amber-300 font-black bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-md font-mono">
                        +${d.tripBonus.toFixed(2)} / run
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-amber-400">
                      ${d.cashInHand.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          d.status === 'On Duty'
                            ? 'bg-emerald-950/60 text-[#0aad0a] border border-[#0aad0a]/30'
                            : d.status === 'Pending'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40 animate-pulse'
                            : d.status === 'Offline'
                            ? 'bg-gray-800 text-gray-400'
                            : 'bg-red-950/60 text-red-400 border border-red-800/40'
                        }`}
                      >
                        ● {d.status === 'Pending' ? 'Pending Review' : d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {d.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(d.id)}
                              className="bg-[#0aad0a] hover:bg-[#088f08] text-white px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-md shadow-[#0aad0a]/20"
                              title="Approve Courier"
                            >
                              <ThumbsUp size={13} /> Approve
                            </button>
                            <button
                              onClick={() => setRejectingDriver(d)}
                              className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1"
                              title="Reject Application"
                            >
                              <ThumbsDown size={13} /> Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openEditModal(d)}
                              className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                              title="Edit Courier"
                            >
                              <Edit3 size={15} />
                            </button>
                            {d.status === 'Suspended' ? (
                              <button
                                onClick={() => handleApprove(d.id)}
                                className="p-1.5 hover:bg-emerald-950/40 rounded-lg text-gray-400 hover:text-[#0aad0a]"
                                title="Re-activate Courier"
                              >
                                <CheckCircle2 size={15} />
                              </button>
                            ) : (
                              <button
                                onClick={() => setRejectingDriver(d)}
                                className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                                title="Suspend Courier"
                              >
                                <X size={15} />
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

      {/* Create / Edit Driver Modal */}
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
                {editingDriver ? 'Edit Courier Profile & Bonus' : 'Register New Courier Driver'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set driver credentials, operating zone, and per-delivery compensation bonus
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Driver Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Mobile Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@groceryhub.com"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Vehicle Description</label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. Scooter / E-Bike / Car"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Driving License / Plate</label>
                  <input
                    type="text"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    placeholder="e.g. DL-NY-89104"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Operating City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Per-Trip Bonus ($)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={tripBonus}
                    onChange={(e) => setTripBonus(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Duty Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="On Duty">On Duty (Available for Dispatch)</option>
                  <option value="Offline">Offline (Shift Ended)</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingDriver ? 'Save Courier Updates' : 'Add Courier to Fleet'}
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

      {/* Reject Courier Modal */}
      {rejectingDriver && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setRejectingDriver(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black text-red-400">Decline Application</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Provide feedback for declining {rejectingDriver.name}'s courier application
              </p>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Unverified driver license or background check..."
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
                  Confirm Decline
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingDriver(null)}
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
