'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package, Plus, Search, Trash2, Edit3, X, Filter } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import LocalImageUploader from '@/components/common/LocalImageUploader';

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
  { id: 1, name: 'Fresh Organic Farm Broccoli', category: 'Vegetables', price: 3.49, stock: 45, unit: '500g', status: 'Active', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200' },
  { id: 2, name: 'Red Sweet Crisp Apples (Washington)', category: 'Fruits', price: 4.29, stock: 50, unit: '1kg', status: 'Active', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200' },
  { id: 3, name: 'Fresh Hass Avocados (Pack of 3)', category: 'Vegetables', price: 4.99, stock: 35, unit: 'Pack of 3', status: 'Active', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200' },
  { id: 4, name: 'Organic Baby Spinach (Pre-washed)', category: 'Vegetables', price: 2.79, stock: 60, unit: '250g', status: 'Active', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200' },
];

export default function SellerProductsPage() {
  const [products, setProducts] = useState<VendorProduct[]>(INITIAL_VENDOR_PRODUCTS);
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
    setPrice('3.49');
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
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name,
                category,
                price: finalPrice,
                stock: finalStock,
                unit,
                image: finalImage,
                status: finalStatus,
              }
            : p
        )
      );
    } else {
      const newProd: VendorProduct = {
        id: Date.now(),
        name,
        category,
        price: finalPrice,
        stock: finalStock,
        unit,
        status: finalStatus,
        image: finalImage,
      };
      setProducts([newProd, ...products]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this item from your store?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Package size={24} className="text-[#0aad0a]" /> Store Product Catalog
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Manage your store inventory, retail prices, and local image uploads</p>
            </div>

            <button
              onClick={openCreateModal}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Add Store Product</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store inventory..."
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Product</th>
                    <th className="pb-3 px-3">Department</th>
                    <th className="pb-3 px-3">Unit / Pack</th>
                    <th className="pb-3 px-3">Price</th>
                    <th className="pb-3 px-3">Stock Available</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
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
                      <td className="py-3.5 px-3 font-bold text-white">${p.price.toFixed(2)}</td>
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
          </div>
        </main>
      </div>

      {/* Create / Edit Modal */}
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
                {editingProduct ? 'Edit Store Product' : 'Add Product to Store'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set item title, category, price, stock, and local image
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farm Fresh Crisp Lettuce"
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
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Pantry">Pantry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Unit / Measure</label>
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
                  <label className="text-xs font-bold text-gray-300">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3.99"
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
