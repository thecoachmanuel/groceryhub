'use client';

import { useState } from 'react';
import { CreditCard, Save, CheckCircle2, ShieldCheck, KeyRound, Globe, DollarSign, Smartphone } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface PaymentGateway {
  id: string;
  name: string;
  enabled: boolean;
  mode: 'sandbox' | 'live';
  apiKey: string;
  secretKey: string;
  webhookSecret?: string;
  description: string;
  currency: string;
}

const INITIAL_GATEWAYS: PaymentGateway[] = [
  {
    id: 'paystack',
    name: 'Paystack Payment Gateway (Primary)',
    enabled: true,
    mode: 'sandbox',
    apiKey: 'pk_test_groceryhub_paystack_public_key',
    secretKey: 'sk_test_groceryhub_paystack_secret_key',
    webhookSecret: 'whsec_paystack_ng_2026',
    description: 'Accept Nigerian Cards, Direct Bank Transfers, USSD (*737#, *894#), Apple Pay, and OPay in Nigerian Naira (₦)',
    currency: 'NGN (₦)',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD & Doorstep POS)',
    enabled: true,
    mode: 'live',
    apiKey: 'N/A',
    secretKey: 'N/A',
    description: 'Allow customers to pay physically in cash or via rider mobile POS terminal upon delivery',
    currency: 'NGN (₦)',
  },
  {
    id: 'wallet',
    name: 'GroceryHub Naira Digital Wallet',
    enabled: true,
    mode: 'live',
    apiKey: 'INTERNAL',
    secretKey: 'INTERNAL',
    description: 'Customer digital wallet stored in MongoDB for 1-click checkout and referral cashback credits',
    currency: 'NGN (₦)',
  },
];

export default function AdminPaymentMethodsPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>(INITIAL_GATEWAYS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const handleModeToggle = (id: string) => {
    setGateways((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, mode: g.mode === 'sandbox' ? 'live' : 'sandbox' } : g
      )
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {gateways.map((g) => (
              <div
                key={g.id}
                className={`bg-[#1e2632] border rounded-3xl p-6 transition-all space-y-4 ${
                  g.enabled ? 'border-gray-800' : 'border-gray-800/40 opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                      g.id === 'paystack' ? 'bg-[#00c3f7]/20 text-[#00c3f7]' : 'bg-[#0aad0a]/20 text-[#0aad0a]'
                    }`}>
                      {g.id === 'paystack' ? <Smartphone size={20} /> : <CreditCard size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{g.name}</h3>
                      <p className="text-xs text-gray-400">{g.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {g.apiKey !== 'N/A' && g.apiKey !== 'INTERNAL' && (
                      <button
                        type="button"
                        onClick={() => handleModeToggle(g.id)}
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border transition-all ${
                          g.mode === 'live'
                            ? 'bg-emerald-950/60 text-[#0aad0a] border-[#0aad0a]/40'
                            : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                        }`}
                      >
                        ● {g.mode} mode
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggle(g.id)}
                      className={`text-xs font-black px-4 py-1.5 rounded-full transition-all ${
                        g.enabled
                          ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {g.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>

                {g.apiKey !== 'N/A' && g.apiKey !== 'INTERNAL' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-300 flex items-center gap-1">
                        <KeyRound size={13} className="text-[#0aad0a]" /> Public / API Key
                      </label>
                      <input
                        type="text"
                        defaultValue={g.apiKey}
                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono focus:outline-none focus:border-[#0aad0a]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-300 flex items-center gap-1">
                        <KeyRound size={13} className="text-amber-400" /> Secret Key
                      </label>
                      <input
                        type="password"
                        defaultValue={g.secretKey}
                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono focus:outline-none focus:border-[#0aad0a]"
                      />
                    </div>

                    {g.webhookSecret && (
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="font-bold text-gray-300 flex items-center gap-1">
                          <Globe size={13} className="text-blue-400" /> Webhook Secret / Signature Token
                        </label>
                        <input
                          type="text"
                          defaultValue={g.webhookSecret}
                          className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 font-mono focus:outline-none focus:border-[#0aad0a]"
                        />
                      </div>
                    )}
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
      </main>
    </div>
  );
}
