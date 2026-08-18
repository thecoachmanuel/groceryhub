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
  Upload,
  AlertCircle
} from 'lucide-react';

export default function SellerRegisterPage() {
  const router = useRouter();

  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Lagos');
  const [storeAddress, setStoreAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [bankName, setBankName] = useState('Zenith Bank');
  const [bankAccount, setBankAccount] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!agreeTerms) return setErrorMsg('Please agree to Merchant terms & 5% commission agreement');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ownerName,
          store_name: storeName,
          email,
          mobile,
          password,
          address: storeAddress,
          city,
          tax_id_ein: taxId,
          bank_name: bankName,
          bank_account_number: bankAccount,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        return setErrorMsg(data.message || 'Vendor registration failed.');
      }

      localStorage.setItem('groceryhub_seller_token', data.data.token);
      localStorage.setItem('groceryhub_seller', JSON.stringify(data.data.seller));
      document.cookie = `auth_token=${data.data.token}; path=/; max-age=604800; SameSite=Lax`;

      setRegisteredSuccess(true);
      setTimeout(() => {
        router.push('/seller/dashboard');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-2xl mx-auto w-full py-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0aad0a] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0aad0a]/30 font-black">
            <Store size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Register as a Verified Merchant</h1>
          <p className="text-xs text-gray-400">
            Sell fresh farm produce, organic meats, bakery items, and groceries on Nigeria&apos;s leading delivery platform
          </p>
        </div>

        {registeredSuccess && (
          <div className="bg-emerald-950/80 border border-[#0aad0a] text-[#0aad0a] p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={18} /> Store registered and approved! Redirecting to Merchant Portal...
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-800 text-red-400 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1e2632] rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl space-y-6">
          
          {/* Section 1: Business Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-gray-800 pb-2">
              <Store size={16} className="text-[#0aad0a]" /> Store &amp; Brand Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Store / Business Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Green Valley Organic Farms"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                  <Store size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Owner / Manager Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Tunde Balogun"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                  <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Merchant Business Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@greenvalley.ng"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Merchant Mobile Phone</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+234 800 123 4567"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                  <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Security & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-gray-800 pb-2">
              <MapPin size={16} className="text-[#0aad0a]" /> Store Operations &amp; Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">City / State</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Lagos">Lagos, Nigeria</option>
                  <option value="Abuja">Abuja (FCT), Nigeria</option>
                  <option value="Port Harcourt">Port Harcourt, Rivers</option>
                  <option value="Ibadan">Ibadan, Oyo</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Physical Warehouse / Store Address</label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Plot 18, Agro Estate, Epe, Lagos"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Account Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Tax Identification Number (TIN)</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="e.g. 24890123-0001"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-[#0aad0a]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bank Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-gray-800 pb-2">
              <CreditCard size={16} className="text-[#0aad0a]" /> Payout Bank Details (Naira ₦)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Bank Name</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Zenith Bank">Zenith Bank PLC</option>
                  <option value="Access Bank">Access Bank PLC</option>
                  <option value="GTBank">Guaranty Trust Bank (GTB)</option>
                  <option value="First Bank">First Bank of Nigeria</option>
                  <option value="UBA">United Bank for Africa (UBA)</option>
                  <option value="OPay">OPay Digital Services</option>
                  <option value="Kuda">Kuda Microfinance Bank</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">NUBAN Account Number (10 Digits)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="0123456789"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 font-mono focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Terms & Agreement */}
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="merchantTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-[#0aad0a] focus:ring-[#0aad0a] border-gray-700 bg-gray-900"
              />
              <label htmlFor="merchantTerms" className="text-xs text-gray-300">
                I agree to the Standard 5% Platform Commission rate and Merchant Partner Terms
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
          >
            <span>{loading ? 'Processing Registration...' : 'Complete Vendor Registration'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Already registered as a merchant?{' '}
          <Link href="/seller/login" className="text-[#0aad0a] font-bold hover:underline">
            Merchant Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
