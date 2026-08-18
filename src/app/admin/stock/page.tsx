'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Boxes, AlertTriangle, Search, CheckCircle2, Save, Filter } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const INITIAL_INVENTORY = [
  { id: 1, name: 'Fresh Organic Farm Broccoli (500g)', category: 'Vegetables', sku: 'VEG-BRC-01', stock: 45, threshold: 20, isUnlimited: false, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200' },
  { id: 2, name: 'Red Sweet Crisp Apples (1kg)', category: 'Fruits', sku: 'FRT-APL-02', stock: 50, threshold: 20, isUnlimited: false, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200' },
  { id: 3, name: 'Farm Fresh Pure Whole Milk (1 Gallon)', category: 'Dairy & Eggs', sku: 'DRY-MLK-03', stock: 100, threshold: 30, isUnlimited: false, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200' },
  { id: 4, name: 'Artisan Sourdough Bakery Bread (400g)', category: 'Bakery', sku: 'BKY-BRD-04', stock: 12, threshold: 20, isUnlimited: false, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200' },
  { id: 5, name: 'Fresh Hass Avocados (Pack of 3)', category: 'Vegetables', sku: 'VEG-AVO-05', stock: 8, threshold: 15, isUnlimited: false, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200' },
];

export default function AdminStockManagementPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStockChange = (id: number, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: Math.max(0, newStock) } : item))
    );
  };

  const handleToggleUnlimited = (id: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isUnlimited: !item.isUnlimited } : item))
    );
  };

  const handleSaveBatch = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const filtered = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLowStock = !filterLowStockOnly || item.stock <= item.threshold;
    return matchesSearch && matchesLowStock;
  });

  const lowStockCount = inventory.filter((i) => i.stock <= i.threshold).length;

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Boxes size={24} className="text-[#0aad0a]" /> Real-time Stock & Inventory Control
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage safety stock thresholds, low-inventory reorders, and stock replenishment</p>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-[#0aad0a] flex items-center gap-1">
                <CheckCircle2 size={16} /> Inventory changes saved!
              </span>
            )}
            <button
              onClick={handleSaveBatch}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Save size={16} />
              <span>Save Stock Updates</span>
            </button>
          </div>
        </div>

        {/* Quick KPI & Low Stock Alert Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-1">
            <span className="text-xs font-bold text-gray-400">Total Tracked SKUs</span>
            <div className="text-2xl font-black text-white">{inventory.length} Items</div>
          </div>

          <div
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`border rounded-2xl p-5 space-y-1 cursor-pointer transition-all ${
              filterLowStockOnly
                ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-950/40'
                : 'bg-[#1e2632] border-gray-800 hover:border-red-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Low Stock Warnings
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                {filterLowStockOnly ? 'Filtered' : 'Click to Filter'}
              </span>
            </div>
            <div className="text-2xl font-black text-red-400">{lowStockCount} Products</div>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-2xl p-5 space-y-1">
            <span className="text-xs font-bold text-gray-400">Inventory Status</span>
            <div className="text-2xl font-black text-[#0aad0a]">Healthy (94%)</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU or Product name..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Product</th>
                  <th className="pb-3 px-3">SKU</th>
                  <th className="pb-3 px-3">Safety Threshold</th>
                  <th className="pb-3 px-3">Available Stock</th>
                  <th className="pb-3 px-3">Unlimited Stock</th>
                  <th className="pb-3 px-3">Stock Level Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                {filtered.map((item) => {
                  const isLow = item.stock <= item.threshold;
                  return (
                    <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <span className="font-bold text-white max-w-xs truncate">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-400">{item.sku}</td>
                      <td className="py-3 px-3">{item.threshold} units</td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) => handleStockChange(item.id, Number(e.target.value))}
                          disabled={item.isUnlimited}
                          className="w-24 bg-gray-900 border border-gray-700 text-white rounded-lg px-2.5 py-1 text-xs font-black disabled:opacity-40 focus:outline-none focus:border-[#0aad0a]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isUnlimited}
                            onChange={() => handleToggleUnlimited(item.id)}
                            className="accent-[#0aad0a] w-4 h-4 rounded"
                          />
                          <span className="text-[11px] text-gray-400">Unlimited</span>
                        </label>
                      </td>
                      <td className="py-3 px-3">
                        {item.isUnlimited ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-950/40 text-blue-400">
                            ● Infinite Stock
                          </span>
                        ) : isLow ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-950/40 text-red-400 flex items-center gap-1 w-fit">
                            <AlertTriangle size={12} /> Low Stock ({item.stock})
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/40 text-[#0aad0a]">
                            ● In Stock ({item.stock})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
