'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number | string;
  product_id?: number | string;
  name: string;
  seller_name?: string;
  price: number;
  original_price?: number;
  quantity: number;
  unit?: string;
  image?: string;
  category?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isLoaded: boolean;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'groceryhub_cart_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Read initial cart items from localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const readCart = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        }
      } catch (e) {
        console.warn('Error loading cart from localStorage:', e);
      } finally {
        setIsLoaded(true);
      }
    };

    readCart();

    const handleCartSync = () => readCart();
    window.addEventListener('storage', handleCartSync);
    window.addEventListener('groceryhub_cart_updated', handleCartSync);

    return () => {
      window.removeEventListener('storage', handleCartSync);
      window.removeEventListener('groceryhub_cart_updated', handleCartSync);
    };
  }, []);

  // Save changes to localStorage and notify other components
  const persistCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        window.dispatchEvent(new Event('groceryhub_cart_updated'));
      } catch (e) {
        console.error('Failed to write cart to localStorage:', e);
      }
    }
  };

  const addToCart = (product: any, quantityToAdd: number = 1) => {
    if (!product) return;
    const productId = product.id || product.product_id || product._id;
    const productName = product.name || product.title || product.product_name || 'Grocery Item';
    const productPrice = Number(product.price || product.discounted_price || product.market_price || 0);
    const productImage = product.image || product.thumbnail || product.images?.[0] || '';
    const productUnit = product.unit || product.weight || product.variant || '1 pack';

    const existingIdx = cartItems.findIndex(
      (item) => String(item.id) === String(productId) || String(item.product_id) === String(productId)
    );

    let updated: CartItem[];
    if (existingIdx > -1) {
      updated = [...cartItems];
      updated[existingIdx] = {
        ...updated[existingIdx],
        quantity: updated[existingIdx].quantity + quantityToAdd,
      };
    } else {
      updated = [
        ...cartItems,
        {
          id: productId,
          product_id: productId,
          name: productName,
          price: productPrice,
          quantity: quantityToAdd,
          unit: productUnit,
          image: productImage,
          category: product.category,
        },
      ];
    }

    persistCart(updated);
  };

  const updateQuantity = (id: number | string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    const updated = cartItems.map((item) =>
      String(item.id) === String(id) || String(item.product_id) === String(id)
        ? { ...item, quantity: newQty }
        : item
    );
    persistCart(updated);
  };

  const removeFromCart = (id: number | string) => {
    const updated = cartItems.filter(
      (item) => String(item.id) !== String(id) && String(item.product_id) !== String(id)
    );
    persistCart(updated);
  };

  const clearCart = () => {
    persistCart([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        isLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
