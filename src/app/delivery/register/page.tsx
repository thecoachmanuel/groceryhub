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
  Building,
  AlertCircle
} from 'lucide-react';

export default function DeliveryPartnerRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Lagos');
  const [vehicleType, setVehicleType] = useState('Motorcycle / Scooter');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!agreeTerms) return setErrorMsg('Please agree to Courier terms & safety policy');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/delivery/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
          city,
          vehicle_type: `${vehicleType} (${vehicleNumber || 'Standard'})`,
          license_number: drivingLicense,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        return setErrorMsg(data.message || 'Courier registration failed.');
      }

      localStorage.setItem('groceryhub_rider_token', data.data.token);
      localStorage.setItem('groceryhub_rider', JSON.stringify(data.data.delivery_boy));
      document.cookie = `auth_token=${data.data.token}; path=/; max-age=604800; SameSite=Lax`;

      setRegisteredSuccess(true);
      setTimeout(() => {
        router.push('/delivery/dashboard');
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
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-gray-900 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 font-black">
            <Truck size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Become a GroceryHub Courier Partner</h1>
          <p className="text-xs text-gray-400">
            Earn ₦500+ trip bonuses per completed run with flexible delivery shifts across Lagos &amp; Nigeria
          </p>
        </div>

        {registeredSuccess && (
          <div className="bg-amber-950/80 border border-amber-500 text-amber-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={18} /> Partner account registered! Redirecting to Courier Shift Dashboard...
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-800 text-red-400 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1e2632] rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl space-y-6">
          
          {/* Section 1: Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-gray-800 pb-2">
              <User size={16} className="text-amber-400" /> Courier Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Mobile Phone (+234)</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+234 809 111 2233"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rider@example.ng"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Account Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Vehicle & Logistics */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-gray-800 pb-2">
              <Truck size={16} className="text-amber-400" /> Vehicle &amp; Dispatch Fleet
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Primary Delivery City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-amber-400"
                >
                  <option value="Lagos">Lagos State, Nigeria</option>
                  <option value="Abuja">Abuja (FCT), Nigeria</option>
                  <option value="Port Harcourt">Port Harcourt, Rivers</option>
                  <option value="Ibadan">Ibadan, Oyo</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 focus:outline-none focus:border-amber-400"
                >
                  <option value="Motorcycle / Scooter">Motorcycle / Scooter</option>
                  <option value="Electric Bicycle / e-Bike">Electric Bicycle / e-Bike</option>
                  <option value="Compact Car / Hatchback">Compact Car / Hatchback</option>
                  <option value="Delivery Van">Delivery Van</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">License Plate / Vehicle Reg No.</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. LAG-8492"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-300">Driver License Number (NIN / FRSC)</label>
                <input
                  type="text"
                  value={drivingLicense}
                  onChange={(e) => setDrivingLicense(e.target.value)}
                  placeholder="DL-NG-89104"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 px-3 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="courierTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-gray-700 bg-gray-900"
              />
              <label htmlFor="courierTerms" className="text-xs text-gray-300">
                I agree to the Courier Safety Policy and Independent Courier Partner terms
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            <span>{loading ? 'Submitting Application...' : 'Register as Courier Partner'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Already registered as a courier?{' '}
          <Link href="/delivery/login" className="text-amber-400 font-bold hover:underline">
            Courier Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
