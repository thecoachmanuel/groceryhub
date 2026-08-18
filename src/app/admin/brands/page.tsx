'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Tag, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  ShieldCheck, 
  Globe, 
  Mail, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface BrandItem {
  id: number;
  name: string;
  slug: string;
  count: number;
  image: string;
  banner?: string;
  website_url?: string;
  support_email?: string;
  is_certified: boolean;
  is_featured: boolean;
  status: 'Active' | 'Hidden';
}

const INITIAL_BRANDS: BrandItem[] = [
  {
    id: 1,
    name: 'Organic Valley Farms',
    slug: 'organic-valley',
    count: 42,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
    banner: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    website_url: 'https://organicvalley.co',
    support_email: 'partners@organicvalley.co',
    is_certified: true,
    is_featured: true,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Golden Penny Foodstuffs',
    slug: 'golden-penny',
    count: 38,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
    website_url: 'https://goldenpenny.ng',
    support_email: 'sales@goldenpenny.ng',
    is_certified: true,
    is_featured: true,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Dangote Agro Sugar & Mills',
    slug: 'dangote-agro',
    count: 24,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200',
    website_url: 'https://dangote.com',
    support_email: 'contact@dangote.com',
    is_certified: true,
    is_featured: false,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Nestlé Health & Wellness',
    slug: 'nestle',
    count: 56,
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=200',
    website_url: 'https://nestle.com.ng',
    support_email: 'support@nestle.ng',
    is_certified: true,
    is_featured: true,
    status: 'Active',
  },
];

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [banner, setBanner] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [isCertified, setIsCertified] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openCreateModal = () => {
    setEditingBrand(null);
    setName('');
    setSlug('');
    setImage('https://images.unsplash.com/photo-1542838132-92c53300491e?w=200');
    setBanner('');
    setWebsiteUrl('');
    setSupportEmail('');
    setIsCertified(true);
    setIsFeatured(false);
    setShowAddModal(true);
  };

  const openEditModal = (b: BrandItem) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setImage(b.image);
    setBanner(b.banner || '');
    setWebsiteUrl(b.website_url || '');
    setSupportEmail(b.support_email || '');
    setIsCertified(b.is_certified);
    setIsFeatured(b.is_featured);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBrand) {
      setBrands(prev => prev.map(b => b.id === editingBrand.id ? {
        ...b,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image,
        banner,
        website_url: websiteUrl,
        support_email: supportEmail,
        is_certified: isCertified,
        is_featured: isFeatured,
      } : b));
    } else {
      const newBrand: BrandItem = {
        id: Date.now(),
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        count: 0,
        image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
        banner,
        website_url: websiteUrl,
        support_email: supportEmail,
        is_certified: isCertified,
        is_featured: isFeatured,
        status: 'Active',
      };
      setBrands([newBrand, ...brands]);
    }

    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this Brand Partner?')) {
      setBrands(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Hidden' : 'Active' } : b));
  };

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.slug.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Tag size={24} className="text-[#0aad0a]" /> Brand Partners Catalog
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage certified manufacturers, organic labels, brand identity assets, and storefront showcases
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Brand Partner</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-1">
            <span className="text-xs font-bold text-gray-400">Total Brand Partners</span>
            <div className="text-2xl font-black text-white font-mono">{brands.length}</div>
            <span className="text-[11px] text-[#0aad0a] font-semibold">100% verified labels</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-1">
            <span className="text-xs font-bold text-gray-400">Featured on Home Page</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {brands.filter(b => b.is_featured).length}
            </div>
            <span className="text-[11px] text-gray-400 font-semibold">Pinned to customer top scroll</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-1">
            <span className="text-xs font-bold text-gray-400">Total Linked Products</span>
            <div className="text-2xl font-black text-blue-400 font-mono">
              {brands.reduce((sum, b) => sum + b.count, 0)} Items
            </div>
            <span className="text-[11px] text-gray-400 font-semibold">Live in active catalog</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brands by name or slug..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Brand Logo</th>
                  <th className="pb-3 px-3">Brand Name &amp; Slug</th>
                  <th className="pb-3 px-3">Website &amp; Support</th>
                  <th className="pb-3 px-3">Verification Badges</th>
                  <th className="pb-3 px-3">Linked SKUs</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <img 
                        src={b.image} 
                        alt={b.name} 
                        className="w-12 h-12 rounded-2xl object-cover border border-gray-700 bg-gray-900" 
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{b.name}</div>
                      <span className="text-[11px] text-[#0aad0a] font-mono">/{b.slug}</span>
                    </td>
                    <td className="py-3.5 px-3 space-y-0.5">
                      {b.website_url && (
                        <a 
                          href={b.website_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline truncate max-w-xs"
                        >
                          <Globe size={11} /> {b.website_url}
                        </a>
                      )}
                      {b.support_email && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate max-w-xs">
                          <Mail size={11} /> {b.support_email}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 space-x-1.5">
                      {b.is_certified && (
                        <span className="bg-emerald-950/60 text-[#0aad0a] border border-[#0aad0a]/30 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <ShieldCheck size={11} /> Certified
                        </span>
                      )}
                      {b.is_featured && (
                        <span className="bg-amber-950/60 text-amber-300 border border-amber-800/40 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Sparkles size={11} /> Featured
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {b.count} Items
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(b.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          b.status === 'Active'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        ● {b.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit Brand"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                          title="Delete Brand"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black text-white">
                {editingBrand ? 'Edit Brand Partner' : 'Add Brand Partner'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure brand manufacturer credentials, certification status, and catalog placement
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Brand Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingBrand) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Golden Penny Foodstuffs"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Slug Identifier</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. golden-penny"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Brand Logo URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                  {image && (
                    <img src={image} alt="Preview" className="w-11 h-11 rounded-xl object-cover border border-gray-700" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Official Website URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://brand.ng"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Support / Contact Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="contact@brand.ng"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="certCheck"
                    checked={isCertified}
                    onChange={(e) => setIsCertified(e.target.checked)}
                    className="rounded text-[#0aad0a] focus:ring-[#0aad0a] w-4 h-4"
                  />
                  <label htmlFor="certCheck" className="text-xs font-bold text-gray-300 cursor-pointer">
                    Verified Partner
                  </label>
                </div>

                <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featCheck"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-amber-400 focus:ring-amber-400 w-4 h-4"
                  />
                  <label htmlFor="featCheck" className="text-xs font-bold text-gray-300 cursor-pointer">
                    Feature on Home
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingBrand ? 'Save Brand Updates' : 'Add Brand Partner'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
