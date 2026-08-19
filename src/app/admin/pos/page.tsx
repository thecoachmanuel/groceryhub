'use client';

import { useState, useEffect } from 'react';
import { 
  Barcode, 
  Search, 
  Plus, 
  Minus, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Printer, 
  X,
  Store
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface PosProduct {
  _id: string;
  name: string;
  seller_id?: number;
  category_name?: string;
  price: number;
  special_price?: number;
  barcode?: string;
  stock: number;
  image?: string;
}

interface PosCartItem {
  product: PosProduct;
  quantity: number;
}

interface PosSession {
  _id?: string;
  session_id: string;
  name: string;
  customer_name: string;
  customer_mobile: string;
  items: PosCartItem[];
}

export default function AdminPosPage() {
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [selectedSellerFilter, setSelectedSellerFilter] = useState<string>('all');
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [sessions, setSessions] = useState<PosSession[]>([
    {
      session_id: 'SESSION-1',
      name: 'Counter Tab 1',
      customer_name: 'Walk-in Customer',
      customer_mobile: '',
      items: [],
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('SESSION-1');

  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  const [additionalCharges, setAdditionalCharges] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'CARD' | 'WALLET'>('CASH');

  const [printedReceipt, setPrintedReceipt] = useState<any | null>(null);
  const [taxRate, setTaxRate] = useState<number>(7.5);

  useEffect(() => {
    async function loadTaxRate() {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.data && json.data.taxRate !== undefined) {
          setTaxRate(json.data.taxRate);
        }
      } catch (err) {
        console.warn('Error loading POS tax rate:', err);
      }
    }
    loadTaxRate();
  }, []);

  const activeSession = sessions.find((s) => s.session_id === activeSessionId) || sessions[0];

  const fetchSellers = async () => {
    try {
      const res = await fetch('/api/admin/sellers');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSellers(data.data);
      }
    } catch (err) {
      console.error('Error fetching sellers list:', err);
    }
  };

  const fetchProducts = async (sellerIdStr = 'all') => {
    try {
      setLoadingProducts(true);
      const url = sellerIdStr !== 'all' ? `/api/admin/pos/products?seller_id=${sellerIdStr}` : '/api/admin/pos/products';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || data.products || []);
      }
    } catch (err) {
      console.error('Error fetching POS products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/pos/sessions');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const mapped = data.data.map((s: any) => ({
          _id: s._id,
          session_id: s.session_id,
          name: s.name || s.session_id,
          customer_name: s.customer_name || 'Walk-in Customer',
          customer_mobile: s.customer_mobile || '',
          items: (s.items || []).map((i: any) => ({
            product: {
              _id: i.product_id,
              name: i.product_name,
              price: i.price,
              stock: i.stock || 100,
            },
            quantity: i.quantity,
          })),
        }));
        setSessions(mapped);
        setActiveSessionId(mapped[0].session_id);
      }
    } catch (err) {
      console.error('Error fetching POS sessions:', err);
    }
  };

  useEffect(() => {
    fetchSellers();
    fetchProducts('all');
    fetchSessions();
  }, []);

  const handleSellerFilterChange = (newSellerId: string) => {
    setSelectedSellerFilter(newSellerId);
    fetchProducts(newSellerId);
  };

  const updateActiveSession = (updater: (prev: PosSession) => PosSession) => {
    setSessions((prev) => prev.map((s) => (s.session_id === activeSession.session_id ? updater(s) : s)));
  };

  const handleAddNewSession = async () => {
    const nextNum = sessions.length + 1;
    const newSession: PosSession = {
      session_id: `SESSION-${Date.now()}`,
      name: `Counter Tab ${nextNum}`,
      customer_name: 'Walk-in Customer',
      customer_mobile: '',
      items: [],
    };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.session_id);

    try {
      await fetch('/api/admin/pos/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: newSession.session_id,
          name: newSession.name,
          customer_name: newSession.customer_name,
          items: [],
        }),
      });
    } catch (err) {
      console.error('Error creating POS session:', err);
    }
  };

  const handleCloseSession = async (sessId: string) => {
    if (sessions.length === 1) return alert('At least one POS Terminal tab must remain open.');
    const remaining = sessions.filter((s) => s.session_id !== sessId);
    setSessions(remaining);
    if (activeSessionId === sessId) {
      setActiveSessionId(remaining[0].session_id);
    }
    try {
      await fetch(`/api/admin/pos/sessions?session_id=${sessId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const addToCart = (product: PosProduct) => {
    updateActiveSession((sess) => {
      const existing = sess.items.find((item) => String(item.product._id) === String(product._id));
      if (existing) {
        return {
          ...sess,
          items: sess.items.map((item) =>
            String(item.product._id) === String(product._id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...sess,
        items: [...sess.items, { product, quantity: 1 }],
      };
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    updateActiveSession((sess) => ({
      ...sess,
      items: sess.items
        .map((item) => {
          if (String(item.product._id) === String(productId)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[],
    }));
  };

  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const found = products.find(
      (p) => p.barcode === barcodeInput.trim() || p.name.toLowerCase().includes(barcodeInput.toLowerCase())
    );
    if (found) {
      addToCart(found);
      setBarcodeInput('');
    } else {
      alert(`No product found matching ${barcodeInput}`);
    }
  };

  const subtotal = activeSession.items.reduce(
    (acc, item) => acc + (item.product.special_price || item.product.price) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const grandTotal = Math.max(0, subtotal + tax + additionalCharges - discountAmount);

  const handleCheckout = async () => {
    try {
      const sellerIdNum = selectedSellerFilter !== 'all' ? Number(selectedSellerFilter) : 1;
      const res = await fetch('/api/admin/pos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession.session_id,
          seller_id: sellerIdNum,
          customer_name: activeSession.customer_name,
          customer_mobile: activeSession.customer_mobile,
          payment_method: paymentMode,
          items: activeSession.items.map((i) => ({
            product_id: i.product._id,
            product_name: i.product.name,
            price: i.product.special_price || i.product.price,
            quantity: i.quantity,
          })),
          subtotal,
          tax,
          additional_charges: additionalCharges,
          discount_amount: discountAmount,
          final_total: grandTotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPrintedReceipt(data.order);
        setPaymentModalOpen(false);

        // Reset current session
        updateActiveSession((sess) => ({
          ...sess,
          items: [],
          customer_name: 'Walk-in Customer',
          customer_mobile: '',
        }));
        fetchProducts(selectedSellerFilter);
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (err) {
      console.error('POS Checkout Error:', err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery))
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Barcode size={24} className="text-[#0aad0a]" /> POS Register Terminal
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Live counter point-of-sale connected to MongoDB inventory, hold tabs, &amp; 80mm thermal receipt printing
            </p>
          </div>

          {/* Hold Tabs & Vendor Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 bg-[#1e2632] border border-gray-800 rounded-2xl px-3 py-1.5">
              <Store size={14} className="text-[#0aad0a]" />
              <select
                value={selectedSellerFilter}
                onChange={(e) => handleSellerFilterChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-gray-900">All Vendor Stores</option>
                {sellers.map((s) => (
                  <option key={s._id || s.seller_id} value={s.seller_id || s._id} className="bg-gray-900">
                    {s.store_name || s.name || `Store #${s.seller_id}`}
                  </option>
                ))}
              </select>
            </div>

            {sessions.map((sess) => (
              <div
                key={sess.session_id}
                onClick={() => setActiveSessionId(sess.session_id)}
                className={`px-4 py-2 rounded-2xl text-xs font-black cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeSessionId === sess.session_id
                    ? 'bg-[#0aad0a] text-white shadow-lg shadow-[#0aad0a]/30'
                    : 'bg-[#1e2632] border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <span>{sess.name}</span>
                <span className="bg-black/30 px-1.5 py-0.2 rounded-md font-mono text-[10px]">
                  {sess.items.reduce((s, i) => s + i.quantity, 0)} items
                </span>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseSession(sess.session_id);
                    }}
                    className="p-0.5 hover:bg-black/40 rounded-full text-white/80 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleAddNewSession}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-3 py-2 rounded-2xl flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <Plus size={14} /> <span>Open Hold Tab</span>
            </button>
          </div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Products Picker (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search and Barcode Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <form onSubmit={handleBarcodeScan} className="relative">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Scan barcode or enter SKU..."
                  className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                />
                <Barcode size={16} className="absolute left-3.5 top-3 text-gray-400" />
              </form>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog products..."
                  className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
                <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>

            {/* Products Grid */}
            {loadingProducts ? (
              <div className="text-center py-12 text-gray-400 text-xs">Loading live POS catalog...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">No catalog products match search for selected vendor.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => addToCart(product)}
                    className="bg-[#1e2632] border border-gray-800 hover:border-[#0aad0a]/60 rounded-2xl p-3 flex flex-col justify-between space-y-2 cursor-pointer transition-all hover:scale-[1.02] group"
                  >
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150'}
                      alt={product.name}
                      className="w-full h-24 rounded-xl object-cover border border-gray-700 bg-gray-900"
                    />
                    <div className="space-y-1">
                      <div className="font-bold text-white text-xs truncate group-hover:text-[#0aad0a] transition-colors">
                        {product.name}
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-black text-[#0aad0a] font-mono">
                          {formatNaira(product.special_price || product.price)}
                        </span>
                        <span className="text-gray-400 font-mono text-[10px]">{product.stock} in stock</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Active Terminal Session Cart & Settlement (5 cols) */}
          <div className="lg:col-span-5 bg-[#1e2632] border border-gray-800 rounded-3xl p-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Header Customer Info */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 text-xs">
                <div>
                  <h3 className="font-black text-white">{activeSession.name}</h3>
                  <span className="text-[11px] text-[#0aad0a]">Active Counter Tab</span>
                </div>
                <div className="text-right">
                  <input
                    type="text"
                    value={activeSession.customer_name}
                    onChange={(e) => updateActiveSession((s) => ({ ...s, customer_name: e.target.value }))}
                    placeholder="Customer Name"
                    className="bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-1 text-xs text-white font-bold w-36 text-right focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 divide-y divide-gray-800/60">
                {activeSession.items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs space-y-1">
                    <Barcode size={28} className="mx-auto text-gray-600" />
                    <p>No items in cart tab. Scan barcode or tap catalog products.</p>
                  </div>
                ) : (
                  activeSession.items.map((item) => (
                    <div key={item.product._id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="truncate flex-1">
                        <div className="font-bold text-white truncate">{item.product.name}</div>
                        <span className="font-mono text-[#0aad0a] text-[11px]">
                          {formatNaira(item.product.special_price || item.product.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, -1)}
                          className="w-6 h-6 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, 1)}
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

            {/* Calculations & Discounts */}
            <div className="space-y-2.5 pt-3 border-t border-gray-800 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({activeSession.items.reduce((s, i) => s + i.quantity, 0)} Items)</span>
                <span className="font-mono text-white font-bold">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>VAT / Tax (5%)</span>
                <span className="font-mono text-white font-bold">{formatNaira(tax)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1">Add Fee (₦)</label>
                  <input
                    type="number"
                    value={additionalCharges || ''}
                    onChange={(e) => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1">Discount (₦)</label>
                  <input
                    type="number"
                    value={discountAmount || ''}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-gray-800">
                <span>Total Payable</span>
                <span className="font-mono text-xl text-[#0aad0a]">{formatNaira(grandTotal)}</span>
              </div>

              <button
                disabled={activeSession.items.length === 0}
                onClick={() => setPaymentModalOpen(true)}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-40 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
              >
                <CreditCard size={16} />
                <span>Collect Tender • {formatNaira(grandTotal)}</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Tender Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">Collect Tender</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Total Due: <span className="text-[#0aad0a] font-mono font-bold text-sm">{formatNaira(grandTotal)}</span>
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-300">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CASH', label: 'Cash (Drawer)', icon: DollarSign },
                  { id: 'CARD', label: 'POS Terminal', icon: CreditCard },
                  { id: 'WALLET', label: 'Store Wallet', icon: Smartphone },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMode(mode.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMode === mode.id
                          ? 'border-[#0aad0a] bg-[#0aad0a]/10 text-[#0aad0a]'
                          : 'border-gray-700 bg-gray-900 text-gray-400'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCheckout}
                className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                Confirm Sale &amp; Print Thermal Receipt
              </button>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 80mm Thermal Receipt Print Modal */}
      {printedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-gray-950 w-full max-w-sm rounded-3xl p-6 space-y-4 relative font-mono text-xs shadow-2xl">
            <button
              onClick={() => setPrintedReceipt(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1 border-b border-dashed border-gray-300 pb-3">
              <h2 className="font-black text-base font-sans">GroceryHub Supermarket</h2>
              <p className="text-[11px] text-gray-500">POS Counter • Victoria Island, Lagos</p>
              <p className="text-[10px] text-gray-400">{new Date(printedReceipt.createdAt || Date.now()).toLocaleString()}</p>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Order Ref:</span>
                <span className="font-bold">{printedReceipt.order_id || printedReceipt._id}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{printedReceipt.customer_name || 'Walk-in Customer'}</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-gray-300 py-2 space-y-1.5">
              {(printedReceipt.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span className="truncate max-w-[160px]">{item.product_name || item.title} x{item.quantity}</span>
                  <span className="font-bold">{formatNaira(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatNaira(printedReceipt.total_amount)}</span>
              </div>
              <div className="flex justify-between font-black text-sm font-sans pt-1 border-t border-gray-200">
                <span>Grand Total:</span>
                <span>{formatNaira(printedReceipt.final_total || printedReceipt.total_amount)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Payment Tender:</span>
                <span className="uppercase font-bold">{printedReceipt.payment_method}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-2.5 rounded-xl font-sans text-xs flex items-center justify-center gap-1.5"
              >
                <Printer size={14} /> Print 80mm Receipt
              </button>
              <button
                onClick={() => setPrintedReceipt(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl font-sans text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
