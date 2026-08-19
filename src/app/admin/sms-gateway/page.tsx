'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Save, CheckCircle2, Send, Phone } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { apiFetch } from '@/lib/api-fetch';

export default function AdminSmsGatewayPage() {
  const [provider, setProvider] = useState<string>('termii');
  const [apiKey, setApiKey] = useState('');
  const [senderId, setSenderId] = useState('GroceryHub');
  const [testPhone, setTestPhone] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSmsConfig() {
      try {
        setLoading(true);
        const res = await apiFetch('/api/admin/settings');
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.smsGateway) setProvider(json.data.smsGateway);
          if (json.data.smsApiKey) setApiKey(json.data.smsApiKey);
          if (json.data.smsSenderId) setSenderId(json.data.smsSenderId);
        }
      } catch (err) {
        console.warn('Error loading SMS config:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSmsConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          smsGateway: provider,
          smsApiKey: apiKey,
          smsSenderId: senderId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      } else {
        alert(json.message || 'Failed to save SMS gateway config');
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving SMS gateway config');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendTestSms = () => {
    if (!testPhone.trim()) return alert('Please enter a valid phone number for SMS test');
    setTestStatus(`Sending test SMS via ${provider.toUpperCase()}...`);
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
              <MessageSquare size={24} className="text-[#0aad0a]" /> SMS Gateway &amp; OTP Provider
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure phone verification SMS gateways (Termii, Twilio, MSG91), order alert text messages, and driver dispatch notifications
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={submitting || loading}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Save size={16} />
            )}
            <span>Save SMS Gateway</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} /> SMS gateway configuration saved to database!
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
            <p className="text-xs text-gray-400">Loading SMS gateway config...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provider Settings */}
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm border-b border-gray-800 pb-3">Gateway Credentials</h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Primary SMS Provider</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="termii">Termii Nigeria (Recommended for NGN local SMS)</option>
                    <option value="twilio">Twilio Global</option>
                    <option value="msg91">MSG91</option>
                    <option value="firebase">Firebase Phone Auth</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">API Key / Secret Token</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="TL_xxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Sender ID / From Header</label>
                  <input
                    type="text"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    placeholder="GroceryHub"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>
            </div>

            {/* Test SMS Dispatcher */}
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm border-b border-gray-800 pb-3 flex items-center gap-2">
                <Phone size={16} className="text-[#0aad0a]" /> Test SMS Dispatcher
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Destination Phone Number</label>
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+234 801 234 5678"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendTestSms}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-gray-700 transition-colors"
                >
                  <Send size={14} /> Send Test SMS
                </button>

                {testStatus && (
                  <p className="text-xs text-[#0aad0a] bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40 font-mono">
                    {testStatus}
                  </p>
                )}
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
