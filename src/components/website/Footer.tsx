'use client';

import Link from 'next/link';
import { ShoppingBag, Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Headphones, Bell } from 'lucide-react';
import { useSystemSettings } from '@/context/SystemSettingsContext';

export default function Footer() {
  const { settings } = useSystemSettings();

  return (
    <footer className="bg-white dark:bg-[#1e2632] border-t border-gray-100 dark:border-gray-800 transition-colors mt-20">
      
      {/* Features Bar */}
      <div className="border-b border-gray-100 dark:border-gray-800 py-10 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center flex-shrink-0">
                <Truck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Fast & Free Delivery</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Free delivery for orders over ₦15,000</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">100% Secure Checkout</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Paystack, Nigerian Cards, USSD & COD</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center flex-shrink-0">
                <RefreshCw size={28} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Easy Returns & Refunds</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Hassle-free digital wallet refunds</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center flex-shrink-0">
                <Headphones size={28} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">24/7 Dedicated Support</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Instant phone & live chat</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-white">
              {settings.storeLogoUrl ? (
                <img src={settings.storeLogoUrl} alt={settings.appName} className="h-10 w-auto object-contain rounded-lg" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#0aad0a] flex items-center justify-center text-white shadow-md shadow-[#0aad0a]/30">
                  <ShoppingBag size={22} className="stroke-[2.5]" />
                </div>
              )}
              <span>{settings.appName || 'GroceryHub'}</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              {settings.appDescription || 'Your one-stop destination for fresh farm produce, organic groceries, dairy, bakery, and everyday pantry essentials delivered right to your doorstep.'}
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#0aad0a] flex-shrink-0" />
                <span>{settings.address || 'Plot 14, Adeola Odeku St, Victoria Island, Lagos, Nigeria'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#0aad0a] flex-shrink-0" />
                <span>{settings.supportPhone || '+234 (800) 123-4567'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#0aad0a] flex-shrink-0" />
                <span>{settings.supportEmail || 'support@groceryhub.ng'}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/category/vegetables" className="hover:text-[#0aad0a] transition-colors">Fresh Vegetables</Link></li>
              <li><Link href="/category/fruits" className="hover:text-[#0aad0a] transition-colors">Organic Fruits</Link></li>
              <li><Link href="/category/dairy" className="hover:text-[#0aad0a] transition-colors">Dairy & Eggs</Link></li>
              <li><Link href="/category/bakery" className="hover:text-[#0aad0a] transition-colors">Bakery & Breads</Link></li>
              <li><Link href="/category/beverages" className="hover:text-[#0aad0a] transition-colors">Cold Drinks & Juices</Link></li>
              <li><Link href="/brands" className="hover:text-[#0aad0a] transition-colors font-bold text-[#0aad0a]">Shop by Brands</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/wallet" className="hover:text-[#0aad0a] transition-colors font-semibold">My Digital Wallet</Link></li>
              <li><Link href="/profile" className="hover:text-[#0aad0a] transition-colors">Saved Addresses</Link></li>
              <li><Link href="/order-history" className="hover:text-[#0aad0a] transition-colors">Order Tracking</Link></li>
              <li><Link href="/service-area-notify" className="hover:text-[#0aad0a] transition-colors text-amber-500 font-semibold flex items-center gap-1"><Bell size={13} /> Expanding Cities</Link></li>
              <li><Link href="/contact" className="hover:text-[#0aad0a] transition-colors">Contact Us & Support</Link></li>
              <li><Link href="/faq" className="hover:text-[#0aad0a] transition-colors">Help Center & FAQ</Link></li>
              <li><Link href="/delivery-policy" className="hover:text-[#0aad0a] transition-colors">Courier Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#0aad0a] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#0aad0a] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Portals & Apps */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Partner with Us
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/delivery/login" className="text-amber-400 font-bold hover:underline flex items-center gap-1.5"><Truck size={14} /> Courier / Rider App</Link></li>
              <li><Link href="/seller/login" className="text-[#0aad0a] font-semibold hover:underline">Seller / Vendor Portal</Link></li>
              <li><Link href="/seller/pos" className="hover:text-[#0aad0a] transition-colors">In-Store POS Terminal</Link></li>
              <li><Link href="/admin/login" className="hover:text-[#0aad0a] transition-colors">Super Admin Dashboard</Link></li>
              <li><Link href="/sellers" className="hover:text-[#0aad0a] transition-colors">Certified Local Vendors</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} {settings.appName || 'GroceryHub'} Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Next.js 14 & Cloudinary</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
