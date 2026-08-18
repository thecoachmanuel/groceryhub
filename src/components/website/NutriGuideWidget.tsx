'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, X, ArrowRight, HeartPulse } from 'lucide-react';

export default function NutriGuideWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="bg-[#1e2632] border border-gray-700 text-white rounded-3xl p-5 shadow-2xl w-80 space-y-4 animate-scale-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                <HeartPulse size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">NutriGuide AI</h4>
                <span className="text-[10px] text-emerald-400 font-bold">● Active Nutritionist</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Need help selecting vitamin-rich fruits, protein meals, or keto-friendly groceries?
          </p>

          <Link
            href="/nutriguide"
            onClick={() => setIsOpen(false)}
            className="w-full bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all"
          >
            <span>Ask NutriGuide AI</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group border border-white/20"
        >
          <Sparkles size={18} className="animate-spin text-amber-300" />
          <span className="text-xs font-bold tracking-wide">NutriGuide AI</span>
        </button>
      )}
    </div>
  );
}
