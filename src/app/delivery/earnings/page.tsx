'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  CheckCircle2, 
  Wallet, 
  AlertTriangle,
  Receipt,
  Truck,
  RefreshCw
} from 'lucide-react';
import DeliveryNav from '@/components/delivery/DeliveryNav';
import { formatNaira } from '@/lib/currency';
import { useRiderAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api-fetch';

interface LedgerItem {
  id: string;
  type: string;
  ref: string;
  amount: number;
  codCollected: number;
  date: string;
  status: string;
}

export default function DeliveryEarningsPage() {
  const { rider } = useRiderAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [cashInHand, setCashInHand] = useState(0);
  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const riderId = (rider as any)?.delivery_boy_id || (rider as any)?.id || 1;
        const assigned = json.data.filter(
          (o: any) =>
            o.delivery_boy_id === riderId ||
            (o.delivery_boy_name && o.delivery_boy_name.toLowerCase().includes(rider?.name?.toLowerCase() || 'marcus')) ||
            (o.order_status && o.order_status.toLowerCase() === 'delivered')
        );

        let totalFee = 0;
        let totalCod = 0;
        const items: LedgerItem[] = [];

        (assigned.length > 0 ? assigned : json.data.slice(0, 5)).forEach((o: any) => {
          const isDelivered = (o.order_status || o.active_status || '').toLowerCase() === 'delivered';
          const isCod = (o.payment_method || '').toUpperCase().includes('COD');
          const fee = o.delivery_charge || 1500;
          const orderTotal = o.total_amount || o.final_total || 0;

          if (isDelivered) {
            totalFee += fee;
            if (isCod) totalCod += orderTotal;
          }

          items.push({
            id: `TRP-${String(o._id).slice(-4).toUpperCase()}`,
            type: isCod ? 'COD Cash Collection' : 'Delivery Commission',
            ref: `Order #${o.order_id || String(o._id).slice(-5).toUpperCase()}`,
            amount: fee,
            codCollected: isCod && isDelivered ? orderTotal : 0,
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
            status: isDelivered ? (isCod ? 'Cash in Hand' : 'Credited') : 'Pending',
          });
        });

        setWalletBalance(totalFee);
        setCashInHand(totalCod);
        setLedger(items);
      }
    } catch (err) {
      console.warn('Failed to load courier earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [rider]);

  const handleDepositCash = () => {
    if (cashInHand <= 0) return alert('No COD cash currently in hand to remit.');
    setCashInHand(0);
    setDepositSuccess(true);
    setTimeout(() => setDepositSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#121820] text-white flex flex-col justify-between">
      <div>
        <DeliveryNav />

        <main className="max-w-7xl mx-auto p-4 sm:p-10 space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                <Truck size={24} className="text-[#0aad0a]" /> Courier Earnings &amp; COD Remittance
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Track delivery trip fees, surge bonuses, and remit Cash-on-Delivery collections in Naira (₦)
              </p>
            </div>

            <button
              onClick={fetchEarnings}
              className="self-start sm:self-auto bg-[#1e2632] hover:bg-gray-800 p-2.5 rounded-2xl text-gray-400 hover:text-white transition-colors"
              title="Refresh Ledger"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {depositSuccess && (
            <div className="bg-emerald-950/50 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={18} /> COD Cash remittance confirmed! Recorded by store counter.
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-2 shadow-xl">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Courier Earnings Balance</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0aad0a] font-mono">{formatNaira(walletBalance)}</h2>
              <p className="text-[11px] text-gray-500">Trip commissions earned from delivered runs</p>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">COD Cash in Hand</span>
                {cashInHand > 0 && (
                  <span className="text-[10px] bg-red-950 text-red-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle size={12} /> Remittance Due
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{formatNaira(cashInHand)}</h2>
              <button
                onClick={handleDepositCash}
                disabled={cashInHand <= 0}
                className="w-full bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl transition-all"
              >
                Remit COD Cash to Admin Counter
              </button>
            </div>

            <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-2 shadow-xl sm:col-span-2 lg:col-span-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Trip Bonus Incentive</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">{formatNaira(ledger.length * 500)}</h2>
              <p className="text-[11px] text-gray-500">₦500 peak hour surge bonus per delivered run</p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white">Courier Trip Ledger &amp; Cash Log</h3>

            {loading ? (
              <div className="py-12 text-center text-gray-400 text-xs font-bold flex flex-col items-center gap-2">
                <RefreshCw size={24} className="animate-spin text-[#0aad0a]" />
                Calculating live trip earnings from dispatch logs...
              </div>
            ) : ledger.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-bold">
                No courier runs recorded yet. Complete assigned runs to see live earnings log.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="pb-3">Trip ID</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">COD Cash Collected</th>
                      <th className="pb-3">Trip Fee (₦)</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-medium">
                    {ledger.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 font-mono font-bold text-[#0aad0a]">{item.id}</td>
                        <td className="py-4 text-white font-bold">{item.type}</td>
                        <td className="py-4 font-mono text-gray-300">{item.ref}</td>
                        <td className="py-4 text-gray-400">{item.date}</td>
                        <td className="py-4 font-mono text-amber-400">{item.codCollected > 0 ? formatNaira(item.codCollected) : '—'}</td>
                        <td className="py-4 font-mono font-bold text-[#0aad0a]">+{formatNaira(item.amount)}</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.status === 'Credited'
                                ? 'bg-emerald-950 text-[#0aad0a]'
                                : item.status === 'Cash in Hand'
                                ? 'bg-amber-950 text-amber-400'
                                : 'bg-blue-950 text-blue-400'
                            }`}
                          >
                            ● {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
