'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  User, 
  Heart, 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Clock, 
  Wallet, 
  Tag, 
  Store,
  Sparkles,
  Globe,
  LogOut,
  PackageCheck
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { formatNaira } from '@/lib/currency';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSystemSettings } from '@/context/SystemSettingsContext';

import LocationSelectorModal from './LocationSelectorModal';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Header({ cartCount, onOpenCart }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount: globalCartCount } = useCart();
  const { settings } = useSystemSettings();
  const effectiveCartCount = cartCount !== undefined ? cartCount : globalCartCount;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Select Location');
  const [citiesList, setCitiesList] = useState<{ id?: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState('en');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('/api/admin/cities');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCitiesList(json.data.map((c: any) => ({ name: c.name || c.title || 'City' })));
        } else {
          setCitiesList([
            { name: 'Ikeja & Victoria Island' },
            { name: 'Abuja FCT' },
            { name: 'Port Harcourt' },
            { name: 'Ibadan' },
          ]);
        }
      } catch (err) {
        setCitiesList([
          { name: 'Ikeja & Victoria Island' },
          { name: 'Abuja FCT' },
          { name: 'Port Harcourt' },
          { name: 'Ibadan' },
        ]);
      }
    }
    fetchCities();

    if (typeof window !== 'undefined') {
      const savedLoc = localStorage.getItem('gh_selected_location');
      if (savedLoc) {
        setSelectedCity(savedLoc);
      } else {
        // Auto-prompt location modal on first visit
        setIsLocationModalOpen(true);
      }

      // Auto-detect real GPS location if permission granted
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              const res = await fetch('/api/v1_6/customer/fetchDeliverableAreaByLatLong', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latitude, longitude }),
              });
              const json = await res.json();
              if (json.status === 'success' && json.data) {
                const detected = `${json.data.name || 'Current Area'}, ${json.data.city || 'Hub'}`;
                setSelectedCity(detected);
                localStorage.setItem('gh_selected_location', detected);
              }
            } catch (err) {}
          },
          () => {},
          { timeout: 8000, enableHighAccuracy: true }
        );
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    if (typeof document !== 'undefined') {
      if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lang;
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#1e2632] border-b border-gray-200 dark:border-gray-800 transition-colors shadow-sm">
      {/* Platform Maintenance Banner */}
      {settings.maintenanceMode && (
        <div className="bg-red-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2 shadow-md">
          <span>⚠️ PLATFORM MAINTENANCE LOCKDOWN ACTIVE — Admin is updating backend database indexes. Checkout is temporarily paused.</span>
        </div>
      )}

      {/* Top Notification Bar */}
      <div className="bg-[#0aad0a] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={14} /> {settings.supportPhone}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {settings.announcementText || 'Express Delivery in 30 Mins'}
            </span>
            {/* Multi-Language Switcher */}
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-[11px] font-bold">
              <Globe size={12} />
              <select
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer text-[11px]"
              >
                <option value="en" className="text-gray-900">EN (English)</option>
                <option value="ar" className="text-gray-900">AR (العربية - RTL)</option>
                <option value="es" className="text-gray-900">ES (Español)</option>
                <option value="fr" className="text-gray-900">FR (Français)</option>
                <option value="hi" className="text-gray-900">HI (हिन्दी)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/nutriguide" className="hover:underline font-bold flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded">
              <Sparkles size={13} /> NutriGuide AI
            </Link>
            <Link href="/brands" className="hover:underline">Brands</Link>
            <Link href="/sellers" className="hover:underline">Local Stores</Link>
            <Link href="/faq" className="hover:underline">Help & FAQs</Link>
            <Link href="/contact" className="hover:underline">Contact Support</Link>
            <Link href="/seller/login" className="hover:underline font-bold bg-black/20 px-2 py-0.5 rounded">Sell on GroceryHub</Link>
            <Link href="/delivery/login" className="hover:underline font-bold text-amber-200">Courier App</Link>
            <Link href="/admin/login" className="hover:underline font-bold opacity-80">Admin</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {settings.storeLogoUrl ? (
                <img src={settings.storeLogoUrl} alt={settings.appName} className="h-10 w-auto object-contain rounded-lg" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#0aad0a] flex items-center justify-center text-white shadow-md shadow-[#0aad0a]/30">
                  <ShoppingBag size={22} className="stroke-[2.5]" />
                </div>
              )}
              <span>{settings.appName || 'GroceryHub'}</span>
            </Link>

            {/* City Location Picker Modal Button */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3.5 py-2 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            >
              <MapPin size={15} className="text-[#0aad0a]" />
              <span className="max-w-[150px] truncate">{selectedCity}</span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form action="/search" method="GET" className="relative w-full">
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh vegetables, organic fruits, bakery..."
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#0aad0a] dark:text-white transition-all shadow-inner"
              />
              <Search size={18} className="absolute left-4 top-3 text-gray-400" />
            </form>
          </div>

          {/* Actions & Account */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Digital Wallet Link */}
            {isAuthenticated && (
              <Link
                href="/wallet"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-[#0aad0a] dark:hover:text-[#0aad0a] bg-gray-100 dark:bg-gray-800 px-3.5 py-2 rounded-full transition-colors"
              >
                <Wallet size={15} className="text-[#0aad0a]" />
                <span>Wallet ({formatNaira(user?.walletBalance ?? 12500)})</span>
              </Link>
            )}

            {/* User Account / Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0aad0a] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-gray-800 dark:text-gray-200">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={14} className="hidden sm:inline text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2 space-y-1 text-xs z-50 animate-scale-up">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="font-bold text-gray-900 dark:text-white block truncate">{user?.name}</span>
                      <span className="text-[11px] text-gray-400 block truncate">{user?.email || user?.mobile}</span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                    >
                      <User size={15} /> My Profile & Addresses
                    </Link>

                    <Link
                      href="/order-history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                    >
                      <PackageCheck size={15} /> My Orders
                    </Link>

                    <Link
                      href="/wallet"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                    >
                      <Wallet size={15} /> Digital Wallet ({formatNaira(user?.walletBalance ?? 0)})
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-left transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-bold p-2 sm:px-4 sm:py-2 rounded-full transition-all shadow-md shadow-[#0aad0a]/20"
                title="Sign In"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={14} />
                </div>
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088f08] text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-md shadow-[#0aad0a]/30 transition-all transform active:scale-95"
            >
              <div className="relative">
                <ShoppingBag size={18} />
                {effectiveCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {effectiveCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">Cart</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form action="/search" method="GET" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search products..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#0aad0a] dark:text-white"
            />
            <Search size={16} className="absolute left-3.5 top-2.5 text-gray-400" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1e2632] border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3 animate-fade-in">
          {isAuthenticated ? (
            <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-gray-900 dark:text-white block">{user?.name}</span>
                <span className="text-[11px] text-[#0aad0a] font-semibold">Wallet: {formatNaira(user?.walletBalance ?? 0)}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-xs text-red-500 font-bold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pb-2">
              <Link
                href="/login"
                className="flex-1 text-center bg-[#0aad0a] text-white py-2 rounded-xl text-xs font-bold"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-2 rounded-xl text-xs font-bold"
              >
                Register
              </Link>
            </div>
          )}

          <Link href="/nutriguide" className="block py-2 text-sm font-bold text-[#0aad0a] flex items-center gap-1.5">
            <Sparkles size={16} /> NutriGuide AI Assistant
          </Link>
          <Link href="/category" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            All Categories
          </Link>
          <Link href="/popular-products" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Popular Deals
          </Link>
          <Link href="/brands" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Shop by Brands
          </Link>
          <Link href="/sellers" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Local Vendor Stores
          </Link>
          <Link href="/wallet" className="block py-2 text-sm font-semibold text-[#0aad0a]">
            My Digital Wallet
          </Link>
          <Link href="/profile" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            My Account & Addresses
          </Link>
          <Link href="/order-history" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            My Orders
          </Link>
          <Link href="/service-area-notify" className="block py-2 text-sm font-medium text-amber-400">
            Expanding Cities
          </Link>
          <Link href="/delivery/login" className="block py-2 text-sm font-semibold text-amber-400">
            Courier / Rider App
          </Link>
          <Link href="/seller/login" className="block py-2 text-sm font-semibold text-emerald-400">
            Seller Portal
          </Link>
          <Link href="/admin/login" className="block py-2 text-sm font-semibold text-gray-400">
            Admin Panel
          </Link>
        </div>
      )}

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedCity}
        onSelectLocation={(locationName) => {
          setSelectedCity(locationName);
          if (typeof window !== 'undefined') {
            localStorage.setItem('gh_selected_location', locationName);
          }
        }}
      />
    </header>
  );
}
