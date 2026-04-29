import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if they haven't accepted previously
    const hasConsented = localStorage.getItem('ndpa_consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ndpa_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-700 p-5 flex flex-col md:flex-row items-center justify-between pointer-events-auto">
          <div className="flex items-start md:items-center mb-4 md:mb-0 mr-0 md:mr-8">
            <div className="bg-emerald-500/20 p-2 rounded-lg mr-4 flex-shrink-0 hidden sm:block">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-1">
                Nigeria Data Protection Act (NDPA) 2023 Compliance
              </p>
              <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
                We use secure, strictly necessary cookies to protect your session and ensure bank-level encryption (AES-256) while using our portal. By exploring MyTaxGenius, you consent to our Zero-Trust security architecture. <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">Read our robust Security Policy here.</Link>
              </p>
            </div>
          </div>
          <div className="flex w-full md:w-auto space-x-3 flex-shrink-0">
            <button 
              onClick={handleAccept}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-extrabold transition-colors w-full md:w-auto text-center"
            >
              I Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
