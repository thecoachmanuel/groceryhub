'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Truck, 
  LayoutDashboard, 
  ShoppingBag, 
  DollarSign, 
  User, 
  LogOut,
  Power
} from 'lucide-react';
import { useState } from 'react';

const DELIVERY_NAV_LINKS = [
  { href: '/delivery/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/delivery/orders', label: 'Active Runs', icon: ShoppingBag },
  { href: '/delivery/earnings', label: 'Earnings & COD', icon: DollarSign },
  { href: '/delivery/profile', label: 'Courier Profile', icon: User },
];

export default function DeliveryNav() {
  const pathname = usePathname();
  const [isOnDuty, setIsOnDuty] = useState(true);

  return (
    <header className="bg-[#1e2632] border-b border-gray-800 px-6 py-3.5 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Duty Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0aad0a] text-white flex items-center justify-center font-black shadow-md shadow-[#0aad0a]/30">
            <Truck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">Marcus Vance</h2>
              <button
                onClick={() => setIsOnDuty(!isOnDuty)}
                className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  isOnDuty
                    ? 'bg-emerald-950/80 text-[#0aad0a] border border-[#0aad0a]/40 shadow-sm'
                    : 'bg-red-950/80 text-red-400 border border-red-900/40'
                }`}
              >
                <Power size={10} />
                <span>{isOnDuty ? 'ON DUTY' : 'OFFLINE'}</span>
              </button>
            </div>
            <span className="text-[11px] text-gray-400">Courier ID: DRV-804 • Scooter (NY-4921)</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          {DELIVERY_NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={15} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Storefront Link & Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors hidden sm:block"
          >
            ← Storefront
          </Link>
          <Link
            href="/delivery/login"
            className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
