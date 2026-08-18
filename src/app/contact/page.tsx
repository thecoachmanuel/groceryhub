'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowLeft, MessageSquare } from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
        <div className="space-y-2">
          <Link href="/" className="text-xs font-bold text-gray-500 hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={28} className="text-[#0aad0a]" /> Customer Support & Contact
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Have questions about an order or want to become a certified vendor? Reach our 24/7 team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details & Info Cards */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center">
                <Phone size={20} />
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Phone Support</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">+1 (800) 123-4567</p>
              <span className="text-[11px] text-[#0aad0a] font-bold">Mon - Sun (8:00 AM - 10:00 PM)</span>
            </div>

            <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center">
                <Mail size={20} />
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Email Inquiries</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">support@groceryhub.com</p>
              <span className="text-[11px] text-gray-400">Average response time: &lt; 15 mins</span>
            </div>

            <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Headquarters</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                124 Market Square, Downtown Zone, New York, NY 10001
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1e2632] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Send Us a Direct Message</h3>

            {sentSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={18} /> Thank you! Your support ticket has been received. Our team will contact you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding Order #ORD-98241"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Your Message</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-8 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Send size={15} />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
