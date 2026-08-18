'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, Phone, Mail } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

const FAQS = [
  {
    q: 'How fast is GroceryHub delivery?',
    a: 'We deliver in 30 minutes or less! Our hyper-local distribution network and certified neighborhood vendor hubs ensure your fresh groceries reach your doorstep in record time.',
  },
  {
    q: 'Are the fruits and vegetables 100% fresh and organic?',
    a: 'Yes, all our produce is harvested and sourced daily from certified local organic farms. We perform multi-stage quality checks before packing every order.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We support all major payment gateways including Stripe, Razorpay, Cashfree, PayPal, credit/debit cards, Apple Pay, Google Pay, and Cash on Delivery (COD).',
  },
  {
    q: 'How do I return or replace a damaged product?',
    a: 'We have a hassle-free, no-questions-asked refund & replacement guarantee. Simply navigate to My Orders, select the item, and click "Request Return/Refund", or reach out to our 24/7 support.',
  },
  {
    q: 'Is there a minimum order amount for free delivery?',
    a: 'Orders above $50 qualify for free express delivery. For orders below $50, a small nominal delivery fee is applied based on your delivery zone.',
  },
  {
    q: 'How do I become a vendor / sell on GroceryHub?',
    a: 'Click on "Sell on GroceryHub" in the top bar or visit /seller/login. Submit your business verification documents and our partner onboarding team will activate your store in under 24 hours.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full">
        {/* Breadcrumb & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] px-3.5 py-1.5 rounded-full text-xs font-black uppercase">
            <HelpCircle size={14} /> 24/7 Customer Support Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Have questions about orders, payments, delivery zones, or store partnerships? Find answers below.
          </p>

          {/* Search FAQ */}
          <div className="max-w-md mx-auto pt-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help topics or questions..."
                className="w-full bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm focus:outline-none focus:border-[#0aad0a] dark:text-white shadow-sm"
              />
              <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#1e2632] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-gray-900 dark:text-white hover:text-[#0aad0a] dark:hover:text-[#0aad0a] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-[#0aad0a] flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-50 dark:border-gray-800/60 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Assistance Box */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black">Still need help with your order?</h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
            Our customer care representatives are available 24 hours a day, 7 days a week.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="tel:+18001234567"
              className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md hover:bg-emerald-50 transition-all"
            >
              <Phone size={16} /> Call +1 (800) 123-4567
            </a>
            <a
              href="mailto:support@groceryhub.com"
              className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md text-white font-bold px-5 py-2.5 rounded-xl text-xs border border-white/20 hover:bg-black/30 transition-all"
            >
              <Mail size={16} /> support@groceryhub.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
