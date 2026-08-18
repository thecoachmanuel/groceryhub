'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus, Search, Trash2, Edit3, X, ExternalLink } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LocalImageUploader from '@/components/common/LocalImageUploader';

interface AdminBanner {
  id: number;
  title: string;
  placement: string;
  targetType: string;
  targetValue: string;
  image: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_BANNERS: AdminBanner[] = [
  { id: 1, title: 'Mega Savings Festival Banner', placement: 'Header Banner', targetType: 'Category', targetValue: 'vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', status: 'Active' },
  { id: 2, title: 'Deal of the Day: Organic Fruits 30% OFF', placement: 'Deal of Day', targetType: 'Category', targetValue: 'fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600', status: 'Active' },
  { id: 3, title: 'Pure Farm Milk & Cheeses Special', placement: 'Home Section', targetType: 'Category', targetValue: 'dairy', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600', status: 'Active' },
  { id: 4, title: 'Artisan Bakery Morning Treat', placement: 'Footer Banner', targetType: 'Category', targetValue: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', status: 'Active' },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AdminBanner[]>(INITIAL_BANNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);

  const [title, setTitle] = useState('');
  const [placement, setPlacement] = useState('Header Banner');
  const [targetType, setTargetType] = useState('Category');
  const [targetValue, setTargetValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setPlacement('Header Banner');
    setTargetType('Category');
    setTargetValue('');
    setImageUrl('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (b: AdminBanner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setPlacement(b.placement);
    setTargetType(b.targetType);
    setTargetValue(b.targetValue);
    setImageUrl(b.image);
    setStatus(b.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Banner title is required');

    const defaultImg = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';
    const finalImage = imageUrl || defaultImg;

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
                ...b,
                title,
                placement,
                targetType,
                targetValue,
                image: finalImage,
                status,
              }
            : b
        )
      );
    } else {
      const newBanner: AdminBanner = {
        id: Date.now(),
        title,
        placement,
        targetType,
        targetValue,
        image: finalImage,
        status,
      };
      setBanners([newBanner, ...banners]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this promotional banner?')) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: b.status === 'Active' ? 'Inactive' : 'Active',
            }
          : b
      )
    );
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <ImageIcon size={24} className="text-[#0aad0a]" /> Banner & Ads Management
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Control promotional header slides, deal banners, and storefront advertising</p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Upload New Banner</span>
          </button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-[#1e2632] border border-gray-800 rounded-3xl p-5 space-y-4 hover:border-[#0aad0a]/40 transition-all group"
            >
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700">
                <Image src={b.image} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-full text-white uppercase">
                  {b.placement}
                </span>
                <button
                  onClick={() => handleToggleStatus(b.id)}
                  className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                    b.status === 'Active'
                      ? 'bg-emerald-950/90 text-[#0aad0a] border border-[#0aad0a]/40'
                      : 'bg-gray-900/90 text-gray-400 border border-gray-700'
                  }`}
                  title="Click to toggle status"
                >
                  ● {b.status}
                </button>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-black text-sm text-white">{b.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <ExternalLink size={13} className="text-[#0aad0a]" />
                    <span>Target: {b.targetType} → <strong className="text-white">{b.targetValue}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition-colors"
                    title="Edit Banner"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create / Edit Banner Modal */}
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
                {editingBanner ? 'Edit Store Banner' : 'Upload Store Banner'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set promotional slide title, layout slot, click redirect target, and upload graphic
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Banner Title / Campaign</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Flash Sale 40% OFF"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Placement Slot</label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Header Banner">Header Banner (Slot 0)</option>
                    <option value="Deal of Day">Deal of the Day (Slot 1)</option>
                    <option value="Home Section">Home Mid Section (Slot 2)</option>
                    <option value="Footer Banner">Footer Banner (Slot 3)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Target Action</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Category">Category Link</option>
                    <option value="Product">Specific Product</option>
                    <option value="Seller">Store / Vendor</option>
                    <option value="External">External URL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Target Value / Slug / URL</label>
                <input
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="e.g. organic-fruits or /category/vegetables"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              {/* Local Image Uploader */}
              <LocalImageUploader
                label="Banner Graphic (Local Server Storage)"
                folder="banners"
                value={imageUrl}
                onChange={setImageUrl}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingBanner ? 'Save Banner Updates' : 'Publish Banner Graphic'}
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
