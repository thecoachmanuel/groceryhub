'use client';

import Link from 'next/link';
import { 
  Truck, 
  ShoppingBag, 
  DollarSign, 
  MapPin, 
  Phone, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Star,
  Navigation,
  ExternalLink
} from 'lucide-react';
import DeliveryNav from '@/components/delivery/DeliveryNav';

export default function DeliveryDashboardPage() {
  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <DeliveryNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Today&apos;s Deliveries</span>
              <h3 className="text-2xl font-black text-white">8 Completed</h3>
              <p className="text-[11px] text-[#0aad0a] font-semibold flex items-center gap-1">
                <ArrowUpRight size={14} /> 2 active runs in progress
              </p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Today&apos;s Trip Earnings</span>
              <h3 className="text-2xl font-black text-[#0aad0a]">$64.50</h3>
              <p className="text-[11px] text-gray-400">+$12.00 peak surge incentive</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Cash in Hand (COD to Remit)</span>
              <h3 className="text-2xl font-black text-amber-400">$103.50</h3>
              <Link href="/delivery/earnings" className="text-[11px] text-amber-300 font-bold hover:underline block">
                Deposit to Store Counter →
              </Link>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-gray-400 font-bold">Courier Rating</span>
              <h3 className="text-2xl font-black text-white flex items-center gap-1.5">
                4.95 <Star size={18} className="text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-[11px] text-gray-400">342 lifetime runs</p>
            </div>
          </div>

          {/* Active Run Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-[#0aad0a]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#0aad0a] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    Current Active Delivery
                  </span>
                  <span className="text-xs font-mono font-bold text-white">#ORD-98241</span>
                </div>
                <h3 className="text-xl font-black text-white">Alex Johnson (Apt 4B)</h3>
                <p className="text-xs text-gray-300 flex items-center gap-1">
                  <MapPin size={14} className="text-[#0aad0a]" /> 124 Market Square, Downtown Zone (1.2 km away)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="tel:+15559876543"
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Phone size={14} /> Call Customer
                </a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                >
                  <Navigation size={14} /> Open GPS Navigation
                </a>
              </div>
            </div>

            <div className="bg-gray-900/80 rounded-2xl p-4 border border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-semibold">Store Pickup</span>
                <strong className="text-white">Green Valley Organic Farms</strong>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold">Order Items</span>
                <strong className="text-white">4 items (Organic Broccoli, Apples, Milk)</strong>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold">Payment Mode</span>
                <strong className="text-[#0aad0a]">Online Paid ($45.00)</strong>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/delivery/orders"
                className="bg-white text-gray-900 hover:bg-gray-100 font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle2 size={16} className="text-[#0aad0a]" />
                <span>Mark Delivered & Verify OTP</span>
              </Link>
            </div>
          </div>

          {/* Assigned Runs Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">Today&apos;s Run Manifest</h3>
                <p className="text-xs text-gray-400">Assigned customer grocery drop-offs and completed deliveries</p>
              </div>
              <Link href="/delivery/orders" className="text-xs font-bold text-[#0aad0a] hover:underline">
                View All Deliveries →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Order</th>
                    <th className="pb-3 px-3">Customer & Address</th>
                    <th className="pb-3 px-3">Pickup Store</th>
                    <th className="pb-3 px-3">Payment</th>
                    <th className="pb-3 px-3">Rider Fee</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {[
                    { id: 'ORD-98241', customer: 'Alex Johnson', addr: '124 Market Square', store: 'Green Valley Farms', pay: 'Online ($45.00)', fee: '$4.50', status: 'Out for Delivery', color: 'text-amber-400 bg-amber-950/40' },
                    { id: 'ORD-98240', customer: 'Michael Scott', addr: '1725 Slough Ave', store: 'Daily Dairy Fresh', pay: 'COD ($28.50)', fee: '$3.50', status: 'Assigned', color: 'text-blue-400 bg-blue-950/40' },
                    { id: 'ORD-98235', customer: 'Emma Davis', addr: '820 5th Avenue', store: 'Artisanal Bakery', pay: 'Online ($62.10)', fee: '$5.50', status: 'Delivered', color: 'text-[#0aad0a] bg-emerald-950/40' },
                  ].map((r) => (
                    <tr key={r.id} className="hover:bg-gray-800/40">
                      <td className="py-3.5 px-3 font-bold text-white">{r.id}</td>
                      <td className="py-3.5 px-3">
                        <span className="text-white block font-semibold">{r.customer}</span>
                        <span className="text-gray-400 text-[11px]">{r.addr}</span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-300">{r.store}</td>
                      <td className="py-3.5 px-3 font-bold text-white">{r.pay}</td>
                      <td className="py-3.5 px-3 font-black text-[#0aad0a]">+{r.fee}</td>
                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${r.color}`}>
                          ● {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
