'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Boxes, Search, CheckCircle2, AlertTriangle, Infinity as InfinityIcon, Save } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';

interface SellerStockItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  isInfinite: boolean;
  lowStockThreshold: number;
  image: string;
}

const INITIAL_SELLER_STOCK: SellerStockItem[] = [
  { id: 1, name: 'Fresh Organic Farm Broccoli', category: 'Vegetables', stock: 45, isInfinite: false, lowStockThreshold: 15, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200' },
  { id: 2, name: 'Red Sweet Crisp Apples (Washington)', category: 'Fruits', stock: 50, isInfinite: false, lowStockThreshold: 20, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200' },
  { id: 3, name: 'Fresh Hass Avocados (Pack of 3)', category: 'Vegetables', stock: 12, isInfinite: false, lowStockThreshold: 15, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200' },
  { id: 4, name: 'Organic Baby Spinach (Pre-washed)', category: 'Vegetables', stock: 60, isInfinite: false, lowStockThreshold: 15, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200' },
];

export default function SellerStockPage() {
  const [inventory, setInventory] = useState<SellerStockItem[]>(INITIAL_SELLER_STOCK);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const handleStockChange = (id: number, val: number) => {
    setInventory((prev) =>
      prev.map((it) => (it.id === id ? { ...it, stock: Math.max(0, val) } : it))
    );
  };

  const handleToggleInfinite = (id: number) => {
    setInventory((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isInfinite: !it.isInfinite } : it))
    );
  };

  const handleSaveAll = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const filtered = inventory.filter(
    (it) =>
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventory.filter((it) => !it.isInfinite && it.stock <= it.lowStockThreshold);

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Boxes size={24} className="text-[#0aad0a]" /> Store Inventory & Stock Control
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Inline stock quantity updates, automatic safety restock alerts, and unlimited harvest toggles
              </p>
            </div>

            <button
              onClick={handleSaveAll}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
            >
              <Save size={16} />
              <span>Save Inventory Levels</span>
            </button>
          </div>

          {saveToast && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> Store inventory quantities saved and synced with catalog!
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-800/40 p-4 rounded-2xl flex items-center gap-3 text-amber-300 text-xs">
              <AlertTriangle size={18} className="flex-shrink-0" />
              <span>
                <strong>Low Stock Alert:</strong> {lowStockItems.length} product(s) ({lowStockItems.map((i) => i.name).join(', ')}) have dropped below safety thresholds!
              </span>
            </div>
          )}

          <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory items..."
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
                    <th className="pb-3 px-3">Produce Item</th>
                    <th className="pb-3 px-3">Department</th>
                    <th className="pb-3 px-3">Stock Units Available</th>
                    <th className="pb-3 px-3">Low-Stock Alert Level</th>
                    <th className="pb-3 px-3">Unlimited Supply</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                  {filtered.map((item) => {
                    const isLow = !item.isInfinite && item.stock <= item.lowStockThreshold;
                    return (
                      <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-white max-w-xs truncate">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-gray-400">{item.category}</td>
                        <td className="py-3.5 px-3">
                          {item.isInfinite ? (
                            <span className="text-[#0aad0a] font-bold flex items-center gap-1">
                              <InfinityIcon size={16} /> Unlimited Supply
                            </span>
                          ) : (
                            <input
                              type="number"
                              value={item.stock}
                              onChange={(e) => handleStockChange(item.id, parseInt(e.target.value || '0', 10))}
                              className="w-24 bg-gray-900 border border-gray-700 text-white rounded-xl p-2 text-xs font-bold focus:outline-none focus:border-[#0aad0a]"
                            />
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-gray-400">&lt; {item.lowStockThreshold} units</td>
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            onClick={() => handleToggleInfinite(item.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              item.isInfinite
                                ? 'bg-emerald-950 text-[#0aad0a] border border-[#0aad0a]/40'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                          >
                            {item.isInfinite ? 'Infinite: ON' : 'Infinite: OFF'}
                          </button>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            isLow
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                              : 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                          }`}>
                            ● {isLow ? 'Low Stock' : 'Optimal'}
                          </span>
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
    </div>
  );
}
