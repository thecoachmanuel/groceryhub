'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SystemSettings {
  appName: string;
  appDescription: string;
  supportPhone: string;
  supportEmail: string;
  address: string;
  storeLogoUrl: string;
  currencySymbol: string;
  currencyCode: string;
  timezone: string;
  orderPrefix: string;
  defaultRadius: number;
  minOrderSpend: number;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  platformServiceFee: number;
  taxRate: number;         // VAT percentage e.g. 7.5
  announcementText: string;
  maintenanceMode: boolean;
  playStoreUrl: string;
  appStoreUrl: string;
  paystackPublicKey: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  appName: 'GroceryHub',
  appDescription: 'Hyper-local 30-minute grocery delivery platform in Nigeria',
  supportPhone: '+234 (800) 123-4567',
  supportEmail: 'support@groceryhub.ng',
  address: 'Plot 14, Adeola Odeku St, Victoria Island, Lagos, Nigeria',
  storeLogoUrl: '',
  currencySymbol: '₦',
  currencyCode: 'NGN',
  timezone: 'Africa/Lagos (WAT)',
  orderPrefix: 'ORD-',
  defaultRadius: 15,
  minOrderSpend: 2000,
  freeDeliveryThreshold: 15000,
  deliveryFee: 1500,
  platformServiceFee: 500,
  taxRate: 0,
  announcementText: '⚡ 30-Minute Express Grocery Delivery!',
  maintenanceMode: false,
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.groceryhub.customer',
  appStoreUrl: 'https://apps.apple.com/app/groceryhub-delivery/id159023481',
  paystackPublicKey: '',
};

interface SystemSettingsContextType {
  settings: SystemSettings;
  isLoading: boolean;
  refetchSettings: () => Promise<void>;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setSettings({ ...DEFAULT_SETTINGS, ...json.data });
      }
    } catch (err) {
      console.warn('Failed to load system settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleSync = () => {
      fetchSettings();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('groceryhub_settings_updated', handleSync);
      window.addEventListener('storage', handleSync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('groceryhub_settings_updated', handleSync);
        window.removeEventListener('storage', handleSync);
      }
    };
  }, []);

  return (
    <SystemSettingsContext.Provider
      value={{
        settings,
        isLoading,
        refetchSettings: fetchSettings,
      }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext);
  if (!context) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
}
