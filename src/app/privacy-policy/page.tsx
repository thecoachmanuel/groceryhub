'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 w-full">
        <div className="space-y-2">
          <Link href="/" className="text-xs font-bold text-gray-500 hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] px-3 py-1 rounded-full text-xs font-black uppercase">
            <ShieldCheck size={14} /> Security & Transparency
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-xs text-gray-400">Last updated: August 17, 2026</p>
        </div>

        <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900 dark:text-white">1. Information We Collect</h2>
            <p>
              When you use GroceryHub, we collect personal information such as your name, delivery address, phone number, email address, and payment transaction details to process your grocery orders and provide 30-minute hyper-local delivery services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900 dark:text-white">2. How We Use Your Data</h2>
            <p>
              Your data is strictly utilized to fulfill your orders, provide real-time order tracking notifications, personalize product recommendations, process secure payments, and communicate service updates. We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900 dark:text-white">3. Payment Security & Encryption</h2>
            <p>
              All payment transactions are encrypted using industry-standard SSL/TLS protocols and processed directly through certified PCI-DSS compliant payment gateways (Stripe, Razorpay, Cashfree, PayPal).
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
