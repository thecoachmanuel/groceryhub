'use client';

import { useState } from 'react';
import Image from 'next/image';
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

interface AdminProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  image: string;
  description?: string;
}

const INITIAL_PRODUCTS: AdminProduct[] = [
  { id: 1, name: 'Fresh Organic Farm Broccoli', category: 'Vegetables', price: '$3.49', stock: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300', description: 'Fresh crisp organic broccoli' },
  { id: 2, name: 'Red Sweet Crisp Apples (Washington)', category: 'Fruits', price: '$4.29', stock: 50, status: 'Active', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300', description: 'Sweet crunchy farm apples' },
  { id: 3, name: 'Farm Fresh Pure Whole Milk', category: 'Dairy & Eggs', price: '$3.89', stock: 100, status: 'Active', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300', description: '100% pure organic farm milk' },
  { id: 4, name: 'Artisan Sourdough Bakery Bread', category: 'Bakery', price: '$2.99', stock: 15, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', description: 'Handcrafted sourdough loaf' },
  { id: 5, name: 'Fresh Ripe Hass Avocados (Pack of 3)', category: 'Vegetables', price: '$4.99', stock: 35, status: 'Active', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300', description: 'Creamy Hass avocados' },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_PRODUCTS);
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

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Vegetables');
    setPrice('3.99');
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
    setPrice(p.price.replace('$', ''));
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
        `Premium quality ${name}. Sourced fresh directly from certified organic farms. Rich in essential vitamins, minerals, and natural flavor. Hand-sorted and delivered fresh in temperature-controlled packaging.`
      );
      setIsAiGenerating(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Product name is required');

    const defaultImg = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300';
    const finalImage = imageUrl || defaultImg;
    const finalPrice = `$${parseFloat(price || '0').toFixed(2)}`;
    const finalStock = parseInt(stock || '0', 10);

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
                description,
                image: finalImage,
                status: finalStock <= 15 ? 'Low Stock' : status,
              }
            : p
        )
      );
    } else {
      const newProd: AdminProduct = {
        id: Date.now(),
        name,
        category,
        price: finalPrice,
        stock: finalStock,
        description,
        image: finalImage,
        status: finalStock <= 15 ? 'Low Stock' : 'Active',
      };
      setProducts([newProd, ...products]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product from catalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Package size={24} className="text-[#0aad0a]" /> Product Catalog & Inventory
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage stock levels, price points, local image uploads, and AI descriptions</p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title or category..."
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
              <option value="all">All Departments</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="dairy & eggs">Dairy & Eggs</option>
              <option value="bakery">Bakery</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Product</th>
                  <th className="pb-3 px-3">Department</th>
                  <th className="pb-3 px-3">Retail Price</th>
                  <th className="pb-3 px-3">Stock Units</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-white max-w-xs truncate">{prod.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400">{prod.category}</td>
                    <td className="py-3.5 px-3 font-bold text-white">{prod.price}</td>
                    <td className="py-3.5 px-3">{prod.stock} units</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        prod.status === 'Active'
                          ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                          : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                      }`}>
                        ● {prod.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                          title="Edit Product"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                          title="Delete Product"
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

      {/* Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set item name, price, department, local image, and AI description
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fresh Organic Farm Broccoli"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Department</label>
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
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="4.99"
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
                folder="products"
                value={imageUrl}
                onChange={setImageUrl}
              />

              {/* AI Assisted Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-300">Product Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isAiGenerating}
                    className="inline-flex items-center gap-1.5 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-[11px] font-bold px-3 py-1 rounded-lg transition-colors"
                  >
                    <Sparkles size={13} />
                    <span>{isAiGenerating ? 'Generating...' : 'AI Generate with OpenAI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed product description or use OpenAI generator above..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                >
                  {editingProduct ? 'Save Product Changes' : 'Save Product to Catalog'}
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
