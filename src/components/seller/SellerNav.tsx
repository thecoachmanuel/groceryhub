'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Store, 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  CreditCard, 
  DollarSign, 
  User, 
  LogOut,
  Barcode,
  Boxes,
  RotateCcw,
  BarChart3,
  Wallet
} from 'lucide-react';

const SELLER_NAV_LINKS = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/seller/products', label: 'Products', icon: Package },
  { href: '/seller/stock', label: 'Inventory', icon: Boxes },
  { href: '/seller/return-requests', label: 'Returns', icon: RotateCcw },
  { href: '/seller/reports', label: 'Reports', icon: BarChart3 },
  { href: '/seller/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/seller/wallet', label: 'Wallet', icon: Wallet },
  { href: '/seller/pos', label: 'POS Terminal', icon: Barcode },
  { href: '/seller/profile', label: 'Profile', icon: User },
];

export default function SellerNav() {
  const pathname = usePathname();

  return (
    <header className="bg-[#1e2632] border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Store Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-gray-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
            <Store size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Green Valley Organic Farms</h2>
            <span className="text-[11px] text-[#0aad0a] font-bold">● Certified Vendor Partner</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          {SELLER_NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={14} />
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
            href="/seller/login"
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
