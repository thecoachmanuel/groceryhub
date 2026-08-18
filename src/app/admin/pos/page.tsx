'use client';

import { useState } from 'react';
import { 
  Barcode, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  User, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Store, 
  Layers, 
  Receipt,
  RotateCcw,
  Sparkles,
  Smartphone,
  X
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatNaira } from '@/lib/currency';

interface PosProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  barcode: string;
  stock: number;
  image: string;
}

interface PosCartItem {
  product: PosProduct;
  quantity: number;
}

interface PosTerminalSession {
  id: string;
  name: string;
  customerName: string;
  customerMobile: string;
  items: PosCartItem[];
  appliedDiscount: number;
}

const POS_PRODUCTS: PosProduct[] = [
  { id: 1, name: 'Organic Honeycrisp Apples (1kg)', category: 'Fruits', price: 4500, barcode: '890123450001', stock: 45, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150' },
  { id: 2, name: 'Farm Fresh Hass Avocados (Pack of 4)', category: 'Vegetables', price: 3800, barcode: '890123450002', stock: 30, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150' },
  { id: 3, name: 'Artisanal Sourdough Country Loaf', category: 'Bakery', price: 3200, barcode: '890123450003', stock: 18, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150' },
  { id: 4, name: 'Pasture-Raised Grade A Eggs (Dozen)', category: 'Dairy', price: 4200, barcode: '890123450004', stock: 50, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=150' },
  { id: 5, name: 'Cold-Pressed Valencia Orange Juice (1L)', category: 'Beverages', price: 3500, barcode: '890123450005', stock: 22, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150' },
  { id: 6, name: 'Organic Raw Wildflower Honey (500g)', category: 'Pantry', price: 6500, barcode: '890123450006', stock: 15, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=150' },
];

const INITIAL_TERMINALS: PosTerminalSession[] = [
  {
    id: 'TERM-1',
    name: 'Terminal 1 (Counter Main)',
    customerName: 'Walk-in Customer',
    customerMobile: '',
    items: [
      { product: POS_PRODUCTS[0], quantity: 2 },
      { product: POS_PRODUCTS[3], quantity: 1 },
    ],
    appliedDiscount: 0,
  },
  {
    id: 'TERM-2',
    name: 'Terminal 2 (Express Lane)',
    customerName: 'Amina Bello',
    customerMobile: '+234 803 111 2222',
    items: [
      { product: POS_PRODUCTS[1], quantity: 1 },
    ],
    appliedDiscount: 0,
  },
];

export default function AdminPosPage() {
  const [terminals, setTerminals] = useState<PosTerminalSession[]>(INITIAL_TERMINALS);
  const [activeTerminalId, setActiveTerminalId] = useState<string>('TERM-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'card' | 'paystack_qr'>('cash');
  const [orderReceipt, setOrderReceipt] = useState<any | null>(null);

  const activeTerminal = terminals.find((t) => t.id === activeTerminalId) || terminals[0];

  const updateActiveTerminal = (updater: (prev: PosTerminalSession) => PosTerminalSession) => {
    setTerminals((prev) => prev.map((t) => (t.id === activeTerminal.id ? updater(t) : t)));
  };

  const handleAddNewTerminal = () => {
    const nextNum = terminals.length + 1;
    const newTerm: PosTerminalSession = {
      id: `TERM-${nextNum}`,
      name: `Terminal ${nextNum} (Hold Cart)`,
      customerName: 'Walk-in Customer',
      customerMobile: '',
      items: [],
      appliedDiscount: 0,
    };
    setTerminals([...terminals, newTerm]);
    setActiveTerminalId(newTerm.id);
  };

  const handleCloseTerminal = (termId: string) => {
    if (terminals.length === 1) return alert('At least one POS Terminal must remain active.');
    const remaining = terminals.filter((t) => t.id !== termId);
    setTerminals(remaining);
    if (activeTerminalId === termId) {
      setActiveTerminalId(remaining[0].id);
    }
  };

  const addToCart = (product: PosProduct) => {
    updateActiveTerminal((term) => {
      const existing = term.items.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          ...term,
          items: term.items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        ...term,
        items: [...term.items, { product, quantity: 1 }],
      };
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    updateActiveTerminal((term) => ({
      ...term,
      items: term.items
        .map((item) => {
          if (item.product.id === productId) {
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
    const found = POS_PRODUCTS.find(
      (p) => p.barcode === barcodeInput.trim() || p.name.toLowerCase().includes(barcodeInput.toLowerCase())
    );
    if (found) {
      addToCart(found);
      setBarcodeInput('');
    } else {
      alert(`No product found with barcode ${barcodeInput}`);
    }
  };

  // Totals
  const subtotal = activeTerminal.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% VAT
  const total = Math.max(0, subtotal + tax - activeTerminal.appliedDiscount);

  const handleCompleteSale = () => {
    const receipt = {
      receiptNumber: `POS-${Date.now().toString().slice(-6)}`,
      terminalName: activeTerminal.name,
      customer: activeTerminal.customerName,
      items: [...activeTerminal.items],
      subtotal,
      tax,
      total,
      paymentMode,
      date: new Date().toLocaleString(),
    };
    setOrderReceipt(receipt);
    setPaymentModalOpen(false);

    // Reset active terminal cart items
    updateActiveTerminal((term) => ({
      ...term,
      items: [],
      customerName: 'Walk-in Customer',
      customerMobile: '',
      appliedDiscount: 0,
    }));
  };

  const filteredProducts = POS_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Top Bar with Multi-Terminal Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Barcode size={24} className="text-[#0aad0a]" /> POS Register Terminal
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Multi-cart counter checkout with instant barcode scan, hold tabs, and Paystack/Cash payments in Naira (₦)
            </p>
          </div>

          {/* Multi-Terminal Tabs Bar */}
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
              <Plus size={14} /> <span>Open Tab</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Catalog Left / Active Terminal Cart Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Product Picker (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Barcode & Search Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <form onSubmit={handleBarcodeScan} className="relative">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Scan barcode (e.g. 890123450001)..."
                  className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-[#0aad0a]"
                />
                <Barcode size={16} className="absolute left-3.5 top-3 text-gray-400" />
              </form>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or categories..."
                  className="w-full bg-[#1e2632] border border-gray-800 text-white rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
                />
                <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-[#1e2632] border border-gray-800 hover:border-[#0aad0a]/60 rounded-2xl p-3 flex flex-col justify-between space-y-2 cursor-pointer transition-all hover:scale-[1.02] group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-24 rounded-xl object-cover border border-gray-700 bg-gray-900"
                  />
                  <div className="space-y-1">
                    <div className="font-bold text-white text-xs truncate group-hover:text-[#0aad0a] transition-colors">
                      {product.name}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-black text-[#0aad0a] font-mono">{formatNaira(product.price)}</span>
                      <span className="text-gray-400 font-mono text-[10px]">{product.stock} in stock</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Active Terminal Cart & Tender (5 cols) */}
          <div className="lg:col-span-5 bg-[#1e2632] border border-gray-800 rounded-3xl p-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Terminal Header Info */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 text-xs">
                <div>
                  <h3 className="font-black text-white">{activeTerminal.name}</h3>
                  <span className="text-[11px] text-[#0aad0a]">Active Session</span>
                </div>
                <div className="text-right">
                  <input
                    type="text"
                    value={activeTerminal.customerName}
                    onChange={(e) => updateActiveTerminal((t) => ({ ...t, customerName: e.target.value }))}
                    placeholder="Customer Name"
                    className="bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-1 text-xs text-white font-bold w-36 text-right focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 divide-y divide-gray-800/60">
                {activeTerminal.items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs space-y-1">
                    <Barcode size={28} className="mx-auto text-gray-600" />
                    <p>No items in this terminal tab. Scan barcode or tap products.</p>
                  </div>
                ) : (
                  activeTerminal.items.map((item) => (
                    <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="truncate flex-1">
                        <div className="font-bold text-white truncate">{item.product.name}</div>
                        <span className="font-mono text-[#0aad0a] text-[11px]">{formatNaira(item.product.price)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="w-20 text-right font-mono font-black text-white">
                        {formatNaira(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bill Calculation & Tender CTA */}
            <div className="space-y-3 pt-3 border-t border-gray-800 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({activeTerminal.items.reduce((s, i) => s + i.quantity, 0)} Items)</span>
                <span className="font-mono text-white font-bold">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>VAT / Tax (5%)</span>
                <span className="font-mono text-white font-bold">{formatNaira(tax)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-gray-800">
                <span>Total Payable</span>
                <span className="font-mono text-xl text-[#0aad0a]">{formatNaira(total)}</span>
              </div>

              <button
                disabled={activeTerminal.items.length === 0}
                onClick={() => setPaymentModalOpen(true)}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-40 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
              >
                <CreditCard size={16} />
                <span>Collect Tender • {formatNaira(total)}</span>
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
                Total Due: <span className="text-[#0aad0a] font-mono font-bold text-sm">{formatNaira(total)}</span>
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-300">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash', label: 'Cash (COD)', icon: DollarSign },
                  { id: 'card', label: 'POS Terminal', icon: CreditCard },
                  { id: 'paystack_qr', label: 'Paystack QR', icon: Smartphone },
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
                onClick={handleCompleteSale}
                className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                Confirm Sale &amp; Print Receipt
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

      {/* Thermal Receipt Print Modal */}
      {orderReceipt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-gray-950 w-full max-w-sm rounded-3xl p-6 space-y-4 relative font-mono text-xs shadow-2xl">
            <button
              onClick={() => setOrderReceipt(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1 border-b border-dashed border-gray-300 pb-3">
              <h2 className="font-black text-base font-sans">GroceryHub Supermarket</h2>
              <p className="text-[11px] text-gray-500">Victoria Island, Lagos • +234 800 123 4567</p>
              <p className="text-[10px] text-gray-400">{orderReceipt.date}</p>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Receipt:</span>
                <span className="font-bold">{orderReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Terminal:</span>
                <span>{orderReceipt.terminalName}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{orderReceipt.customer}</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-gray-300 py-2 space-y-1.5">
              {orderReceipt.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span className="truncate max-w-[160px]">{item.product.name} x{item.quantity}</span>
                  <span className="font-bold">{formatNaira(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatNaira(orderReceipt.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (5%):</span>
                <span>{formatNaira(orderReceipt.tax)}</span>
              </div>
              <div className="flex justify-between font-black text-sm font-sans pt-1 border-t border-gray-200">
                <span>Total:</span>
                <span>{formatNaira(orderReceipt.total)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Tender Mode:</span>
                <span className="uppercase font-bold">{orderReceipt.paymentMode}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-2.5 rounded-xl font-sans text-xs flex items-center justify-center gap-1.5"
              >
                <Printer size={14} /> Print Receipt
              </button>
              <button
                onClick={() => setOrderReceipt(null)}
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
