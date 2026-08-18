import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import { FileText, Award, DollarSign, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DeliveryTermsConditionPage() {
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
              <FileText size={28} />
            </div>
            <h1 className="text-3xl font-black">Courier Independent Partner Terms</h1>
            <p className="text-xs text-gray-400">
              Contractual terms, service level requirements, compensation rules, and platform code of conduct
            </p>
          </div>
        </div>

        <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-[#0aad0a]" /> 1. Independent Contractor Relationship
            </h2>
            <p>
              Delivery partners operate as independent third-party logistics contractors and retain full autonomy over their shift schedule, hours on duty, and territory preferences. Nothing in this agreement constitutes an employer-employee relationship.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign size={18} className="text-[#0aad0a]" /> 2. Delivery Earnings & Surge Bonus Schedules
            </h2>
            <p>
              Couriers receive a base fee per completed order plus any dynamic distance surcharges, peak-hour incentives, and 100% of customer tips. Payouts are reconciled and disbursed via direct deposit on a weekly basis according to verified delivery logs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#0aad0a]" /> 3. Cash on Delivery (COD) & Custody Obligations
            </h2>
            <p>
              Couriers are legally responsible for all physical currency collected during cash on delivery runs. All cash in hand must be remitted at authorized store counters or bank deposits within 24 hours. Failure to remit collected funds will result in immediate deactivation and legal recovery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-[#0aad0a]" /> 4. Vehicle Safety & Valid Licensing
            </h2>
            <p>
              All motorized vehicle operators must maintain a valid state driver&apos;s license and minimum statutory motor vehicle insurance. Electric bikes and scooter riders must wear certified helmets and adhere to municipal traffic regulations.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
