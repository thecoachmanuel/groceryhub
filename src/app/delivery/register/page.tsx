'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Truck, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  CreditCard, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Building 
} from 'lucide-react';

export default function DeliveryPartnerRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('New York');
  const [vehicleType, setVehicleType] = useState('Motorcycle / Scooter');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankRouting, setBankRouting] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return alert('Please agree to Courier terms & safety policy');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setRegisteredSuccess(true);
      setTimeout(() => {
        router.push('/delivery/dashboard');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-2xl mx-auto w-full py-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-gray-900 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 font-black">
            <Truck size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Become a GroceryHub Courier Partner</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Earn competitive delivery commissions, keep 100% of tips, and enjoy flexible shifts
          </p>
        </div>

        {registeredSuccess ? (
          <div className="bg-[#1e2632] border border-emerald-500/40 rounded-3xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-[#0aad0a] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-white">Application Approved!</h2>
            <p className="text-xs text-gray-300">
              Welcome to the GroceryHub Courier fleet. Redirecting you to your driver dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Step 1: Personal Credentials */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-gray-800 pb-2">
                <User size={16} /> 1. Personal & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Full Legal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. David Miller"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="david.miller@example.com"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Driver Portal Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password..."
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Vehicle & Territory */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-gray-800 pb-2">
                <Truck size={16} /> 2. Vehicle & Operating Zone
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Operating City / Territory</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="New York">New York (Downtown Zone)</option>
                    <option value="Brooklyn">Brooklyn (Heights Zone)</option>
                    <option value="Queens">Queens (Long Island City)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Motorcycle / Scooter">Motorcycle / Scooter</option>
                    <option value="Electric Bicycle">Electric Bicycle</option>
                    <option value="Car / Sedan">Car / Sedan</option>
                    <option value="Delivery Van">Delivery Van</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">License Plate / Vehicle Number</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. NY-8942-GH"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono uppercase focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Driver License / ID Number</label>
                  <input
                    type="text"
                    value={drivingLicense}
                    onChange={(e) => setDrivingLicense(e.target.value.toUpperCase())}
                    placeholder="e.g. DL-48192039"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono uppercase focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Direct ACH Payout Account */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-gray-800 pb-2">
                <CreditCard size={16} /> 3. Direct Deposit Bank Payouts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Bank Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="••••••••4829"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Routing Number</label>
                  <input
                    type="text"
                    value={bankRouting}
                    onChange={(e) => setBankRouting(e.target.value)}
                    placeholder="021000021"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-400 pt-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 bg-gray-900 border-gray-700 focus:ring-0"
              />
              <span>
                I agree to the{' '}
                <Link href="/delivery-policy" className="text-amber-400 font-bold hover:underline">
                  Courier Code of Conduct & Safety Guidelines
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <span>{loading ? 'Submitting Application...' : 'Submit Application & Start Delivering'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-400">
          Already registered as a driver?{' '}
          <Link href="/delivery/login" className="text-amber-400 font-bold hover:underline">
            Sign In to Driver App
          </Link>
        </div>
      </div>
    </div>
  );
}
