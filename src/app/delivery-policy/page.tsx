import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { Truck, ShieldCheck, Clock, Award } from 'lucide-react';

export default function DeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#0aad0a]/20 text-[#0aad0a] flex items-center justify-center mx-auto">
            <Truck size={28} />
          </div>
          <h1 className="text-3xl font-black">Courier & Delivery Partner Policy</h1>
          <p className="text-xs text-gray-400">Rules of engagement, contactless protocols, compensation schedule, and safety compliance</p>
        </div>

        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#0aad0a]" /> 1. Food Safety & Temperature Control
            </h2>
            <p>
              All perishable groceries, frozen goods, fresh dairy, and poultry items must remain sealed in insulated, temperature-controlled delivery bags throughout transit. Delivery personnel must ensure that fresh produce is never exposed to direct sunlight or ambient vehicle heat.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-[#0aad0a]" /> 2. Delivery Timeframes & Geofencing
            </h2>
            <p>
              Couriers are assigned runs strictly within designated geofenced radius boundaries (typically 5 to 8 km) to guarantee delivery within 25–35 minutes of store handover. Failure to maintain punctuality without valid transit cause may lead to temporary dispatch restrictions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-[#0aad0a]" /> 3. Cash on Delivery (COD) Remittance Protocol
            </h2>
            <p>
              All physical cash collected on Cash on Delivery orders is the direct legal property of GroceryHub and its certified partner vendors. Couriers must remit collected physical cash to the store counter or designated administrator within 24 hours of collection.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
