import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { ShieldCheck, MapPin, Smartphone, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DeliveryPrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-2">
          <Link href="/delivery/dashboard" className="text-xs text-gray-400 hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={12} /> Back to Delivery Portal
          </Link>
          <div className="text-center space-y-3 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-[#0aad0a]/20 text-[#0aad0a] flex items-center justify-center mx-auto">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-3xl font-black">Courier Partner Privacy Policy</h1>
            <p className="text-xs text-gray-400">
              Information on GPS background telemetry, driver identity records, and mobile device data processing
            </p>
          </div>
        </div>

        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin size={18} className="text-[#0aad0a]" /> 1. Real-Time Geolocation & Background Tracking
            </h2>
            <p>
              When your courier driver app status is toggled to <strong>&quot;On Duty&quot;</strong>, the GroceryHub platform collects high-accuracy GPS coordinates in the foreground and background. This enables automated dispatch algorithms to assign nearest pickup stores and allows customers to track live courier transit on their map.
            </p>
            <p className="text-xs text-gray-400">
              Location tracking is automatically suspended when your status is changed to &quot;Offline&quot; or when you sign out.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-[#0aad0a]" /> 2. Driver Identity & Banking Credentials
            </h2>
            <p>
              During registration, GroceryHub collects your government-issued driving license, vehicle registration, and ACH routing numbers for direct weekly compensation payouts. All financial records are stored with AES-256 bank-grade encryption and shared only with our licensed payment clearing partners.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone size={18} className="text-[#0aad0a]" /> 3. Mobile Device Permissions
            </h2>
            <p>
              The courier mobile app requires camera permissions exclusively for scanning barcode packages, capturing doorstep delivery proof photos, and receiving high-priority order dispatch push notifications via Firebase Cloud Messaging.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
