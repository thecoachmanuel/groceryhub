'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Percent, 
  FileText, 
  Upload 
} from 'lucide-react';

export default function SellerRegisterPage() {
  const router = useRouter();

  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('New York');
  const [area, setArea] = useState('Downtown Manhattan');
  const [storeAddress, setStoreAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankRouting, setBankRouting] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return alert('Please agree to Merchant terms & 5% commission agreement');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setRegisteredSuccess(true);
      setTimeout(() => {
        router.push('/seller/dashboard');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-2xl mx-auto w-full py-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0aad0a] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0aad0a]/30 font-black">
            <Store size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Partner Your Store on GroceryHub</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Reach thousands of local grocery shoppers with our instant 30-minute delivery logistics network
          </p>
        </div>

        {registeredSuccess ? (
          <div className="bg-[#1e2632] border border-emerald-500/40 rounded-3xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-[#0aad0a] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-white">Merchant Application Approved!</h2>
            <p className="text-xs text-gray-300">
              Welcome to the GroceryHub Vendor family. Redirecting you to your store manager dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Step 1: Store & Owner Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0aad0a] flex items-center gap-2 border-b border-gray-800 pb-2">
                <Store size={16} /> 1. Store Identity & Owner Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Store / Farm Business Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Green Valley Organic Market"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Proprietor / Owner Name</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Robert Smith"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Business Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="store@greenvalley.com"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Store Contact Phone</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-300">Vendor Portal Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password..."
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Location & Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0aad0a] flex items-center gap-2 border-b border-gray-800 pb-2">
                <MapPin size={16} /> 2. Store Location & Deliverable Area
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="New York">New York</option>
                    <option value="Brooklyn">Brooklyn</option>
                    <option value="Queens">Queens</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Geofenced Zone</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  >
                    <option value="Downtown Manhattan">Downtown Manhattan Zone</option>
                    <option value="Midtown">Midtown Zone</option>
                    <option value="Brooklyn Heights">Brooklyn Heights Zone</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-300">Physical Store Address</label>
                  <input
                    type="text"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    placeholder="e.g. 142 Green Street, Suite 100, New York, NY 10012"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Tax & Bank Payout Credentials */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0aad0a] flex items-center gap-2 border-b border-gray-800 pb-2">
                <CreditCard size={16} /> 3. Business Tax ID & Settlement Account
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Tax ID / EIN Number</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value.toUpperCase())}
                    placeholder="e.g. 12-3456789"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs font-mono uppercase focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Bank Account #</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="••••••••9102"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
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
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Commission Policy Badge */}
            <div className="bg-emerald-950/40 border border-[#0aad0a]/30 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-300">
              <Percent size={20} className="text-[#0aad0a] flex-shrink-0" />
              <span>Standard 5% platform service fee applies only on successful customer deliveries. Zero upfront listing fees.</span>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-400 pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#0aad0a] bg-gray-900 border-gray-700 focus:ring-0"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms-condition" className="text-[#0aad0a] font-bold hover:underline">
                  Vendor Partner Agreement & Terms of Service
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
            >
              <span>{loading ? 'Submitting Application...' : 'Register Store & Open Vendor Portal'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-400">
          Already registered as a seller?{' '}
          <Link href="/seller/login" className="text-[#0aad0a] font-bold hover:underline">
            Sign In to Seller Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
