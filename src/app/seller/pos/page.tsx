'use client';

import { useState, useEffect } from 'react';
import { 
  Barcode, 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  DollarSign, 
  CheckCircle2,
  X,
  Smartphone
} from 'lucide-react';
import SellerNav from '@/components/seller/SellerNav';
import { formatNaira } from '@/lib/currency';
import { useSellerAuth } from '@/context/AuthContext';

interface PosProduct {
  _id: string;
  name: string;
  category?: string;
  price: number;
  special_price?: number;
  barcode?: string;
  stock?: number;
  image?: string;
  unit?: string;
}

interface PosItem {
  product: PosProduct;
  quantity: number;
}

interface SellerTerminalSession {
  id: string;
  name: string;
  customerMobile: string;
  customerName: string;
  items: PosItem[];
}

export default function PosTerminalPage() {
  const { seller } = useSellerAuth();
  const sellerId = seller?.id || 1;

  const [products, setProducts] = useState<PosProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [terminals, setTerminals] = useState<SellerTerminalSession[]>([
    {
      id: 'TERM-1',
      name: 'Counter 1 (Main Register)',
      customerName: 'Walk-in Customer',
      customerMobile: '',
      items: [],
    },
  ]);
  const [activeTerminalId, setActiveTerminalId] = useState<string>('TERM-1');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'CARD' | 'WALLET'>('CASH');

  const fetchSellerProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(`/api/admin/pos/products?seller_id=${sellerId}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || data.products || []);
      }
    } catch (err) {
      console.error('Error fetching seller POS products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [sellerId]);

  const activeTerminal = terminals.find((t) => t.id === activeTerminalId) || terminals[0];

  const updateActiveTerminal = (updater: (prev: SellerTerminalSession) => SellerTerminalSession) => {
    setTerminals((prev) => prev.map((t) => (t.id === activeTerminal.id ? updater(t) : t)));
  };

  const handleAddNewTerminal = () => {
    const nextNum = terminals.length + 1;
    const newTerm: SellerTerminalSession = {
      id: `TERM-${nextNum}`,
      name: `Counter ${nextNum} (Hold Cart)`,
      customerName: 'Walk-in Customer',
      customerMobile: '',
      items: [],
    };
    setTerminals([...terminals, newTerm]);
    setActiveTerminalId(newTerm.id);
  };

  const handleCloseTerminal = (termId: string) => {
    if (terminals.length === 1) return alert('At least one terminal session must remain open.');
    const remaining = terminals.filter((t) => t.id !== termId);
    setTerminals(remaining);
    if (activeTerminalId === termId) {
      setActiveTerminalId(remaining[0].id);
    }
  };

  const addToCart = (product: PosProduct) => {
    updateActiveTerminal((term) => {
      const idx = term.items.findIndex((item) => String(item.product._id) === String(product._id));
      if (idx > -1) {
        const copy = [...term.items];
        copy[idx].quantity += 1;
        return { ...term, items: copy };
      }
      return {
        ...term,
        items: [...term.items, { product, quantity: 1 }],
      };
    });
  };

  const updateQty = (productId: string, delta: number) => {
    updateActiveTerminal((term) => ({
      ...term,
      items: term.items
        .map((item) => {
          if (String(item.product._id) === String(productId)) {
            const q = item.quantity + delta;
            return q > 0 ? { ...item, quantity: q } : null;
          }
          return item;
        })
        .filter(Boolean) as PosItem[],
    }));
  };

  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const prod = products.find(
      (p) => p.barcode === barcodeInput.trim() || p.name.toLowerCase().includes(barcodeInput.toLowerCase())
    );
    if (prod) {
      addToCart(prod);
      setBarcodeInput('');
    } else {
      alert(`Barcode ${barcodeInput} not found in catalog.`);
    }
  };

  const subtotal = activeTerminal.items.reduce(
    (sum, item) => sum + (item.product.special_price || item.product.price) * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCompleteSale = async () => {
    try {
      await fetch('/api/admin/pos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: sellerId,
          customer_name: activeTerminal.customerName,
          customer_mobile: activeTerminal.customerMobile,
          payment_method: paymentMode,
          items: activeTerminal.items.map((i) => ({
            product_id: i.product._id,
            product_name: i.product.name,
            price: i.product.special_price || i.product.price,
            quantity: i.quantity,
          })),
          subtotal,
          tax,
          final_total: total,
        }),
      });

      setShowPaymentModal(false);
      setPaymentSuccess(true);
      updateActiveTerminal((term) => ({
        ...term,
        items: [],
        customerName: 'Walk-in Customer',
        customerMobile: '',
      }));
      setTimeout(() => setPaymentSuccess(false), 4000);
      fetchSellerProducts();
    } catch (err) {
      console.error('Error completing seller POS sale:', err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <SellerNav />

        <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 w-full">
          {/* Header & Terminal Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Barcode size={24} className="text-[#0aad0a]" /> Store POS Counter Terminal ({seller?.storeName || 'Vendor Store'})
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Physical counter checkout, barcode scanning, hold carts, and instant thermal receipts in Naira (₦)
              </p>
            </div>

            {/* Multi-Terminal Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {terminals.map((term) => (
                <div
                  key={term.id}
                  onClick={() => setActiveTerminalId(term.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTerminalId === term.id
                      ? 'bg-[#0aad0a] text-white shadow-lg shadow-[#0aad0a]/30'
                      : 'bg-[#1e2632] border border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{term.name}</span>
                  <span className="bg-black/30 px-1.5 py-0.2 rounded-md font-mono text-[10px]">
                    {term.items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                  {terminals.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTerminal(term.id);
                      }}
                      className="p-0.5 hover:bg-black/40 rounded-full text-white/80 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddNewTerminal}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-3 py-2 rounded-2xl flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <Plus size={14} /> <span>Open Counter Tab</span>
              </button>
            </div>
          </div>

          {paymentSuccess && (
            <div className="bg-emerald-950/60 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-bounce">
              <CheckCircle2 size={18} /> Transaction completed successfully! Receipt generated in Naira (₦).
            </div>
          )}

          {/* POS Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Product Catalog (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <form onSubmit={handleScanBarcode} className="relative">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan barcode..."
                    className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-3 pl-11 pr-4 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                  <Barcode size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                </form>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vendor products..."
                    className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                  <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              {loadingProducts ? (
                <div className="text-center py-12 text-gray-400 text-xs">Loading store products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">No vendor products found in stock.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod._id}
                      onClick={() => addToCart(prod)}
                      className="bg-[#1e2632] border border-gray-800 hover:border-[#0aad0a]/60 rounded-2xl p-3 flex flex-col justify-between space-y-2 cursor-pointer transition-all hover:scale-[1.02] group"
                    >
                      <img
                        src={prod.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300'}
                        alt={prod.name}
                        className="w-full h-24 rounded-xl object-cover border border-gray-700 bg-gray-900"
                      />
                      <div className="space-y-1">
                        <div className="font-bold text-white text-xs truncate group-hover:text-[#0aad0a] transition-colors">
                          {prod.name}
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-black text-[#0aad0a] font-mono">
                            {formatNaira(prod.special_price || prod.price)}
                          </span>
                          <span className="text-gray-400 font-mono text-[10px]">{prod.stock || 100} in stock</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Cart & Tender (5 cols) */}
            <div className="lg:col-span-5 bg-[#1e2632] border border-gray-800 rounded-3xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 text-xs">
                  <div>
                    <h3 className="font-black text-white">{activeTerminal.name}</h3>
                    <span className="text-[11px] text-[#0aad0a]">Active Session</span>
                  </div>
                  <input
                    type="text"
                    value={activeTerminal.customerName}
                    onChange={(e) => updateActiveTerminal((t) => ({ ...t, customerName: e.target.value }))}
                    placeholder="Customer Name"
                    className="bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-1 text-xs text-white font-bold w-36 text-right focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 divide-y divide-gray-800/60">
                  {activeTerminal.items.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-xs space-y-1">
                      <Barcode size={28} className="mx-auto text-gray-600" />
                      <p>No items in this terminal. Tap product tiles or scan barcode.</p>
                    </div>
                  ) : (
                    activeTerminal.items.map((item) => (
                      <div key={item.product._id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                        <div className="truncate flex-1">
                          <div className="font-bold text-white truncate">{item.product.name}</div>
                          <span className="font-mono text-[#0aad0a] text-[11px]">
                            {formatNaira(item.product.special_price || item.product.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.product._id, -1)}
                            className="w-6 h-6 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center font-mono font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.product._id, 1)}
                            className="w-6 h-6 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="w-20 text-right font-mono font-black text-white">
                          {formatNaira((item.product.special_price || item.product.price) * item.quantity)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bill in Naira & Tender */}
              <div className="space-y-3 pt-3 border-t border-gray-800 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white font-bold">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>VAT (5%)</span>
                  <span className="font-mono text-white font-bold">{formatNaira(tax)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-gray-800">
                  <span>Total Payable</span>
                  <span className="font-mono text-xl text-[#0aad0a]">{formatNaira(total)}</span>
                </div>

                <button
                  disabled={activeTerminal.items.length === 0}
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-40 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
                >
                  <CreditCard size={16} />
                  <span>Collect Tender • {formatNaira(total)}</span>
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Tender Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">Collect POS Tender</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Total Due: <span className="text-[#0aad0a] font-mono font-bold text-sm">{formatNaira(total)}</span>
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-300">Tender Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CASH', label: 'Cash (Naira)', icon: DollarSign },
                  { id: 'CARD', label: 'POS Terminal', icon: CreditCard },
                  { id: 'WALLET', label: 'Store Wallet', icon: Smartphone },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMode(m.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMode === m.id
                          ? 'border-[#0aad0a] bg-[#0aad0a]/10 text-[#0aad0a]'
                          : 'border-gray-700 bg-gray-900 text-gray-400'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCompleteSale}
                className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                Confirm Tender &amp; Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
