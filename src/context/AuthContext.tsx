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
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData: Partial<UserProfile>) => void;
  register: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  updateWallet: (newBalance: number) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 101,
  name: 'Emma Davis',
  email: 'emma.davis@example.com',
  mobile: '+1 (555) 234-5678',
  walletBalance: 125.50,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
  referralCode: 'EMMA894',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('groceryhub_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          // keep default
        }
      }
    }
  }, []);

  const login = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      ...userData,
      name: userData.name || userData.email?.split('@')[0] || 'Grocery Shopper',
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryhub_user', JSON.stringify(newUser));
    }
  };

  const register = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: Date.now(),
      name: userData.name || 'New Shopper',
      email: userData.email || '',
      mobile: userData.mobile || '',
      walletBalance: userData.referralCode ? 10.00 : 0.00, // $10 referral bonus
      referralCode: 'GH' + Math.floor(1000 + Math.random() * 9000),
      ...userData,
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryhub_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('groceryhub_user');
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
        login,
        register,
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
