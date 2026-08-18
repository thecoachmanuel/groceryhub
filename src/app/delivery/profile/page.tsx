'use client';

import { useState } from 'react';
import { User, Truck, Phone, Mail, Building2, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import DeliveryNav from '@/components/delivery/DeliveryNav';

export default function DeliveryProfilePage() {
  const [name, setName] = useState('Marcus Vance');
  const [mobile, setMobile] = useState('+1 (555) 789-0123');
  const [vehicle, setVehicle] = useState('Honda Super Cub Scooter');
  const [plate, setPlate] = useState('NY-4921');
  const [bankName, setBankName] = useState('Wells Fargo');
  const [accountNo, setAccountNo] = useState('•••• 1049');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <DeliveryNav />

        <main className="max-w-3xl mx-auto p-6 sm:p-10 space-y-6 w-full">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <User size={24} className="text-[#0aad0a]" /> Courier Profile & Bank Details
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage personal details, registered vehicle information, and direct deposit bank account
            </p>
          </div>

          <form onSubmit={handleSave} className="bg-[#1e2632] border border-gray-800 rounded-3xl p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Courier Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Registered Mobile</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Vehicle Type / Model</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">License Plate Number</label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Direct Deposit Bank</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Bank Account Number</label>
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white font-black px-6 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Save size={16} />
                <span>Save Courier Profile</span>
              </button>

              {savedSuccess && (
                <span className="text-xs font-bold text-[#0aad0a] flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 size={16} /> Courier profile updated successfully!
                </span>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
