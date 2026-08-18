'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Save, CheckCircle2, KeyRound, Globe, Smartphone } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface PaymentGateway {
  _id?: string;
  name: string;
  key: string;
  type: string;
  status: 'Active' | 'Inactive';
  mode: 'Test' | 'Live';
  publicKey?: string;
  secretKey?: string;
}

export default function AdminPaymentMethodsPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchGateways = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/payment-methods');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setGateways(data.data);
      } else {
        // Fallback default gateways for initial setup
        setGateways([
          { key: 'paystack', name: 'Paystack Payment Gateway', type: 'online', status: 'Active', mode: 'Test', publicKey: 'pk_test_groceryhub', secretKey: 'sk_test_groceryhub' },
          { key: 'cod', name: 'Cash on Delivery (COD & Doorstep POS)', type: 'offline', status: 'Active', mode: 'Live', publicKey: 'N/A', secretKey: 'N/A' },
          { key: 'wallet', name: 'GroceryHub Digital Wallet', type: 'wallet', status: 'Active', mode: 'Live', publicKey: 'INTERNAL', secretKey: 'INTERNAL' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching payment gateways:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  const handleToggle = (key: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.key === key ? { ...g, status: g.status === 'Active' ? 'Inactive' : 'Active' } : g))
    );
  };

  const handleModeToggle = (key: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.key === key ? { ...g, mode: g.mode === 'Test' ? 'Live' : 'Test' } : g))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      for (const g of gateways) {
        if (g._id) {
          await fetch('/api/admin/payment-methods', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: g._id, ...g }),
          });
        } else {
          await fetch('/api/admin/payment-methods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(g),
          });
        }
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      fetchGateways();
    } catch (err) {
      console.error('Error saving payment gateways:', err);
    }
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <CreditCard size={24} className="text-[#0aad0a]" /> Payment Gateways &amp; Methods
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure checkout payment providers, Paystack API keys, and Nigerian Naira (₦) settlement rules
            </p>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-950/80 border border-[#0aad0a] text-[#0aad0a] px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 size={16} /> Payment settings saved successfully!
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-xs">Loading payment methods...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {gateways.map((g) => (
                <div
                  key={g.key}
                  className={`bg-[#1e2632] border rounded-3xl p-6 transition-all space-y-4 ${
                    g.status === 'Active' ? 'border-gray-800' : 'border-gray-800/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                        g.key === 'paystack' ? 'bg-[#00c3f7]/20 text-[#00c3f7]' : 'bg-[#0aad0a]/20 text-[#0aad0a]'
                      }`}>
                        {g.key === 'paystack' ? <Smartphone size={20} /> : <CreditCard size={20} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{g.name}</h3>
                        <p className="text-xs text-gray-400">Accept transactions in Nigerian Naira (₦)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {g.key === 'paystack' && (
                        <button
                          type="button"
                          onClick={() => handleModeToggle(g.key)}
                          className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border transition-all ${
                            g.mode === 'Live'
                              ? 'bg-emerald-950/60 text-[#0aad0a] border-[#0aad0a]/40'
                              : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                          }`}
                        >
                          ● {g.mode} mode
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggle(g.key)}
                        className={`text-xs font-black px-4 py-1.5 rounded-full transition-all ${
                          g.status === 'Active'
                            ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {g.status === 'Active' ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>

                  {g.key === 'paystack' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-gray-300 flex items-center gap-1">
                          <KeyRound size={13} className="text-[#0aad0a]" /> Public / API Key
                        </label>
                        <input
                          type="text"
                          value={g.publicKey || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGateways((prev) => prev.map((item) => (item.key === g.key ? { ...item, publicKey: val } : item)));
                          }}
                          className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono focus:outline-none focus:border-[#0aad0a]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-gray-300 flex items-center gap-1">
                          <KeyRound size={13} className="text-amber-400" /> Secret Key
                        </label>
                        <input
                          type="password"
                          value={g.secretKey || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGateways((prev) => prev.map((item) => (item.key === g.key ? { ...item, secretKey: val } : item)));
                          }}
                          className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono focus:outline-none focus:border-[#0aad0a]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-8 py-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Save size={16} />
                <span>Save Payment Gateway Configurations</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
