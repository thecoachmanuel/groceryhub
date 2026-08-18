'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { formatNaira } from '@/lib/currency';

export interface CartItem {
  id: number;
  product_id: number;
  variant_id: number;
  name: string;
  variant_title: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  onUpdateQty?: (id: number, qty: number) => void;
  onRemoveItem?: (id: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQty,
  onRemoveItem,
}: CartDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const itemTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = itemTotal >= 15000 || items.length === 0 ? 0 : 1500;
  const grandTotal = itemTotal + deliveryFee;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md bg-white dark:bg-[#1a222d] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0aad0a]/10 text-[#0aad0a] flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">Your Grocery Cart</h3>
                <p className="text-xs text-gray-400">{items.length} items in basket</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                  <ShoppingBag size={28} />
                </div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Your cart is empty</h4>
                <p className="text-xs text-gray-400 max-w-xs">
                  Discover fresh farm produce, organic fruits, and pantry staples today!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-800"
                >
                  <div className="relative w-16 h-16 rounded-xl bg-white dark:bg-gray-800 flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-700">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300'}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-400">{item.variant_title}</p>
                    <div className="text-sm font-black text-gray-900 dark:text-white mt-1 font-mono">
                      {formatNaira(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
                    <button
                      onClick={() => onUpdateQty?.(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                    >
                      {item.quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                    </button>
                    <span className="text-xs font-bold w-4 text-center text-gray-800 dark:text-gray-200 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQty?.(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white font-mono">{formatNaira(itemTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-[#0aad0a]">
                    {deliveryFee === 0 ? 'FREE' : formatNaira(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total Amount</span>
                  <span className="font-mono text-[#0aad0a] text-base">{formatNaira(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-between shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{formatNaira(grandTotal)}</span>
                  <ArrowRight size={18} />
                </div>
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
                <ShieldCheck size={14} className="text-[#0aad0a]" />
                <span>100% Safe Paystack Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
