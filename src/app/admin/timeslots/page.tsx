'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface TimeslotItem {
  _id?: string;
  title: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  status: 'Active' | 'Inactive';
}

export default function AdminTimeslotsPage() {
  const [timeslots, setTimeslots] = useState<TimeslotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxOrders, setMaxOrders] = useState(50);

  const fetchTimeslots = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/timeslots');
      const data = await res.json();
      if (data.success) {
        setTimeslots(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching timeslots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeslots();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/timeslots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, startTime, endTime, maxOrders, status: 'Active' }),
      });
      setShowAddModal(false);
      setTitle('');
      setStartTime('');
      setEndTime('');
      fetchTimeslots();
    } catch (err) {
      console.error('Error creating timeslot:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeslot?')) return;
    try {
      await fetch(`/api/admin/timeslots?id=${id}`, { method: 'DELETE' });
      fetchTimeslots();
    } catch (err) {
      console.error('Error deleting timeslot:', err);
    }
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Clock size={24} className="text-[#0aad0a]" /> Delivery Timeslot Windows
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Configure scheduled delivery windows and hourly capacity quotas</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Timeslot</span>
          </button>
        </div>

        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">Loading timeslots...</div>
          ) : timeslots.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No delivery timeslots defined yet. Click Add Timeslot to create one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Slot Title</th>
                    <th className="pb-3 px-3">Time Window</th>
                    <th className="pb-3 px-3">Capacity Quota</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {timeslots.map((slot) => (
                    <tr key={slot._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white">{slot.title}</td>
                      <td className="py-3.5 px-3 text-gray-200">{slot.startTime} - {slot.endTime}</td>
                      <td className="py-3.5 px-3 font-bold text-white">{slot.maxOrders} orders max</td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/40 text-[#0aad0a]">
                          ● {slot.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => slot._id && handleDelete(slot._id)}
                            className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
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
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black">Add Delivery Timeslot</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Timeslot Label</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Night Express"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00 PM"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="11:00 PM"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Max Orders Capacity</label>
                <input
                  type="number"
                  value={maxOrders}
                  onChange={(e) => setMaxOrders(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30"
                >
                  Save Timeslot
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
