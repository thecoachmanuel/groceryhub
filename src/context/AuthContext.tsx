'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  token?: string;
  walletBalance: number;
  avatar?: string;
  referralCode?: string;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginSession: (token: string, userData: UserProfile) => void;
  logout: () => void;
  updateWallet: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Restore session from localStorage if present
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('groceryhub_user');
      const savedToken = localStorage.getItem('groceryhub_token');
      if (savedUser && savedToken) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser({ ...parsed, token: savedToken });
        } catch (e) {
          localStorage.removeItem('groceryhub_user');
          localStorage.removeItem('groceryhub_token');
        }
      }
    }
  }, []);

  const loginSession = (token: string, userData: UserProfile) => {
    const activeUser = { ...userData, token };
    setUser(activeUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryhub_token', token);
      localStorage.setItem('groceryhub_user', JSON.stringify(activeUser));
      // Also set standard auth cookie for server-side auth guard
      document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('groceryhub_user');
      localStorage.removeItem('groceryhub_token');
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
    router.push('/');
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginSession,
        logout,
        updateWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
