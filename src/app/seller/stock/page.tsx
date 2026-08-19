'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Boxes, Search, CheckCircle2, AlertTriangle, Save, RefreshCw } from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { apiFetch } from '@/lib/api-fetch';
import { useSellerAuth } from '@/context/AuthContext';

interface SellerStockItem {
  _id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  image: string;
  status: string;
}

const LOW_STOCK_THRESHOLD = 10;

export default function SellerStockPage() {
  const { seller } = useSellerAuth();
  const sellerId = (seller as any)?.id || (seller as any)?.seller_id;

  const [inventory, setInventory] = useState<SellerStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, number>>({});

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const url = sellerId ? `/api/admin/stock?seller_id=${sellerId}` : '/api/admin/stock';
      const res = await apiFetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInventory(json.data.map((p: any) => ({
          _id: String(p._id),
          name: p.name || 'Product',
          category: p.category || '—',
          stock: p.stock ?? 0,
          price: p.price ?? 0,
          image: p.image || '',
          status: p.status || 'active',
        })));
      }
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInventory(); }, [sellerId]);

  const handleStockChange = (id: string, val: number) => {
    const newVal = Math.max(0, val);
    setPendingUpdates((prev) => ({ ...prev, [id]: newVal }));
    setInventory((prev) => prev.map((it) => it._id === id ? { ...it, stock: newVal } : it));
  };

  const handleSaveAll = async () => {
    if (Object.keys(pendingUpdates).length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(pendingUpdates).map(([productId, stock]) =>
          apiFetch('/api/admin/stock', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, stock, current_stock: stock }),
          })
        )
      );
      setPendingUpdates({});
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    } catch (err) { console.warn(err); }
    setSaving(false);
  };

  const filtered = inventory.filter(
    (it) =>
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventory.filter((it) => it.stock <= LOW_STOCK_THRESHOLD && it.stock >= 0);
  const hasPendingUpdates = Object.keys(pendingUpdates).length > 0;

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-6 sm:p-10 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Boxes size={24} className="text-[#0aad0a]" /> Store Inventory &amp; Stock Control
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Live product stock levels from your store catalog — inline edits saved to MongoDB
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchInventory}
                className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
                title="Refresh inventory"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving || !hasPendingUpdates}
                className="bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white text-xs font-black px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : `Save${hasPendingUpdates ? ` (${Object.keys(pendingUpdates).length})` : ''}`}</span>
              </button>
            </div>
          </div>

          {saveToast && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2">
              <CheckCircle2 size={18} /> Inventory quantities saved and synced with store catalog!
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-800/40 p-4 rounded-2xl flex items-center gap-3 text-amber-300 text-xs">
              <AlertTriangle size={18} className="flex-shrink-0" />
              <span>
                <strong>Low Stock Alert:</strong> {lowStockItems.length} product(s) below {LOW_STOCK_THRESHOLD} units — {lowStockItems.slice(0, 3).map((i) => i.name).join(', ')}
                {lowStockItems.length > 3 ? ` +${lowStockItems.length - 3} more` : ''}
              </span>
            </div>
          )}

          <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory by product name or category..."
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 ml-4">{inventory.length} products</span>
          </div>

          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden">
            {loading ? (
              <div className="text-center py-10 text-xs text-gray-400">Loading store inventory...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-400">No products found. Add products to your catalog first.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="pb-3 px-3">Product</th>
                      <th className="pb-3 px-3">Category</th>
                      <th className="pb-3 px-3">Stock Units</th>
                      <th className="pb-3 px-3">Unit Price</th>
                      <th className="pb-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                    {filtered.map((item) => {
                      const isLow = item.stock <= LOW_STOCK_THRESHOLD;
                      const isModified = item._id in pendingUpdates;
                      return (
                        <tr key={item._id} className={`hover:bg-gray-800/40 transition-colors ${isModified ? 'border-l-2 border-amber-500' : ''}`}>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                                {item.image ? (
                                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <Boxes size={16} />
                                  </div>
                                )}
                              </div>
                              <span className="font-bold text-white max-w-xs truncate">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-gray-400">{item.category}</td>
                          <td className="py-3.5 px-3">
                            <input
                              type="number"
                              min="0"
                              value={item.stock}
                              onChange={(e) => handleStockChange(item._id, parseInt(e.target.value || '0', 10))}
                              className="w-24 bg-gray-900 border border-gray-700 text-white rounded-xl p-2 text-xs font-bold focus:outline-none focus:border-[#0aad0a]"
                            />
                          </td>
                          <td className="py-3.5 px-3 font-mono text-white">₦{item.price.toLocaleString()}</td>
                          <td className="py-3.5 px-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              isLow
                                ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                                : 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                            }`}>
                              ● {isLow ? (item.stock === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock'}
                            </span>
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
    </div>
  );
}
