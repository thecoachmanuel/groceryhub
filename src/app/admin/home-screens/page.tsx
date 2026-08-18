'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Palette, 
  Layout, 
  MapPin,
  Star,
  Eye,
  Sliders
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface HomeScreenItem {
  id: number;
  screen_name: string;
  city_name: string;
  header_type: 'gradient' | 'gif' | 'image';
  gradient_start: string;
  gradient_end: string;
  header_gif?: string;
  is_default: boolean;
  status: 'Active' | 'Hidden';
  active_sections: number;
}

const INITIAL_SCREENS: HomeScreenItem[] = [
  {
    id: 1,
    screen_name: 'Metro Default Home Layout',
    city_name: 'All Cities (Global Default)',
    header_type: 'gradient',
    gradient_start: '#0aad0a',
    gradient_end: '#088f08',
    is_default: true,
    status: 'Active',
    active_sections: 8
  },
  {
    id: 2,
    screen_name: 'New York City Express Flash',
    city_name: 'New York',
    header_type: 'gradient',
    gradient_start: '#1e3c72',
    gradient_end: '#2a5298',
    is_default: false,
    status: 'Active',
    active_sections: 6
  },
  {
    id: 3,
    screen_name: 'Summer Splash Festival Promo',
    city_name: 'Los Angeles',
    header_type: 'gif',
    gradient_start: '#f857a6',
    gradient_end: '#ff5858',
    header_gif: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=300&auto=format&fit=crop&q=60',
    is_default: false,
    status: 'Active',
    active_sections: 5
  }
];

export default function AdminHomeScreensPage() {
  const [screens, setScreens] = useState<HomeScreenItem[]>(INITIAL_SCREENS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<HomeScreenItem | null>(null);

  // Form
  const [screenName, setScreenName] = useState('');
  const [cityName, setCityName] = useState('All Cities (Global Default)');
  const [headerType, setHeaderType] = useState<'gradient' | 'gif' | 'image'>('gradient');
  const [gradientStart, setGradientStart] = useState('#0aad0a');
  const [gradientEnd, setGradientEnd] = useState('#088f08');
  const [headerGif, setHeaderGif] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [status, setStatus] = useState<'Active' | 'Hidden'>('Active');

  const openCreateModal = () => {
    setEditingScreen(null);
    setScreenName('');
    setCityName('All Cities (Global Default)');
    setHeaderType('gradient');
    setGradientStart('#0aad0a');
    setGradientEnd('#088f08');
    setHeaderGif('');
    setIsDefault(screens.length === 0);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (s: HomeScreenItem) => {
    setEditingScreen(s);
    setScreenName(s.screen_name);
    setCityName(s.city_name);
    setHeaderType(s.header_type);
    setGradientStart(s.gradient_start);
    setGradientEnd(s.gradient_end);
    setHeaderGif(s.header_gif || '');
    setIsDefault(s.is_default);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenName.trim()) return alert('Screen layout name is required');

    if (editingScreen) {
      setScreens(prev => prev.map(s => {
        if (s.id === editingScreen.id) {
          return {
            ...s,
            screen_name: screenName,
            city_name: cityName,
            header_type: headerType,
            gradient_start: gradientStart,
            gradient_end: gradientEnd,
            header_gif: headerGif.trim() || undefined,
            is_default: isDefault,
            status
          };
        }
        if (isDefault) {
          return { ...s, is_default: false };
        }
        return s;
      }));
    } else {
      const newScreen: HomeScreenItem = {
        id: Date.now(),
        screen_name: screenName,
        city_name: cityName,
        header_type: headerType,
        gradient_start: gradientStart,
        gradient_end: gradientEnd,
        header_gif: headerGif.trim() || undefined,
        is_default: isDefault,
        status,
        active_sections: 4
      };
      setScreens(prev => isDefault ? [newScreen, ...prev.map(s => ({ ...s, is_default: false }))] : [...prev, newScreen]);
    }
    setIsModalOpen(false);
  };

  const handleMakeDefault = (id: number) => {
    setScreens(prev => prev.map(s => ({ ...s, is_default: s.id === id })));
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this Home Screen configuration?')) {
      setScreens(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setScreens(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Hidden' : 'Active' } : s));
  };

  const filtered = screens.filter(s => 
    s.screen_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.city_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Smartphone size={24} className="text-[#0aad0a]" /> Mobile App Home Screens
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Design and manage customized home screen themes, top gradient headers, and localized feed layouts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/sections"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-colors"
            >
              <Layout size={14} /> Manage Content Sections
            </Link>
            <button
              onClick={openCreateModal}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Create Screen Theme</span>
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/home-screens" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <Smartphone size={13} /> Home Screen Themes ({screens.length})
          </Link>
          <Link href="/admin/sections" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Content Sections
          </Link>
          <Link href="/admin/home-sections" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Home Section Builder
          </Link>
        </div>

        {/* Grid Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {screens.map(s => (
            <div 
              key={s.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between space-y-4 relative transition-all ${
                s.is_default 
                  ? 'bg-[#1e2632] border-[#0aad0a]/60 shadow-lg shadow-[#0aad0a]/10' 
                  : 'bg-[#1e2632] border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Header Visual Preview */}
              <div 
                className="h-28 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden shadow-inner"
                style={{
                  background: s.header_type === 'gradient' 
                    ? `linear-gradient(135deg, ${s.gradient_start}, ${s.gradient_end})` 
                    : undefined
                }}
              >
                {s.header_type === 'gif' && s.header_gif && (
                  <img src={s.header_gif} alt="Header gif" className="absolute inset-0 w-full h-full object-cover" />
                )}
                
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white">
                    {s.header_type}
                  </span>
                  {s.is_default ? (
                    <span className="bg-amber-400 text-gray-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Star size={10} fill="currentColor" /> Default Screen
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleMakeDefault(s.id)}
                      className="bg-black/40 hover:bg-black/60 text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="relative z-10 text-white font-bold text-xs truncate drop-shadow">
                  {s.city_name}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1.5">
                <div className="font-black text-white text-base">{s.screen_name}</div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#0aad0a]" /> {s.city_name}
                  </span>
                  <span className="font-mono text-gray-300">
                    {s.active_sections} Content Sections
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <button
                  onClick={() => handleToggleStatus(s.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    s.status === 'Active'
                      ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  ● {s.status}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                    title="Edit Theme"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                    title="Delete Screen"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">
                {editingScreen ? 'Edit Home Screen Theme' : 'Create Home Screen Theme'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure top bar palette styling, city target assignment, and default mobile layout
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Screen Layout Name</label>
                <input
                  type="text"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  placeholder="e.g. Metro Holiday Festival Theme"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Target Region / City</label>
                <select
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="All Cities (Global Default)">All Cities (Global Default)</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Houston">Houston</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Header Styling Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['gradient', 'gif', 'image'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setHeaderType(t)}
                      className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                        headerType === t
                          ? 'border-[#0aad0a] bg-[#0aad0a]/10 text-[#0aad0a]'
                          : 'border-gray-700 bg-gray-900 text-gray-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {headerType === 'gradient' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Gradient Start Hex</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="w-10 h-10 rounded-xl bg-transparent border border-gray-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-3 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Gradient End Hex</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="w-10 h-10 rounded-xl bg-transparent border border-gray-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-3 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">{headerType.toUpperCase()} Banner URL</label>
                  <input
                    type="url"
                    value={headerGif}
                    onChange={(e) => setHeaderGif(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800">
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-[#0aad0a] focus:ring-[#0aad0a] w-4 h-4"
                />
                <label htmlFor="defaultCheck" className="text-xs font-bold text-gray-300 cursor-pointer">
                  Set as Global Default Screen for All Customers
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingScreen ? 'Save Theme Settings' : 'Create Home Screen'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
