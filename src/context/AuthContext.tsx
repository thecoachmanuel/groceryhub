'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  walletBalance: number;
  avatar?: string;
  referralCode?: string;
  role: 'user';
}

export interface SellerProfile {
  id: number;
  name: string;
  storeName: string;
  email: string;
  mobile: string;
  storeAddress?: string;
  storeArea?: string;
  storeCity?: string;
  walletBalance: number;
  balance?: number;
  role: 'seller';
}

export interface RiderProfile {
  id: number;
  name: string;
  mobile: string;
  vehicle: string;
  cashInHand: number;
  balance?: number;
  tripBonus?: number;
  role: 'delivery';
}

// ─── Context Shape ─────────────────────────────────────────────────────────────

interface AuthContextType {
  isInitialized: boolean;

  // Customer
  user: CustomerProfile | null;
  isAuthenticated: boolean;
  loginSession: (token: string, userData: Omit<CustomerProfile, 'role'>) => void;
  logout: () => void;
  updateWallet: (newBalance: number) => void;

  // Seller
  seller: SellerProfile | null;
  isSellerAuthenticated: boolean;
  sellerLogin: (token: string, sellerData: Omit<SellerProfile, 'role'>) => void;
  sellerLogout: () => void;

  // Rider / Delivery
  rider: RiderProfile | null;
  isRiderAuthenticated: boolean;
  riderLogin: (token: string, riderData: Omit<RiderProfile, 'role'>) => void;
  riderLogout: () => void;

  // Admin
  isAdminAuthenticated: boolean;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
}

// ─── Context Creation ──────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [rider, setRider] = useState<RiderProfile | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const router = useRouter();

  // Restore all sessions from localStorage & cookies on mount seamlessly
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // ── Step 1: Synchronously restore from localStorage ──────────────────────
    let restoredToken: string | null = null;

    try {
      const savedUser = localStorage.getItem('groceryhub_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') {
          setUser({ ...parsed, role: 'user' });
        }
      }
    } catch (e) {
      console.warn('Error restoring customer session:', e);
    }

    try {
      const savedSeller = localStorage.getItem('groceryhub_seller');
      if (savedSeller) {
        const parsed = JSON.parse(savedSeller);
        if (parsed && typeof parsed === 'object') {
          setSeller({ ...parsed, role: 'seller' });
        }
      }
    } catch (e) {
      console.warn('Error restoring seller session:', e);
    }

    try {
      const savedRider = localStorage.getItem('groceryhub_rider');
      if (savedRider) {
        const parsed = JSON.parse(savedRider);
        if (parsed && typeof parsed === 'object') {
          setRider({ ...parsed, role: 'delivery' });
        }
      }
    } catch (e) {
      console.warn('Error restoring rider session:', e);
    }

    const adminToken = localStorage.getItem('groceryhub_admin_token') || document.cookie.includes('user_role=admin');
    if (adminToken) setIsAdminAuthenticated(true);

    restoredToken =
      localStorage.getItem('groceryhub_token') ||
      localStorage.getItem('groceryhub_seller_token') ||
      localStorage.getItem('groceryhub_rider_token');

    // ── Step 2: Await server revalidation BEFORE setting isInitialized ────────
    // This is the critical fix: isInitialized only becomes true AFTER server confirms
    // the session (or times out). Pages guarding with !isAuthenticated will NOT redirect
    // until we know for certain whether the user is logged in or not.
    async function revalidateAndInit() {
      if (restoredToken) {
        try {
          // 3-second timeout to avoid hanging the UI indefinitely
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${restoredToken}` },
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data?.user) {
              const u = json.data.user;
              if (u.role === 'user') {
                setUser((prev) => {
                  const updated = { ...(prev || {}), ...u, role: 'user' as const };
                  localStorage.setItem('groceryhub_user', JSON.stringify(updated));
                  return updated;
                });
              } else if (u.role === 'seller') {
                setSeller((prev) => {
                  const updated = { ...(prev || {}), ...u, role: 'seller' as const };
                  localStorage.setItem('groceryhub_seller', JSON.stringify(updated));
                  return updated;
                });
              } else if (u.role === 'delivery') {
                setRider((prev) => {
                  const updated = { ...(prev || {}), ...u, role: 'delivery' as const };
                  localStorage.setItem('groceryhub_rider', JSON.stringify(updated));
                  return updated;
                });
              }
            } else if (res.status === 401) {
              // Token truly rejected by server — clear stale session data
              localStorage.removeItem('groceryhub_user');
              localStorage.removeItem('groceryhub_token');
              localStorage.removeItem('groceryhub_seller');
              localStorage.removeItem('groceryhub_seller_token');
              localStorage.removeItem('groceryhub_rider');
              localStorage.removeItem('groceryhub_rider_token');
              setUser(null);
              setSeller(null);
              setRider(null);
            }
          }
        } catch (err: any) {
          // Network error or timeout — fall back to localStorage data silently
          if (err?.name !== 'AbortError') {
            console.warn('Session revalidation network error (using localStorage fallback):', err);
          }
        }
      }

      // ── Step 3: Only now mark app as fully initialized ─────────────────────
      setIsInitialized(true);
    }

    revalidateAndInit();
  }, []);

  // ─── Customer Session ───────────────────────────────────────────────────────

  const loginSession = (token: string, userData: Omit<CustomerProfile, 'role'>) => {
    const activeUser: CustomerProfile = { ...userData, role: 'user' };
    setUser(activeUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryhub_token', token);
      localStorage.setItem('groceryhub_user', JSON.stringify(activeUser));
      document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `user_role=user; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('groceryhub_user');
      localStorage.removeItem('groceryhub_token');
      document.cookie = 'auth_token=; path=/; max-age=0';
      document.cookie = 'user_role=; path=/; max-age=0';
    }
    router.push('/login');
  };

  const updateWallet = (newBalance: number) => {
    if (user) {
      const updated = { ...user, walletBalance: newBalance };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('groceryhub_user', JSON.stringify(updated));
      }
    }
  };

  // ─── Seller Session ─────────────────────────────────────────────────────────

  const sellerLogin = (token: string, sellerData: Omit<SellerProfile, 'role'>) => {
    const activeSeller: SellerProfile = { ...sellerData, role: 'seller' };
    setSeller(activeSeller);
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryhub_seller_token', token);
      localStorage.setItem('groceryhub_seller', JSON.stringify(activeSeller));
      document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `user_role=seller; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const sellerLogout = () => {
    setSeller(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('groceryhub_seller');
      localStorage.removeItem('groceryhub_seller_token');
      document.cookie = 'auth_token=; path=/; max-age=0';
      document.cookie = 'user_role=; path=/; max-age=0';
    }
    router.push('/seller/login');
  };

  // ─── Rider Session ──────────────────────────────────────────────────────────

  const riderLogin = (token: string, riderData: Omit<RiderProfile, 'role'>) => {
    const activeRider: RiderProfile = { ...riderData, role: 'delivery' };
    setRider(activeRider);
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryhub_rider_token', token);
      localStorage.setItem('groceryhub_rider', JSON.stringify(activeRider));
      document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `user_role=delivery; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const riderLogout = () => {
    setRider(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('groceryhub_rider');
      localStorage.removeItem('groceryhub_rider_token');
      document.cookie = 'auth_token=; path=/; max-age=0';
      document.cookie = 'user_role=; path=/; max-age=0';
    }
    router.push('/delivery/login');
  };

  // ─── Admin Session ──────────────────────────────────────────────────────────

  const adminLogin = (token: string) => {
    setIsAdminAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryhub_admin_token', token);
      document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `user_role=admin; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('groceryhub_admin_token');
      document.cookie = 'auth_token=; path=/; max-age=0';
      document.cookie = 'user_role=; path=/; max-age=0';
    }
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        user,
        isAuthenticated: !!user,
        loginSession,
        logout,
        updateWallet,
        seller,
        isSellerAuthenticated: !!seller,
        sellerLogin,
        sellerLogout,
        rider,
        isRiderAuthenticated: !!rider,
        riderLogin,
        riderLogout,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function useSellerAuth() {
  const { seller, isSellerAuthenticated, isInitialized, sellerLogin, sellerLogout } = useAuth();
  return { seller, isSellerAuthenticated, isInitialized, sellerLogin, sellerLogout };
}

export function useRiderAuth() {
  const { rider, isRiderAuthenticated, isInitialized, riderLogin, riderLogout } = useAuth();
  return { rider, isRiderAuthenticated, isInitialized, riderLogin, riderLogout };
}

export function useAdminAuth() {
  const { isAdminAuthenticated, isInitialized, adminLogin, adminLogout } = useAuth();
  return { isAdminAuthenticated, isInitialized, adminLogin, adminLogout };
}

// Legacy type alias for backwards compatibility
export type UserProfile = CustomerProfile;
