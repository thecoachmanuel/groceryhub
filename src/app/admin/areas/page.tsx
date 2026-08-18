'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Navigation, 
  CheckCircle2, 
  X, 
  Filter,
  Layers,
  Clock
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface DeliverableAreaItem {
  id: number;
  name: string;
  city: string;
  radiusKm: number;
  minOrder: number;
  deliveryFee: number;
  freeDeliveryAbove: number;
  estMinutes: number;
  status: 'Active' | 'Inactive';
}

const INITIAL_AREAS: DeliverableAreaItem[] = [
  {
    id: 1,
    name: 'Downtown Manhattan Zone',
    city: 'New York',
    radiusKm: 5.0,
    minOrder: 15.00,
    deliveryFee: 2.99,
    freeDeliveryAbove: 45.00,
    estMinutes: 25,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Westside Market & Midtown',
    city: 'New York',
    radiusKm: 7.5,
    minOrder: 20.00,
    deliveryFee: 3.49,
    freeDeliveryAbove: 50.00,
    estMinutes: 30,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Brooklyn Heights & Dumbo Hub',
    city: 'Brooklyn',
    radiusKm: 6.0,
    minOrder: 15.00,
    deliveryFee: 2.99,
    freeDeliveryAbove: 40.00,
    estMinutes: 25,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Queens Long Island City Zone',
    city: 'Queens',
    radiusKm: 8.0,
    minOrder: 25.00,
    deliveryFee: 3.99,
    freeDeliveryAbove: 60.00,
    estMinutes: 35,
    status: 'Active',
  },
];

export default function AdminAreasPage() {
  const [areas, setAreas] = useState<DeliverableAreaItem[]>(INITIAL_AREAS);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<DeliverableAreaItem | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [city, setCity] = useState('New York');
  const [radiusKm, setRadiusKm] = useState('5.0');
  const [minOrder, setMinOrder] = useState('15.00');
  const [deliveryFee, setDeliveryFee] = useState('2.99');
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState('45.00');
  const [estMinutes, setEstMinutes] = useState('30');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openCreateModal = () => {
    setEditingArea(null);
    setName('');
    setCity('New York');
    setRadiusKm('5.0');
    setMinOrder('15.00');
    setDeliveryFee('2.99');
    setFreeDeliveryAbove('45.00');
    setEstMinutes('30');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (area: DeliverableAreaItem) => {
    setEditingArea(area);
    setName(area.name);
    setCity(area.city);
    setRadiusKm(String(area.radiusKm));
    setMinOrder(String(area.minOrder));
    setDeliveryFee(String(area.deliveryFee));
    setFreeDeliveryAbove(String(area.freeDeliveryAbove));
    setEstMinutes(String(area.estMinutes));
    setStatus(area.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Zone name is required');

    if (editingArea) {
      // Update
      setAreas((prev) =>
        prev.map((a) =>
          a.id === editingArea.id
            ? {
                ...a,
                name,
                city,
                radiusKm: parseFloat(radiusKm || '5'),
                minOrder: parseFloat(minOrder || '0'),
                deliveryFee: parseFloat(deliveryFee || '0'),
                freeDeliveryAbove: parseFloat(freeDeliveryAbove || '0'),
                estMinutes: parseInt(estMinutes || '30', 10),
                status,
              }
            : a
        )
      );
    } else {
      // Create
      const newArea: DeliverableAreaItem = {
        id: Date.now(),
        name,
        city,
        radiusKm: parseFloat(radiusKm || '5'),
        minOrder: parseFloat(minOrder || '0'),
        deliveryFee: parseFloat(deliveryFee || '0'),
        freeDeliveryAbove: parseFloat(freeDeliveryAbove || '0'),
        estMinutes: parseInt(estMinutes || '30', 10),
        status,
      };
      setAreas([newArea, ...areas]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this deliverable area zone?')) {
      setAreas((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setAreas((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === 'Active' ? 'Inactive' : 'Active',
            }
          : a
      )
    );
  };

  const filteredAreas = areas.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity =
      cityFilter === 'all' || a.city.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <MapPin size={24} className="text-[#0aad0a]" /> Geofencing & Deliverable Areas
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure delivery zones, geofence radius coverage, minimum checkout spending, and express delivery charges
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Deliverable Zone</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deliverable area or city..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="all">All Cities / Regions</option>
              <option value="new york">New York</option>
              <option value="brooklyn">Brooklyn</option>
              <option value="queens">Queens</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Zone / Location</th>
                  <th className="pb-3 px-3">City Region</th>
                  <th className="pb-3 px-3">Coverage Radius</th>
                  <th className="pb-3 px-3">Order Spend Thresholds</th>
                  <th className="pb-3 px-3">Standard Fee</th>
                  <th className="pb-3 px-3">Transit Time</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filteredAreas.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-800/40 transition-colors">
                    {/* Zone Name */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center flex-shrink-0">
                          <Navigation size={14} />
                        </div>
                        <span className="font-bold text-white">{a.name}</span>
                      </div>
                    </td>

                    {/* City */}
                    <td className="py-3.5 px-3 text-gray-300 font-semibold">{a.city}</td>

                    {/* Radius */}
                    <td className="py-3.5 px-3">
                      <span className="bg-gray-800 text-gray-200 px-2.5 py-1 rounded-lg font-bold">
                        {a.radiusKm} km radius
                      </span>
                    </td>

                    {/* Spend Thresholds */}
                    <td className="py-3.5 px-3">
                      <div>Min: <strong className="text-white">${a.minOrder.toFixed(2)}</strong></div>
                      <div className="text-[11px] text-[#0aad0a]">
                        Free delivery &gt; ${a.freeDeliveryAbove.toFixed(2)}
                      </div>
                    </td>

                    {/* Delivery Fee */}
                    <td className="py-3.5 px-3 font-bold text-white">
                      ${a.deliveryFee.toFixed(2)}
                    </td>

                    {/* ETA */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock size={13} className="text-amber-400" />
                        <span>~{a.estMinutes} mins</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(a.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          a.status === 'Active'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                        title="Click to toggle status"
                      >
                        ● {a.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(a)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit Area"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                          title="Delete Area"
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

      {/* Create / Edit Area Modal */}
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
                {editingArea ? 'Edit Deliverable Zone' : 'Add New Deliverable Zone'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set geofenced radius boundary, city territory, minimum spend thresholds, and delivery pricing
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Zone / Neighborhood Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Upper East Side & Midtown"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">City / Jurisdiction</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New York"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Geofence Radius (km)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(e.target.value)}
                    placeholder="5.0"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Min Order Checkout ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="15.00"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Standard Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    placeholder="2.99"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Free Delivery Above ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={freeDeliveryAbove}
                    onChange={(e) => setFreeDeliveryAbove(e.target.value)}
                    placeholder="45.00"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Estimated Delivery Time (Mins)</label>
                  <input
                    type="number"
                    value={estMinutes}
                    onChange={(e) => setEstMinutes(e.target.value)}
                    placeholder="30"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Zone Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingArea ? 'Save Zone Updates' : 'Publish Deliverable Zone'}
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
