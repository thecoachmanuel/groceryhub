'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X,
  Filter
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LocalImageUploader from '@/components/common/LocalImageUploader';

interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
  status: 'Active' | 'Inactive';
  image: string;
}

const INITIAL_CATEGORIES: AdminCategory[] = [
  { id: 1, name: 'Vegetables & Greens', slug: 'vegetables', productsCount: 120, status: 'Active', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' },
  { id: 2, name: 'Fresh Seasonal Fruits', slug: 'fruits', productsCount: 85, status: 'Active', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300' },
  { id: 3, name: 'Dairy, Eggs & Butter', slug: 'dairy', productsCount: 60, status: 'Active', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=300' },
  { id: 4, name: 'Bakery & Fresh Breads', slug: 'bakery', productsCount: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300' },
  { id: 5, name: 'Cold Drinks & Beverages', slug: 'beverages', productsCount: 90, status: 'Active', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300' },
  { id: 6, name: 'Snacks & Munchies', slug: 'snacks', productsCount: 140, status: 'Active', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300' },
  { id: 7, name: 'Pantry & Cooking Essentials', slug: 'pantry', productsCount: 110, status: 'Active', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [searchQuery, setSearchQuery] = useState('');

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setImageUrl('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (c: AdminCategory) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setImageUrl(c.image);
    setStatus(c.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Category name is required');

    const defaultImg = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300';
    const finalImage = imageUrl || defaultImg;
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name,
                slug: finalSlug,
                image: finalImage,
                status,
              }
            : c
        )
      );
    } else {
      const newCat: AdminCategory = {
        id: Date.now(),
        name,
        slug: finalSlug,
        productsCount: 0,
        status,
        image: finalImage,
      };
      setCategories([newCat, ...categories]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === 'Active' ? 'Inactive' : 'Active',
            }
          : c
      )
    );
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Layers size={24} className="text-[#0aad0a]" /> Category Management
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage store categories, catalog icons, and local banner uploads</p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category name or slug..."
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
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Slug</th>
                  <th className="pb-3 px-3">Catalog Items</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-white">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-400">/{cat.slug}</td>
                    <td className="py-3 px-3 font-bold text-white">{cat.productsCount} items</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleStatus(cat.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform active:scale-95 ${
                          cat.status === 'Active'
                            ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                        title="Click to toggle status"
                      >
                        ● {cat.status}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit Category"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                          title="Delete Category"
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

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set category display name, URL slug, and upload thumbnail icon
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Organic Herbs & Seasoning"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. organic-herbs"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              {/* Local Image Uploader */}
              <LocalImageUploader
                label="Category Icon / Image (Local Server Storage)"
                folder="categories"
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
                  {editingCategory ? 'Save Category Updates' : 'Create Category'}
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
