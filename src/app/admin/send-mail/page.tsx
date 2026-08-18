'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2, Users, FileText } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminSendMailPage() {
  const [audience, setAudience] = useState('customers');
  const [subject, setSubject] = useState('Weekend Special: 30% OFF Fresh Seasonal Produce!');
  const [message, setMessage] = useState(
    'Hello Valued Customer,\n\nEnjoy fresh organic fruits and pantry essentials delivered in 30 minutes. Use promo code FRESH30 at checkout this weekend!\n\nBest regards,\nGroceryHub Team'
  );
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Mail size={24} className="text-[#0aad0a]" /> Broadcast Email & Newsletters
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Compose and dispatch promotional email campaigns, service announcements, and newsletters
          </p>
        </div>

        {sentSuccess && (
          <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} /> Email campaign broadcast successfully dispatched to recipients!
          </div>
        )}

        <form onSubmit={handleSendBroadcast} className="bg-[#1e2632] border border-gray-800 rounded-3xl p-8 space-y-6 max-w-3xl">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Target Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="customers">All Registered Customers (4,920 recipients)</option>
              <option value="sellers">All Certified Store Vendors (34 vendors)</option>
              <option value="delivery">Active Courier Fleet Riders (18 couriers)</option>
              <option value="all">Everyone on Platform (Global Broadcast)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Email Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Important update regarding holiday delivery hours"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Email Message Body (Plain text or HTML)</label>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] leading-relaxed"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Send size={15} />
              <span>{isSending ? 'Sending Campaign...' : 'Dispatch Broadcast Email'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
