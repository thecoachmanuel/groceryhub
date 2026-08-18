'use client';

import Link from 'next/link';
import { 
  ShoppingBag, 
  Truck, 
  Leaf, 
  ShieldCheck, 
  Store, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Users, 
  ArrowRight,
  Clock,
  Phone
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820] text-gray-900 dark:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 w-full">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} /> Our Mission &amp; Purpose
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Hyper-Local Groceries, Delivered Fresh from Farm to Table in 30 Mins
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            GroceryHub connects conscious consumers with passionate local organic farmers, artisanal bakeries, and neighborhood specialty markets. We empower local food ecosystems while providing lightning-fast doorstep delivery.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Orders Fulfilled', value: '75,000+', icon: ShoppingBag, color: 'text-[#0aad0a]' },
            { label: 'Organic Farm Partners', value: '140+', icon: Leaf, color: 'text-emerald-400' },
            { label: 'Avg Delivery Speed', value: '28 Mins', icon: Clock, color: 'text-amber-400' },
            { label: 'Happy Customers', value: '99.4%', icon: HeartHandshake, color: 'text-blue-400' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 text-center space-y-2 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Why We Built GroceryHub
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Conventional grocery delivery relies on centralized warehouses and long haul transport, meaning your fresh fruits and greens spend days sitting in trucks and storage depots before reaching your kitchen.
              </p>
              <p>
                We re-engineered grocery commerce from the ground up: when you place an order on GroceryHub, our system routes your basket to the closest local farms and partner neighborhood grocers within your geofenced zone.
              </p>
              <p>
                Our electric fleet couriers pick up items freshly packed and bring them directly to your door in under 30 minutes, preserving peak nutrient density and flavor.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/sellers"
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <span>Browse Local Partner Stores</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white font-bold px-6 py-3.5 rounded-2xl text-xs transition-colors hover:border-gray-400"
              >
                Contact Support
              </Link>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80" 
              alt="GroceryHub Fresh Produce"
              className="rounded-3xl object-cover shadow-2xl border border-gray-200 dark:border-gray-700 aspect-4/3 w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-700 p-5 rounded-3xl shadow-xl flex items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#0aad0a] text-white flex items-center justify-center shrink-0 font-bold">
                <Leaf size={24} />
              </div>
              <div className="text-xs">
                <div className="font-black text-gray-900 dark:text-white">100% Certified Organic</div>
                <div className="text-gray-500 dark:text-gray-400 text-[11px]">Strict pesticide-free audits</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Our Core Commitments
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              The values guiding every grocery order delivered to your home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Peak Freshness Guarantee',
                desc: 'If any produce or dairy item fails to meet your highest standards, report it in one click on your order history for an instant refund.',
                icon: ShieldCheck,
                color: 'text-[#0aad0a]'
              },
              {
                title: 'Fair Pay for Farmers & Drivers',
                desc: 'Our transparent 5% platform fee model leaves 95% of proceeds in the hands of growers and provides drivers with per-trip bonuses.',
                icon: HeartHandshake,
                color: 'text-amber-400'
              },
              {
                title: 'Eco-Friendly Electric Fleet',
                desc: 'Over 80% of our inner-city deliveries are completed using zero-emission electric cargo bikes and smart scooters.',
                icon: Truck,
                color: 'text-blue-400'
              }
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 space-y-3 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${pillar.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-black text-base text-gray-900 dark:text-white">{pillar.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partner with us CTA */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Grow Your Food Business with GroceryHub</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Are you a local farmer, artisanal food producer, or courier driver? Join our fast-growing partner network today.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/seller/register"
              className="bg-white hover:bg-gray-100 text-gray-950 font-black px-6 py-3 rounded-2xl text-xs transition-all active:scale-95"
            >
              Register as Seller
            </Link>
            <Link
              href="/delivery/register"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-2xl text-xs transition-all active:scale-95"
            >
              Become a Courier
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
