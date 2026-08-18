'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Search, 
  Sparkles, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X,
  Filter
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LocalImageUploader from '@/components/common/LocalImageUploader';
import { formatNaira } from '@/lib/currency';
import { PRODUCTS_CATALOG } from '@/lib/catalog';

interface AdminProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  description?: string;
}

const INITIAL_ADMIN_PRODUCTS: AdminProduct[] = PRODUCTS_CATALOG.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.variants[0]?.price || 3500,
  stock: p.variants[0]?.stock || 45,
  status: 'Active',
  image: p.image,
  description: p.description,
}));

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('Active');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load from localStorage on mount & ensure full catalog sync
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('groceryhub_admin_products');
      if (saved) {
        try {
          const parsed: AdminProduct[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= PRODUCTS_CATALOG.length) {
            setProducts(parsed);
            return;
          }
        } catch {}
      }
      // If no saved list or stale 4-5 items, save full catalog
      localStorage.setItem('groceryhub_admin_products', JSON.stringify(INITIAL_ADMIN_PRODUCTS));
      setProducts(INITIAL_ADMIN_PRODUCTS);
    }
  }, []);

  const saveProductsToStorage = (updated: AdminProduct[]) => {
    setProducts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryhub_admin_products', JSON.stringify(updated));
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Vegetables');
    setPrice('3500');
    setStock('50');
    setDescription('');
    setImageUrl('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (p: AdminProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(String(p.price));
    setStock(String(p.stock));
    setDescription(p.description || '');
    setImageUrl(p.image);
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleGenerateAiDescription = () => {
    if (!name) return alert('Please enter a product title first to generate AI description');
    setIsAiGenerating(true);
    setTimeout(() => {
      setDescription(
        `Premium quality ${name}. Sourced fresh directly from certified organic farm partners in Nigeria. Rich in essential vitamins, minerals, and natural flavor. Hand-sorted and delivered fresh in temperature-controlled packaging.`
      );
      setIsAiGenerating(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Product name is required');

    const defaultImg = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300';
    const finalImage = imageUrl || defaultImg;
    const finalPrice = parseFloat(price || '0');
    const finalStock = parseInt(stock || '0', 10);

    let updated: AdminProduct[];
    if (editingProduct) {
      updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name,
              category,
              price: finalPrice,
              stock: finalStock,
              description,
              image: finalImage,
              status,
            }
          : p
      );
    } else {
      const newProduct: AdminProduct = {
        id: Date.now(),
        name,
        category,
        price: finalPrice,
        stock: finalStock,
        description,
        image: finalImage,
        status,
      };
      updated = [newProduct, ...products];
    }

    saveProductsToStorage(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this product?')) {
      const updated = products.filter((p) => p.id !== id);
      saveProductsToStorage(updated);
    }
  };

  const filtered = products.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Package size={24} className="text-[#0aad0a]" /> Store Products &amp; Catalog
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage live grocery items, inventory levels, AI descriptions, and Naira pricing in real time</p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link href="/admin/products" className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-black flex items-center gap-1.5">
            <Package size={13} /> All Store Catalog Items ({products.length})
          </Link>
          <Link href="/admin/products/request" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Product Requests &amp; Approvals
          </Link>
          <Link href="/admin/categories" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Product Categories
          </Link>
          <Link href="/admin/brands" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors">
            Brand Partners
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title or department..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
            >
              <option value="all">All Departments ({products.length})</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="dairy & eggs">Dairy &amp; Eggs</option>
              <option value="bakery">Bakery</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden shadow-xl">
          {filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Package size={36} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold">No products found</h4>
              <p className="text-xs text-gray-400">Click "Add New Product" above to list items in your store catalog.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="pb-3 px-3">Product</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Price (₦)</th>
                    <th className="pb-3 px-3">Stock</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0 border border-gray-700">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{item.name}</span>
                            {item.description && (
                              <span className="text-[10px] text-gray-400 line-clamp-1 max-w-xs">{item.description}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="bg-gray-800 text-gray-300 font-bold text-[10px] px-2.5 py-1 rounded-lg">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-white font-mono">{formatNaira(item.price)}</td>
                      <td className="py-3.5 px-3 font-mono">{item.stock} units</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            item.status === 'Active'
                              ? 'bg-emerald-950 text-[#0aad0a]'
                              : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          ● {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-blue-400 transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-950 text-red-400 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Product Creation / Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-5 relative shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black flex items-center gap-2">
                <Package size={20} className="text-[#0aad0a]" />
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Store'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage title, Naira price, stock inventory, and AI product descriptions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Product Title / Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fresh Organic Farm Broccoli (500g)"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Department / Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy & Eggs">Dairy &amp; Eggs</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks & Munchies">Snacks &amp; Munchies</option>
                    <option value="Pantry Staples">Pantry Staples</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Price in Naira (₦)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Stock Quantity (Units)</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Active">Active</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Local Image Uploader */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Product Image URL or Upload</label>
                <LocalImageUploader
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Description & AI Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-300">Product Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isAiGenerating}
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-800/50"
                  >
                    <Sparkles size={12} className={isAiGenerating ? 'animate-spin' : ''} />
                    <span>{isAiGenerating ? 'Writing AI copy...' : 'Generate with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fresh farm produce product details..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95 mt-2"
              >
                {editingProduct ? 'Save Product Changes' : 'Publish Product to Frontpage'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
