import type { Metadata } from 'next';
import './globals.css';
import NutriGuideWidget from '@/components/website/NutriGuideWidget';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'GroceryHub - Online Multi-Vendor Grocery Store & Delivery',
  description: 'Order fresh groceries, organic vegetables, fruits, and daily essentials from trusted local vendors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f8f9fa] dark:bg-[#121820] text-gray-800 dark:text-gray-100 min-h-screen antialiased">
        <AuthProvider>
          {children}
          <NutriGuideWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
