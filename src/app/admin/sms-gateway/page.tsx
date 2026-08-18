'use client';

import { useState } from 'react';
import { MessageSquare, Save, CheckCircle2, Send, Phone } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminSmsGatewayPage() {
  const [provider, setProvider] = useState<'twilio' | 'msg91' | 'firebase'>('twilio');
  const [accountSid, setAccountSid] = useState('AC_twilio_example_sid_984102');
  const [authToken, setAuthToken] = useState('••••••••••••••••••••••••••••');
  const [senderId, setSenderId] = useState('+1 (555) 019-2831');
  const [testPhone, setTestPhone] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendTestSms = () => {
    if (!testPhone.trim()) return alert('Please enter a valid phone number for SMS test');
    setTestStatus('Sending test SMS via Twilio...');
    setTimeout(() => {
      setTestStatus(`✓ Test SMS successfully dispatched to ${testPhone}`);
      setTimeout(() => setTestStatus(''), 4000);
    }, 1000);
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <MessageSquare size={24} className="text-[#0aad0a]" /> SMS Gateway & OTP Provider
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure phone verification SMS gateways, order alert text messages, and driver dispatch notifications
            </p>
          </div>

          <button
            onClick={handleSave}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Save size={16} />
            <span>Save SMS Gateway</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} /> SMS gateway configuration saved!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Config Form */}
          <form onSubmit={handleSave} className="lg:col-span-2 bg-[#1e2632] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Active SMS Gateway Service</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
              >
                <option value="twilio">Twilio Programmable Messaging (Global)</option>
                <option value="msg91">MSG91 Enterprise SMS</option>
                <option value="firebase">Firebase Phone Auth / Cloud Messaging</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Account SID / Auth Key</label>
                <input
                  type="text"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Auth Token / Secret</label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Sender ID / Twilio Virtual Number</label>
              <input
                type="text"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                placeholder="+1 (555) 019-2831 or GROCHUB"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                required
              />
            </div>
          </form>

          {/* Test SMS Card */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Send size={18} className="text-[#0aad0a]" /> Test SMS Dispatch
              </h3>
              <p className="text-xs text-gray-400">
                Send a live test verification OTP code to your phone number to verify gateway connectivity
              </p>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-gray-300">Destination Phone Number</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              {testStatus && (
                <div className="bg-emerald-950/40 border border-[#0aad0a]/30 text-[#0aad0a] text-xs font-bold p-3 rounded-xl">
                  {testStatus}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSendTestSms}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={14} />
              <span>Send Live Test SMS</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
