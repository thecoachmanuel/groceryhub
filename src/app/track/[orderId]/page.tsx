'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  Package, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

export default function TrackOrderPage({ params }: { params: { orderId?: string } }) {
  const orderId = params?.orderId || 'ORD-98240';

  const [deliveryOtp] = useState('4892');
  const [etaMinutes] = useState(12);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121820] text-gray-900 dark:text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/order-history"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0aad0a] transition-colors"
          >
            <ArrowLeft size={14} /> Back to My Orders
          </Link>
          <span className="text-xs font-mono font-bold text-gray-400">Tracking: {orderId}</span>
        </div>

        {/* Live Delivery Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
              <Clock size={14} className="animate-spin" /> Arriving in ~{etaMinutes} Minutes
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Express Delivery in Progress</h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg leading-relaxed">
              Your courier has picked up your organic groceries from <strong>Green Valley Farms</strong> and is en route to your doorstep.
            </p>
          </div>

          {/* 4-Digit Handover Security PIN */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center flex-shrink-0 space-y-1">
            <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider block">
              Delivery Handover PIN
            </span>
            <span className="font-mono text-3xl font-black tracking-widest text-amber-300 block">
              {deliveryOtp}
            </span>
            <span className="text-[10px] text-emerald-200 block">Share with courier at door</span>
          </div>
        </div>

        {/* Progress Pipeline Stepper */}
        <div className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="grid grid-cols-4 text-center relative">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#0aad0a] text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white block">Order Placed</span>
              <span className="text-[10px] text-gray-400 block">14:10</span>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#0aad0a] text-white flex items-center justify-center mx-auto shadow-md">
                <Package size={20} />
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white block">Packed by Store</span>
              <span className="text-[10px] text-gray-400 block">14:18</span>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#0aad0a] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0aad0a]/40 animate-pulse">
                <Truck size={20} />
              </div>
              <span className="text-xs font-black text-[#0aad0a] block">Out for Delivery</span>
              <span className="text-[10px] text-[#0aad0a] font-bold block">Active Transit</span>
            </div>

            <div className="space-y-2 opacity-50">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto">
                <MapPin size={20} />
              </div>
              <span className="text-xs font-bold text-gray-500 block">Delivered</span>
              <span className="text-[10px] text-gray-400 block">Pending PIN</span>
            </div>
          </div>
        </div>

        {/* Courier Details Card & Map Simulation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Assigned Driver Card */}
          <div className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Assigned Delivery Partner
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md">
                  MA
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Marcus Allen</h4>
                  <span className="text-xs text-[#0aad0a] font-semibold flex items-center gap-1">
                    ★ 4.98 Rating • 1,240 deliveries
                  </span>
                </div>
              </div>

              <a
                href="tel:+15551234567"
                className="p-3 bg-[#0aad0a] hover:bg-[#088f08] text-white rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
              >
                <Phone size={16} />
                <span>Call</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-gray-400 block">Vehicle Model</span>
                <span className="font-bold text-gray-900 dark:text-white">Honda Activa EV</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-gray-400 block">License Plate</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">NY-592-GK</span>
              </div>
            </div>
          </div>

          {/* Delivery Address & Map Pin */}
          <div className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Drop-off Destination
            </h3>

            <div className="flex items-start gap-3 text-xs">
              <MapPin size={18} className="text-[#0aad0a] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">Home Address</span>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                  742 Evergreen Terrace, Apt 4B, Downtown Zone, New York, NY 10001
                </p>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Delivery Instruction: "Please ring buzzer 4B and leave on porch"
                </span>
              </div>
            </div>

            <div className="h-28 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 flex items-center justify-center text-center p-4 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0aad0a]">
                <Truck size={20} className="animate-bounce" />
                <span>Courier is 0.8 miles away from your location</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
