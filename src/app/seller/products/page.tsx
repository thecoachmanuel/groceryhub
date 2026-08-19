'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Package, Plus, Search, Trash2, Edit3, X, RefreshCw, Store } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import LocalImageUploader from '@/components/common/LocalImageUploader';
import { formatNaira } from '@/lib/currency';
import { useSellerAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api-fetch';

interface VendorProduct {
  id: number;
  _id?: string;
  name: string;
  category: string;
  price: number;
  discounted_price: number;
  stock: number;
  unit: string;
  status: string;
  image: string;
  description?: string;
}

export default function SellerProductsPage() {
  const { seller } = useSellerAuth();
  const sellerId = seller?.id || (seller as any)?.seller_id || 1;

  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('500g');
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSellerProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/products?seller_id=${sellerId}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        const formatted: VendorProduct[] = json.data.map((p: any) => ({
          id: p.product_id || p.id || Date.now(),
          _id: p._id,
          name: p.name,
          category: p.category || 'Vegetables',
          price: p.variants?.[0]?.price || p.price || 0,
          discounted_price: p.variants?.[0]?.discounted_price || p.variants?.[0]?.price || p.price || 0,
          stock: p.variants?.[0]?.stock || p.stock || 0,
          unit: p.variants?.[0]?.unit || p.unit || '1 pack',
          status: p.status || 'active',
          image: p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
          description: p.description || '',
        }));
        setProducts(formatted);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn('Error fetching seller products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchSellerProducts();
  }, [fetchSellerProducts]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Vegetables');
    setPrice('3500');
    setDiscountedPrice('3000');
    setStock('50');
    setUnit('500g');
    setStatus('active');
    setDescription('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: VendorProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(String(p.price));
    setDiscountedPrice(String(p.discounted_price || p.price));
    setStock(String(p.stock));
    setUnit(p.unit);
    setStatus(p.status || 'active');
    setDescription(p.description || '');
    setImageUrl(p.image);
    setIsModalOpen(true);
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
        // PUT /api/products/[id]
        const res = await apiFetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: name.trim(),
            category,
            price: finalPrice,
            discounted_price: finalDiscounted,
            stock: finalStock,
            unit: unit.trim(),
            status,
            description: description.trim(),
            image: finalImage,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          alert(json.message || 'Failed to update product');
        }
      } else {
        // POST /api/products
        const res = await apiFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify({
            name: name.trim(),
            category,
            price: finalPrice,
            discounted_price: finalDiscounted,
            stock: finalStock,
            unit: unit.trim(),
            status,
            description: description.trim(),
            image: finalImage,
            seller_id: sellerId,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          alert(json.message || 'Failed to create product');
        }
      }

      await fetchSellerProducts();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err?.message || 'Product operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to remove this product from your inventory?')) {
      try {
        const res = await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          fetchSellerProducts();
        } else {
          alert(json.message || 'Failed to delete product');
        }
      } catch (err: any) {
        alert(err?.message || 'Failed to delete product');
      }
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-8 w-full">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#0aad0a] font-bold mb-1">
                <Store size={14} /> Store: {seller?.storeName || 'My Store'}
              </div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Package size={24} className="text-[#0aad0a]" /> Store Catalog &amp; Inventory
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Add fresh farm items, update pricing in Naira (₦), set discount prices, and manage real-time inventory
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0aad0a] w-64"
                />
                <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
              </div>

              <button
                onClick={fetchSellerProducts}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all"
                title="Refresh Store Catalog"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>

              <button
                onClick={openCreateModal}
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95 whitespace-nowrap"
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
                <p className="text-xs text-gray-400">Loading your store catalog from database...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Package size={36} className="mx-auto text-gray-500" />
                <h3 className="text-base font-bold text-white">No products listed in catalog</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Your store catalog is empty. Click &apos;Add New Product&apos; above to list your fresh produce, vegetables, and groceries.
                </p>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-1.5 bg-[#0aad0a] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md"
                >
                  <Plus size={14} /> Add First Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-800">
                      <th className="pb-3 px-3 font-bold">Product Item</th>
                      <th className="pb-3 px-3 font-bold">Category</th>
                      <th className="pb-3 px-3 font-bold">Unit Measure</th>
                      <th className="pb-3 px-3 font-bold">Price (₦)</th>
                      <th className="pb-3 px-3 font-bold">Sale Price (₦)</th>
                      <th className="pb-3 px-3 font-bold">Inventory</th>
                      <th className="pb-3 px-3 font-bold">Status</th>
                      <th className="pb-3 px-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filtered.map((p) => {
                      const hasDiscount = p.discounted_price < p.price;
                      return (
                        <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                                <Image src={p.image} alt={p.name} fill className="object-cover" />
                              </div>
                              <div>
                                <span className="font-bold text-white max-w-xs truncate block">{p.name}</span>
                                {p.description && (
                                  <span className="text-[10px] text-gray-400 line-clamp-1 max-w-xs">{p.description}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-gray-400">{p.category}</td>
                          <td className="py-3.5 px-3">{p.unit}</td>
                          <td className={`py-3.5 px-3 font-bold font-mono ${hasDiscount ? 'line-through text-gray-500 text-[11px]' : 'text-white'}`}>
                            {formatNaira(p.price)}
                          </td>
                          <td className="py-3.5 px-3 font-bold font-mono text-[#0aad0a]">
                            {formatNaira(p.discounted_price || p.price)}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-white">{p.stock} units</td>
                          <td className="py-3.5 px-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              p.status === 'active' || p.status === 'Active'
                                ? 'bg-emerald-950/40 text-[#0aad0a]'
                                : 'bg-amber-950/40 text-amber-400'
                            }`}>
                              ● {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                                title="Edit Item"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                                title="Delete Item"
                              >
                                <Trash2 size={15} />
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
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">{editingProduct ? 'Edit Store Product' : 'Add New Produce Item'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Publish your grocery inventory to thousands of local customers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Product Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fresh Organic Farm Broccoli"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Category</label>
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
                    placeholder="e.g. 500g, Pack of 4"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Regular Price (₦)</label>
                  <input
                    type="number"
                    step="50"
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
                    step="50"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(e.target.value)}
                    placeholder="3000"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Stock Quantity</label>
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
                    <option value="active">Active</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Produce description or origin..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              {/* Local Image Uploader */}
              <LocalImageUploader
                label="Product Image (Local Server Storage)"
                folder="seller-products"
                value={imageUrl}
                onChange={setImageUrl}
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all flex items-center justify-center gap-2"
                >
                  {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
                  <span>{editingProduct ? 'Save Store Item' : 'Add Store Item'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-800 text-gray-300 font-bold px-5 py-3.5 rounded-xl text-xs hover:bg-gray-700"
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
