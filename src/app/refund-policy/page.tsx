'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 w-full">
        <div className="space-y-2">
          <Link href="/" className="text-xs font-bold text-gray-500 hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] px-3 py-1 rounded-full text-xs font-black uppercase">
            <RefreshCw size={14} /> Customer Guarantee
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Refund & Return Policy</h1>
          <p className="text-xs text-gray-400">Last updated: August 17, 2026</p>
        </div>

        <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900 dark:text-white">1. Freshness & Quality Guarantee</h2>
            <p>
              If any grocery item, fruit, or vegetable arrives damaged, spoilt, or substandard, we offer an immediate full refund or complimentary same-day replacement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900 dark:text-white">2. Refund Processing Time</h2>
            <p>
              Refunds approved by our support team are credited back to your original payment method within 2 to 5 business days, or added instantly as GroceryHub Wallet credits.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
