'use client';

import { useState } from 'react';
import { Bell, Send, Users, CheckCircle2, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const PAST_NOTIFICATIONS = [
  { id: 1, title: 'Mega Savings Weekend: 30% OFF Organic Fruits!', message: 'Use code FRESH30 during checkout. Limited time 30-min express delivery!', target: 'All Customers', date: 'Aug 17, 2026 at 06:00 PM', reach: '4,280 Sent' },
  { id: 2, title: 'Vendor Payouts for August Cycle Processed', message: 'Check your store wallet for the latest withdrawal credits and settlement statements.', target: 'Vendors Only', date: 'Aug 15, 2026 at 11:30 AM', reach: '48 Stores' },
  { id: 3, title: 'Peak Hours Surge Bonus: +₦1,500 per delivery', message: 'High order volume in Victoria Island & Lekki zones. Turn on duty to claim peak incentives!', target: 'Delivery Drivers', date: 'Aug 14, 2026 at 07:15 PM', reach: '120 Couriers' },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(PAST_NOTIFICATIONS);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('All Customers');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotif = {
      id: Date.now(),
      title,
      message,
      target,
      date: 'Just Now',
      reach: target === 'All Customers' ? '4,500+ Sent' : '150+ Sent',
    };
    setNotifications([newNotif, ...notifications]);
    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Bell size={24} className="text-[#0aad0a]" /> Push Notification Broadcaster
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Send instant Firebase FCM push notifications to mobile apps and website subscribers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Composer Form */}
          <div className="lg:col-span-1 bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-black flex items-center gap-2">
              <Send size={18} className="text-[#0aad0a]" /> Broadcast Composer
            </h3>

            {sentSuccess && (
              <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={16} /> Notification dispatched to device tokens!
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Target Audience</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="All Customers">All Registered Customers</option>
                  <option value="Vendors Only">Certified Vendors / Sellers</option>
                  <option value="Delivery Drivers">Delivery Couriers Fleet</option>
                  <option value="All Subscribers">All App & Web Subscribers</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Notification Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flash Sale Alert!"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Message Body</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message content here..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Send size={15} />
                <span>Send Push Broadcast</span>
              </button>
            </form>
          </div>

          {/* Past Broadcast History */}
          <div className="lg:col-span-2 bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-black">Broadcast Transmission History</h3>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 flex items-start justify-between gap-4 hover:border-gray-700 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#0aad0a]/10 text-[#0aad0a] text-[10px] font-black px-2 py-0.5 rounded-md">
                        {n.target}
                      </span>
                      <span className="text-[11px] text-gray-500">{n.date}</span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{n.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{n.message}</p>

                    <span className="text-[11px] text-[#0aad0a] font-bold block pt-1">
                      ✓ {n.reach} successfully
                    </span>
                  </div>

                  <button
                    onClick={() => setNotifications(notifications.filter((item) => item.id !== n.id))}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-950/40 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
