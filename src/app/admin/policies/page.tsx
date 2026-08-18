'use client';

import { useState } from 'react';
import { FileText, Save, CheckCircle2, Eye, ShieldCheck } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface PolicyDocument {
  id: string;
  title: string;
  lastUpdated: string;
  content: string;
}

const DEFAULT_POLICIES: Record<string, PolicyDocument> = {
  privacy: {
    id: 'privacy',
    title: 'Customer Privacy Policy',
    lastUpdated: 'Aug 17, 2026',
    content: `## 1. Information We Collect
We collect personal identification information including your full name, mobile number, delivery address, and payment transaction tokens to process and deliver your grocery orders in under 30 minutes.

## 2. Real-Time Geolocation Tracking
Our delivery system accesses your delivery coordinates strictly during order placement and active transit to calculate accurate transit timeframes and dispatch the closest courier.

## 3. Data Protection & Security
We employ industry-standard 256-bit SSL encryption and tokenized payment gateways (Stripe, PayPal). Your credit card credentials are never saved on our physical servers.`,
  },
  terms: {
    id: 'terms',
    title: 'Terms & Conditions of Service',
    lastUpdated: 'Aug 17, 2026',
    content: `## 1. Order Acceptance & Pricing
All grocery prices, farm discounts, and stock quantities displayed on the storefront are subject to real-time partner store availability.

## 2. Cancellation Window
Orders may be cancelled free of charge before the vendor marks the items as "Packed". Once dispatched with a courier, standard transit fees apply.

## 3. Digital Wallet Use
Refunds and promotional vouchers credited to your digital wallet can be redeemed immediately towards future checkout orders.`,
  },
  seller: {
    id: 'seller',
    title: 'Vendor / Seller Terms of Agreement',
    lastUpdated: 'Aug 17, 2026',
    content: `## 1. Organic Farm Quality Standards
All certified vendors must maintain hygienic refrigeration and hand-pack only fresh produce meeting GroceryHub Grade-A quality standards.

## 2. Store Commission & Payouts
GroceryHub retains a 5% standard platform commission on completed grocery sales. Net vendor earnings can be withdrawn to bank accounts weekly.`,
  },
  delivery: {
    id: 'delivery',
    title: 'Courier & Delivery Boy Policy',
    lastUpdated: 'Aug 17, 2026',
    content: `## 1. Food Temperature & Safety
All perishable groceries must remain sealed in insulated bags during transit.

## 2. COD Remittance
All Cash on Delivery (COD) cash payments collected from buyers must be deposited at the store counter within 24 hours of collection.`,
  },
};

export default function AdminPoliciesPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof DEFAULT_POLICIES>('privacy');
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentPolicy = policies[activeTab];

  const handleContentChange = (val: string) => {
    setPolicies((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        content: val,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
    }));
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
              <FileText size={24} className="text-[#0aad0a]" /> Store Policies & Legal Content Editor
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Edit Privacy Policy, Terms & Conditions, Seller Agreement, and Courier Policy with live split preview
            </p>
          </div>

          <button
            onClick={handleSave}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Save size={16} />
            <span>Publish Legal Policy</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} /> {currentPolicy.title} published and live on storefront!
          </div>
        )}

        {/* Policy Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-800">
          {(Object.keys(policies) as Array<keyof typeof DEFAULT_POLICIES>).map((key) => {
            const p = policies[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                    : 'bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        {/* Split Screen Editor & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Markdown Editor */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider">Markdown Editor</span>
              <span className="text-[11px] text-gray-400">Last updated: {currentPolicy.lastUpdated}</span>
            </div>
            <textarea
              rows={16}
              value={currentPolicy.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-2xl p-4 text-xs font-mono focus:outline-none focus:border-[#0aad0a] leading-relaxed"
            />
          </div>

          {/* Live Preview */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-[#0aad0a] uppercase tracking-wider">
              <Eye size={16} />
              <span>Live Storefront Preview</span>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 space-y-4 max-h-[440px] overflow-y-auto text-xs text-gray-300 leading-relaxed">
              <h2 className="text-base font-black text-white">{currentPolicy.title}</h2>
              <div className="whitespace-pre-line space-y-2">
                {currentPolicy.content}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
