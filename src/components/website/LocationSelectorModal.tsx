'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, CheckCircle2, X, AlertCircle, RefreshCw, Building } from 'lucide-react';

interface CityItem {
  id?: string;
  name: string;
  state?: string;
}

interface AreaItem {
  id?: string;
  area_id?: string;
  name: string;
  city?: string;
}

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onSelectLocation: (locationName: string, cityId?: number, areaId?: number) => void;
}

export default function LocationSelectorModal({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}: LocationSelectorModalProps) {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'city' | 'gps' | 'area'>('city');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadLocationData() {
      try {
        setLoading(true);
        const [citiesRes, areasRes] = await Promise.all([
          fetch('/api/admin/cities').catch(() => null),
          fetch('/api/admin/areas').catch(() => null),
        ]);

        const cJson: any = citiesRes ? await citiesRes.json().catch(() => ({})) : {};
        const aJson: any = areasRes ? await areasRes.json().catch(() => ({})) : {};

        if (cJson?.success && Array.isArray(cJson.data) && cJson.data.length > 0) {
          setCities(cJson.data.map((c: any) => ({ id: String(c._id), name: c.name || c.title })));
        } else {
          setCities([
            { name: 'Lagos (Ikeja & Island)' },
            { name: 'Abuja (FCT Central)' },
            { name: 'Port Harcourt (GRA)' },
            { name: 'Ibadan (Bodija & UI)' },
            { name: 'Abeokuta (Obantoko)' },
          ]);
        }

        if (aJson?.success && Array.isArray(aJson.data) && aJson.data.length > 0) {
          setAreas(aJson.data.map((a: any) => ({ id: String(a._id), name: a.name, city: a.city })));
        }
      } catch (err) {
        console.warn('Error loading cities/areas:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLocationData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setDetectingGps(true);
    setStatusMessage('Detecting GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Query deliverable area by lat/lng
          const res = await fetch('/api/v1_6/customer/fetchDeliverableAreaByLatLong', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });
          const json = await res.json();

          if (json.status === 'success' && json.data) {
            const locName = `${json.data.name || 'Current Location'}, ${json.data.city || 'Lagos'}`;
            onSelectLocation(locName, json.city_id || 1, json.deliverable_area_id || 1);
            setStatusMessage(`📍 Deliverable hub verified: ${locName}`);
            setTimeout(() => onClose(), 800);
          } else {
            onSelectLocation(`GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
            onClose();
          }
        } catch (err) {
          onSelectLocation(`Lagos (Detected GPS)`);
          onClose();
        } finally {
          setDetectingGps(false);
        }
      },
      (error) => {
        setDetectingGps(false);
        setStatusMessage('GPS Permission denied or unavailable. Please select your city manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAreas = areas.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.city && a.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e2632] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 space-y-6 relative shadow-2xl animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-400"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#0aad0a]/10 text-[#0aad0a] px-3 py-1 rounded-full text-xs font-black uppercase mb-2">
            <MapPin size={14} /> Hyper-Local Delivery Coverage
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">Select Delivery Location</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Choose your city or deliverable hub to view accurate prices, stock, and 30-minute delivery availability.
          </p>
        </div>

        {/* Auto Detect GPS Location Button */}
        <button
          onClick={handleDetectCurrentLocation}
          disabled={detectingGps}
          className="w-full bg-[#0aad0a]/10 hover:bg-[#0aad0a]/20 border border-[#0aad0a]/30 text-[#0aad0a] font-bold p-4 rounded-2xl flex items-center justify-between text-xs transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0aad0a] text-white flex items-center justify-center shadow-md">
              <Navigation size={18} className={detectingGps ? 'animate-spin' : ''} />
            </div>
            <div className="text-left">
              <span className="font-black block text-sm">Use Current GPS Location</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Detect nearest delivery hub automatically</span>
            </div>
          </div>
          <span className="font-mono text-xs text-[#0aad0a]">GPS &rarr;</span>
        </button>

        {statusMessage && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          <button
            onClick={() => setActiveTab('city')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'city'
                ? 'bg-[#0aad0a] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            🌆 Select City ({cities.length})
          </button>
          {areas.length > 0 && (
            <button
              onClick={() => setActiveTab('area')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'area'
                  ? 'bg-[#0aad0a] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              📍 Neighborhood Hubs ({areas.length})
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'city' ? 'Search city name...' : 'Search neighborhood area or city...'}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0aad0a]"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
        </div>

        {/* List of Cities / Areas */}
        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
          {loading ? (
            <div className="text-center py-8 text-xs text-gray-400">Loading deliverable regions...</div>
          ) : activeTab === 'city' ? (
            filteredCities.map((city, idx) => {
              const isSelected = selectedLocation.toLowerCase().includes(city.name.toLowerCase());
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectLocation(city.name);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'bg-[#0aad0a]/10 border-[#0aad0a] text-[#0aad0a] font-bold'
                      : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building size={16} className={isSelected ? 'text-[#0aad0a]' : 'text-gray-400'} />
                    <span>{city.name}</span>
                  </div>
                  {isSelected && <CheckCircle2 size={16} className="text-[#0aad0a]" />}
                </button>
              );
            })
          ) : (
            filteredAreas.map((area, idx) => {
              const isSelected = selectedLocation.toLowerCase().includes(area.name.toLowerCase());
              return (
                <button
                  key={idx}
                  onClick={() => {
                    const fullName = `${area.name}${area.city ? `, ${area.city}` : ''}`;
                    onSelectLocation(fullName);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'bg-[#0aad0a]/10 border-[#0aad0a] text-[#0aad0a] font-bold'
                      : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} className={isSelected ? 'text-[#0aad0a]' : 'text-gray-400'} />
                    <div>
                      <span className="font-bold block">{area.name}</span>
                      {area.city && <span className="text-[10px] text-gray-400">{area.city}</span>}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={16} className="text-[#0aad0a]" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
