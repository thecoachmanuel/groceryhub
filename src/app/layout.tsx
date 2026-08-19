import type { Metadata, Viewport } from 'next';
import './globals.css';
import NutriGuideWidget from '@/components/website/NutriGuideWidget';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { SystemSettingsProvider } from '@/context/SystemSettingsContext';

export const metadata: Metadata = {
  title: 'GroceryHub - Online Multi-Vendor Grocery Store & Delivery',
  description: 'Order fresh groceries, organic vegetables, fruits, and daily essentials from trusted local vendors.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f8f9fa] dark:bg-[#121820] text-gray-800 dark:text-gray-100 min-h-screen antialiased overflow-x-hidden">
        <SystemSettingsProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <NutriGuideWidget />
            </CartProvider>
          </AuthProvider>
        </SystemSettingsProvider>
      </body>
    </html>
  );
}
