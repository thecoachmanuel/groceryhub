'use client';

import { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Search, Save, RefreshCw } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface StockItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  current_stock: number;
  price: number;
}

const formatStockFromApi = (p: any): StockItem => ({
  id: p._id,
  name: p.name || 'Product',
  category: p.category || '—',
  stock: p.stock ?? p.current_stock ?? 0,
  current_stock: p.current_stock ?? p.stock ?? 0,
  price: p.price ?? 0,
});

export default function AdminStockManagementPage() {
  const [inventory, setInventory] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, number>>({});

  const LOW_STOCK_THRESHOLD = 10;

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stock');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setInventory(json.data.map(formatStockFromApi));
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleStockChange = (id: string, newStock: number) => {
    setPendingUpdates((prev) => ({ ...prev, [id]: Math.max(0, newStock) }));
    setInventory((prev) => prev.map((item) => item.id === id ? { ...item, stock: Math.max(0, newStock) } : item));
  };

  const handleSaveBatch = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(pendingUpdates).map(([productId, stock]) =>
          fetch('/api/admin/stock', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, stock, current_stock: stock }),
          })
        )
      );
      setPendingUpdates({});
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) { console.warn(err); }
    setSaving(false);
  };

  const filtered = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLowStock = !filterLowStockOnly || item.stock <= LOW_STOCK_THRESHOLD;
    return matchesSearch && matchesLowStock;
  });

  const lowStockCount = inventory.filter((i) => i.stock <= LOW_STOCK_THRESHOLD).length;
  const hasPendingUpdates = Object.keys(pendingUpdates).length > 0;

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2"><Boxes size={24} className="text-[#0aad0a]" /> Stock Management</h1>
            <p className="text-xs text-gray-400 mt-0.5">Live product stock levels from database — edit and save changes</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchInventory} disabled={loading} className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-2 rounded-xl">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            {hasPendingUpdates && (
              <button onClick={handleSaveBatch} disabled={saving} className="inline-flex items-center gap-1.5 bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-60">
                <Save size={14} /> {saving ? 'Saving...' : `Save Changes (${Object.keys(pendingUpdates).length})`}
              </button>
            )}
          </div>
        </div>

        {/* Stats pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl">
            <span className="text-xs text-gray-400 font-bold block">Total Products</span>
            <span className="text-2xl font-black text-white">{inventory.length}</span>
          </div>
          <div className="bg-[#1e2632] border border-amber-800/30 p-4 rounded-2xl">
            <span className="text-xs text-amber-400 font-bold block flex items-center gap-1"><AlertTriangle size={11} /> Low Stock (≤{LOW_STOCK_THRESHOLD})</span>
            <span className="text-2xl font-black text-amber-400">{lowStockCount}</span>
          </div>
          {savedSuccess && (
            <div className="bg-emerald-950/30 border border-emerald-800/30 p-4 rounded-2xl flex items-center gap-2">
              <span className="text-xs text-[#0aad0a] font-bold">✓ Stock levels saved to database</span>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="bg-[#1e2632] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search product or category..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#0aad0a]" />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={filterLowStockOnly} onChange={(e) => setFilterLowStockOnly(e.target.checked)} className="accent-amber-400" />
            <span className="text-xs font-bold text-amber-400">Low Stock Only</span>
          </label>
        </div>

        {/* Table */}
        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
              <p className="text-xs text-gray-400">Loading stock levels from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Boxes size={36} className="mx-auto text-gray-500" />
              <h4 className="text-sm font-bold">No products found</h4>
              <p className="text-xs text-gray-400">
                {inventory.length === 0 ? 'No products in database yet. Add products from the Products page first.' : 'No products match your search.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Product Name</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Stock Level</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300 font-medium">
                  {filtered.map((item) => {
                    const isLow = item.stock <= LOW_STOCK_THRESHOLD;
                    return (
                      <tr key={item.id} className={`hover:bg-gray-800/40 transition-colors ${isLow ? 'bg-amber-950/10' : ''}`}>
                        <td className="py-3 px-3">
                          <span className="font-bold text-white">{item.name}</span>
                        </td>
                        <td className="py-3 px-3 capitalize text-gray-400">{item.category}</td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={item.stock}
                            min={0}
                            onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-20 bg-gray-900 border border-gray-700 text-white rounded-lg p-1.5 text-xs text-center focus:outline-none focus:border-[#0aad0a] font-bold font-mono"
                          />
                          {pendingUpdates[item.id] !== undefined && (
                            <span className="ml-2 text-[10px] text-amber-400 font-bold">Unsaved</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${isLow ? 'bg-amber-950/40 text-amber-400' : 'bg-emerald-950/40 text-[#0aad0a]'}`}>
                            {isLow ? <AlertTriangle size={10} /> : '●'} {isLow ? 'Low Stock' : 'In Stock'}
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
  );
}
