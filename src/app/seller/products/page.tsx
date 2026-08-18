'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package, Plus, Search, Trash2, Edit3, X, Filter } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import LocalImageUploader from '@/components/common/LocalImageUploader';
import { formatNaira } from '@/lib/currency';
import { useSellerAuth } from '@/context/AuthContext';

interface VendorProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: 'Active' | 'Low Stock' | 'Inactive';
  image: string;
}

const INITIAL_VENDOR_PRODUCTS: VendorProduct[] = [
  { id: 1, name: 'Fresh Organic Farm Broccoli', category: 'Vegetables', price: 3500, stock: 45, unit: '500g', status: 'Active', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200' },
  { id: 2, name: 'Red Sweet Crisp Apples (1kg Pack)', category: 'Fruits', price: 4500, stock: 50, unit: '1kg', status: 'Active', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200' },
  { id: 3, name: 'Fresh Hass Avocados (Pack of 4)', category: 'Vegetables', price: 3800, stock: 35, unit: 'Pack of 4', status: 'Active', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200' },
  { id: 4, name: 'Organic Baby Spinach (Pre-washed 250g)', category: 'Vegetables', price: 2800, stock: 60, unit: '250g', status: 'Active', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200' },
];

export default function SellerProductsPage() {
  const { seller } = useSellerAuth();
  const isDemoSeller = seller?.email === 'vendor@groceryhub.ng';
  const [products, setProducts] = useState<VendorProduct[]>(isDemoSeller ? INITIAL_VENDOR_PRODUCTS : []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('500g');
  const [imageUrl, setImageUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Vegetables');
    setPrice('3500');
    setStock('50');
    setUnit('500g');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: VendorProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(String(p.price));
    setStock(String(p.stock));
    setUnit(p.unit);
    setImageUrl(p.image);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Product name is required');

    const defaultImg = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300';
    const finalImage = imageUrl || defaultImg;
    const finalPrice = parseFloat(price || '0');
    const finalStock = parseInt(stock || '0', 10);
    const finalStatus: VendorProduct['status'] = finalStock <= 15 ? 'Low Stock' : 'Active';

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: name.trim(),
                category,
                price: finalPrice,
                stock: finalStock,
                unit: unit.trim(),
                image: finalImage,
                status: finalStatus,
              }
            : p
        )
      );
    } else {
      const newProduct: VendorProduct = {
        id: Date.now(),
        name: name.trim(),
        category,
        price: finalPrice,
        stock: finalStock,
        unit: unit.trim(),
        image: finalImage,
        status: finalStatus,
      };
      setProducts([newProduct, ...products]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this product from your inventory?')) {
      setProducts(products.filter((p) => p.id !== id));
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
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Package size={24} className="text-[#0aad0a]" /> Store Catalog &amp; Inventory
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Add fresh farm items, update pricing in Naira (₦), and track stock availability
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
            {filtered.length === 0 ? (
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
                      <th className="pb-3 px-3 font-bold">Inventory</th>
                      <th className="pb-3 px-3 font-bold">Status</th>
                      <th className="pb-3 px-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <span className="font-bold text-white max-w-xs truncate">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-gray-400">{p.category}</td>
                      <td className="py-3.5 px-3">{p.unit}</td>
                      <td className="py-3.5 px-3 font-bold text-white font-mono">{formatNaira(p.price)}</td>
                      <td className="py-3.5 px-3 font-bold text-white">{p.stock} units</td>
                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          p.status === 'Active'
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
                  ))}
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
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">{editingProduct ? 'Edit Product' : 'Add New Produce Item'}</h3>
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
                    <option value="Snacks">Snacks</option>
                    <option value="Pantry">Pantry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Unit Measure</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 500g"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Price (₦)</label>
                  <input
                    type="number"
                    step="50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
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
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingProduct ? 'Save Store Item' : 'Add Store Item'}
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
