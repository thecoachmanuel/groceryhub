'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Package, 
  Users, 
  Truck, 
  MapPin, 
  Percent, 
  Sliders, 
  LogOut,
  Store,
  CreditCard,
  Tag,
  Image as ImageIcon,
  Flame,
  LayoutGrid,
  Clock,
  BarChart3,
  Bell,
  RotateCcw,
  Boxes,
  Receipt,
  MessageSquare,
  Mail,
  ShieldCheck,
  DollarSign,
  Building,
  HelpCircle,
  FileText,
  Bookmark,
  Sparkles,
  Star,
  Globe,
  FolderPlus,
  Smartphone,
  Layout
} from 'lucide-react';

interface LinkItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

interface LinkGroup {
  group: string;
  items: LinkItem[];
}

const ADMIN_LINK_GROUPS: LinkGroup[] = [
  {
    group: 'Sales & Operations',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/pos', label: 'POS Terminal', icon: CreditCard, badge: 'Live' },
      { href: '/admin/orders', label: 'Order Management', icon: ShoppingBag },
      { href: '/admin/return-requests', label: 'Return & Refunds', icon: RotateCcw },
      { href: '/admin/reports/ai-insights', label: 'AI Demand Insights', icon: Sparkles, badge: 'AI' },
      { href: '/admin/reports/pos', label: 'POS Sales Report', icon: Receipt },
    ],
  },
  {
    group: 'Catalog & Stock',
    items: [
      { href: '/admin/products', label: 'Product Catalog', icon: Package },
      { href: '/admin/products/request', label: 'Product Approvals', icon: Package, badge: 'New' },
      { href: '/admin/stock', label: 'Stock & Inventory', icon: Boxes },
      { href: '/admin/categories', label: 'Categories', icon: Layers },
      { href: '/admin/group-category', label: 'Group Categories', icon: FolderPlus },
      { href: '/admin/header-category', label: 'Header Categories', icon: Layers },
      { href: '/admin/subcategories', label: 'Subcategories', icon: LayoutGrid },
      { href: '/admin/brands', label: 'Brands', icon: Tag },
      { href: '/admin/tags', label: 'Dietary & Promo Tags', icon: Bookmark },
    ],
  },
  {
    group: 'Storefront & Promotions',
    items: [
      { href: '/admin/home-screens', label: 'App Home Screens', icon: Smartphone },
      { href: '/admin/sections', label: 'Content Sections', icon: Layout },
      { href: '/admin/home-sections', label: 'Home Layout Builder', icon: LayoutGrid, badge: 'Visual' },
      { href: '/admin/banners', label: 'Banners & Ads', icon: ImageIcon },
      { href: '/admin/highlights', label: 'Deal Highlights', icon: Flame },
      { href: '/admin/coupons', label: 'Coupons & Promos', icon: Percent },
      { href: '/admin/notifications', label: 'Push Notifications', icon: Bell },
      { href: '/admin/send-mail', label: 'Broadcast Email', icon: Mail },
      { href: '/admin/faqs', label: 'Knowledge Base FAQs', icon: HelpCircle },
    ],
  },
  {
    group: 'Fleet & Logistics',
    items: [
      { href: '/admin/delivery-boys', label: 'Delivery Fleet', icon: Truck },
      { href: '/admin/delivery-boys/cash-collection', label: 'COD Cash Collections', icon: Receipt },
      { href: '/admin/delivery-boys/fund-transfers', label: 'Courier Payouts', icon: DollarSign },
      { href: '/admin/cities', label: 'Cities & Regions', icon: Building },
      { href: '/admin/areas', label: 'Geofencing & Areas', icon: MapPin },
      { href: '/admin/timeslots', label: 'Delivery Timeslots', icon: Clock },
    ],
  },
  {
    group: 'Vendors & Partners',
    items: [
      { href: '/admin/sellers', label: 'Vendors / Sellers', icon: Store },
      { href: '/admin/sellers/payment-history', label: 'Vendor Settlements', icon: DollarSign },
    ],
  },
  {
    group: 'System & Security',
    items: [
      { href: '/admin/users', label: 'Customer Accounts', icon: Users },
      { href: '/admin/feedback', label: 'Customer Ratings', icon: Star },
      { href: '/admin/system-users', label: 'Staff Roles (RBAC)', icon: ShieldCheck },
      { href: '/admin/languages', label: 'Languages & RTL', icon: Globe },
      { href: '/admin/payment-methods', label: 'Payment Gateways', icon: CreditCard },
      { href: '/admin/sms-gateway', label: 'SMS Gateway & OTP', icon: MessageSquare },
      { href: '/admin/policies', label: 'Policies & Legal', icon: FileText },
      { href: '/admin/reports', label: 'Financial Analytics', icon: BarChart3 },
      { href: '/admin/taxes', label: 'Tax & VAT Rates', icon: Receipt },
      { href: '/admin/store-setting', label: 'Store Operations & Tax', icon: Store },
      { href: '/admin/settings', label: 'System Settings', icon: Sliders },
    ],
  },
];

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header Bar for Admin */}
      <div className="lg:hidden bg-[#1e2632] border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-40 w-full">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-white font-black text-lg">
          <div className="w-8 h-8 rounded-xl bg-[#0aad0a] flex items-center justify-center text-white">
            <ShoppingBag size={18} />
          </div>
          <span>Admin<span className="text-[#0aad0a]">Hub</span></span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-gray-300 hover:bg-gray-800"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Admin Sidebar Container (Responsive) */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1e2632] border-r border-gray-800 min-h-screen flex flex-col justify-between p-4 flex-shrink-0 transform transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between px-3 py-2">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5 text-white font-black text-xl">
              <div className="w-9 h-9 rounded-xl bg-[#0aad0a] flex items-center justify-center text-white shadow-lg shadow-[#0aad0a]/30">
                <ShoppingBag size={20} />
              </div>
              <span>Admin<span className="text-[#0aad0a]">Hub</span></span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400">
              <X size={20} />
            </button>
          </div>

        {/* Navigation Menu by Groups */}
        <nav className="space-y-5 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
          {ADMIN_LINK_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h5 className="px-3 text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
                {group.group}
              </h5>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase ${
                          item.badge === 'AI' 
                            ? 'bg-purple-500 text-white' 
                            : item.badge === 'Live'
                            ? 'bg-amber-400 text-gray-950 animate-pulse'
                            : 'bg-emerald-800 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Storefront / Sign Out */}
      <div className="pt-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-xl transition-colors"
        >
          <span>← Back to Customer Storefront</span>
        </Link>
        <button
          onClick={() => {
            const token = localStorage.getItem('groceryhub_admin_token');
            localStorage.removeItem('groceryhub_admin_token');
            document.cookie = 'auth_token=; path=/; max-age=0';
            document.cookie = 'user_role=; path=/; max-age=0';
            window.location.href = '/admin/login';
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/30 rounded-xl transition-colors text-left"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}
