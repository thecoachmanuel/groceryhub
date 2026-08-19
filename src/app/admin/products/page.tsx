'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Search, 
  Sparkles, 
  Trash2, 
  Edit3, 
  X,
  Filter,
  RefreshCw,
  Store
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LocalImageUploader from '@/components/common/LocalImageUploader';
import { formatNaira } from '@/lib/currency';
import { apiFetch } from '@/lib/api-fetch';

interface AdminProduct {
  id: number;
  _id?: string;
  seller_id: number;
  seller_name?: string;
  name: string;
  category: string;
  price: number;
  discounted_price: number;
  unit: string;
  stock: number;
  status: string;
  image: string;
  description?: string;
}

interface SellerItem {
  seller_id: number;
  store_name: string;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [sellers, setSellers] = useState<SellerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('1 pack');
  const [sellerId, setSellerId] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('Active');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');

  // Fetch Sellers for store filter and dropdown
  useEffect(() => {
    async function loadSellers() {
      try {
        const res = await apiFetch('/api/admin/sellers');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSellers(json.data.map((s: any) => ({
            seller_id: s.seller_id,
            store_name: s.store_name || s.name || `Store #${s.seller_id}`,
            name: s.name,
          })));
        }
      } catch (err) {
        console.warn('Error loading sellers list:', err);
      }
    }
    loadSellers();
  }, []);

  const fetchProductsFromApi = useCallback(async () => {
    try {
      setLoading(true);
      const url = sellerFilter === 'all' ? '/api/products' : `/api/products?seller_id=${sellerFilter}`;
      const res = await apiFetch(url);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        // Build seller lookup map
        const sellerMap: Record<number, string> = {};
        sellers.forEach(s => { sellerMap[s.seller_id] = s.store_name; });

        const formatted: AdminProduct[] = json.data.map((p: any) => ({
          id: p.product_id || p.id || Date.now(),
          _id: p._id,
          seller_id: p.seller_id || 1,
          seller_name: sellerMap[p.seller_id] || (p.seller_id ? `Store #${p.seller_id}` : 'GroceryHub Direct'),
          name: p.name,
          category: p.category || 'Vegetables',
          price: p.variants?.[0]?.price || p.price || 0,
          discounted_price: p.variants?.[0]?.discounted_price || p.variants?.[0]?.price || p.price || 0,
          unit: p.variants?.[0]?.unit || p.unit || '1 pack',
          stock: p.variants?.[0]?.stock || p.stock || 0,
          status: p.status || 'Active',
          image: p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
          description: p.description || '',
        }));
        setProducts(formatted);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn('Products fetch error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [sellerFilter, sellers]);

  useEffect(() => {
    fetchProductsFromApi();
  }, [fetchProductsFromApi]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Vegetables');
    setPrice('3500');
    setDiscountedPrice('3000');
    setStock('50');
    setUnit('1 pack');
    setSellerId(sellers[0]?.seller_id || 1);
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
    setDiscountedPrice(String(p.discounted_price || p.price));
    setStock(String(p.stock));
    setUnit(p.unit || '1 pack');
    setSellerId(p.seller_id || 1);
    setDescription(p.description || '');
    setImageUrl(p.image);
    setStatus(p.status || 'Active');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Product name is required');

    setSubmitting(true);
    const defaultImg = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300';
    const finalImage = imageUrl || defaultImg;
    const finalPrice = parseFloat(price || '0');
    const finalDiscounted = discountedPrice ? parseFloat(discountedPrice) : finalPrice;
    const finalStock = parseInt(stock || '0', 10);

    try {
      if (editingProduct) {
        const res = await apiFetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: name.trim(),
            category,
            price: finalPrice,
            discounted_price: finalDiscounted,
            stock: finalStock,
            unit: unit.trim(),
            seller_id: sellerId,
            description: description.trim(),
            image: finalImage,
            status,
          }),
        });
        const json = await res.json();
        if (!json.success) alert(json.message || 'Update failed');
      } else {
        const res = await apiFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify({
            name: name.trim(),
            category,
            price: finalPrice,
            discounted_price: finalDiscounted,
            stock: finalStock,
            unit: unit.trim(),
            seller_id: sellerId,
            description: description.trim(),
            image: finalImage,
            status,
          }),
        });
        const json = await res.json();
        if (!json.success) alert(json.message || 'Creation failed');
      }

      await fetchProductsFromApi();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err?.message || 'Product save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to remove this product?')) {
      try {
        const res = await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          fetchProductsFromApi();
        } else {
          alert(json.message || 'Failed to delete product');
        }
      } catch (err: any) {
        alert(err?.message || 'Failed to delete product');
      }
    }
  };

  const filtered = products.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.seller_name && p.seller_name.toLowerCase().includes(searchQuery.toLowerCase()));
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
              <Package size={24} className="text-[#0aad0a]" /> Store Products &amp; Global Catalog
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage live grocery items across all store partners, adjust prices, stock levels, and discount rates</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProductsFromApi}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all"
              title="Refresh Catalog"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={openCreateModal}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>
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
              placeholder="Search products by title, category, or store partner..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Store Partner Filter */}
            <div className="flex items-center gap-1.5">
              <Store size={15} className="text-[#0aad0a]" />
              <select
                value={sellerFilter}
                onChange={(e) => setSellerFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#0aad0a]"
              >
                <option value="all">All Store Partners</option>
                {sellers.map((s) => (
                  <option key={s.seller_id} value={s.seller_id}>
                    {s.store_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-1.5">
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
                <option value="beverages">Beverages</option>
                <option value="snacks & munchies">Snacks &amp; Munchies</option>
                <option value="pantry staples">Pantry Staples</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading live catalog from database...</p>
            </div>
          ) : filtered.length === 0 ? (
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
                    <th className="pb-3 px-3">Store Partner</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Price (₦)</th>
                    <th className="pb-3 px-3">Sale Price (₦)</th>
                    <th className="pb-3 px-3">Stock</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((item) => {
                    const hasDiscount = item.discounted_price < item.price;
                    return (
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
                        <td className="py-3.5 px-3 font-bold text-xs text-[#0aad0a]">
                          {item.seller_name}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="bg-gray-800 text-gray-300 font-bold text-[10px] px-2.5 py-1 rounded-lg capitalize">
                            {item.category}
                          </span>
                        </td>
                        <td className={`py-3.5 px-3 font-bold font-mono ${hasDiscount ? 'line-through text-gray-500 text-[11px]' : 'text-white'}`}>
                          {formatNaira(item.price)}
                        </td>
                        <td className="py-3.5 px-3 font-bold font-mono text-[#0aad0a]">
                          {formatNaira(item.discounted_price || item.price)}
                        </td>
                        <td className="py-3.5 px-3 font-mono">{item.stock} units</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              item.status === 'Active' || item.status === 'active'
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
                    );
                  })}
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
                Manage title, store partner assignment, regular &amp; sale prices, stock, and AI product descriptions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Store Partner Assignment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Assign Store Partner</label>
                <select
                  value={sellerId}
                  onChange={(e) => setSellerId(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  {sellers.map((s) => (
                    <option key={s.seller_id} value={s.seller_id}>
                      {s.store_name} (ID #{s.seller_id})
                    </option>
                  ))}
                </select>
              </div>

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
                  <label className="text-xs font-bold text-gray-300">Unit Measure</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 500g, 1 pack"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Regular Price in Naira (₦)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Discounted / Sale Price (₦)</label>
                  <input
                    type="number"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(e.target.value)}
                    placeholder="3000"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] font-mono"
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
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Hidden">Hidden</option>
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
                disabled={submitting}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95 mt-2 flex items-center justify-center gap-2"
              >
                {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
                <span>{editingProduct ? 'Save Product Changes' : 'Publish Product to Catalog'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
