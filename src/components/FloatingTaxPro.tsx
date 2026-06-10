import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, FileText, Calculator, User, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import aiBotImage from "../assets/images/nigerian_tax_professional_1780747115073.png";

export default function FloatingTaxPro() {
  const [isHovered, setIsHovered] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/chat") return null;

  return (
    <>
      {/* WhatsApp Button Menu (Left Side) */}
      <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50">
        <AnimatePresence>
          {isWhatsAppOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-[calc(100%+1rem)] left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 w-64 overflow-hidden origin-bottom-left"
            >
              <div className="p-4 bg-[#075e54] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">WhatsApp Support</h3>
                  <p className="text-xs text-emerald-100/90">Powered by MyTaxGenius AI</p>
                </div>
                <button 
                  onClick={() => setIsWhatsAppOpen(false)}
                  className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col p-2 gap-1 relative">
                <div className="absolute inset-0 bg-[#efeae2] opacity-30 select-none z-0" style={{ backgroundImage: "radial-gradient(#000000 0.5px, transparent 0.5px)", backgroundSize: "12px 12px" }}></div>
                
                <a
                  href="https://wa.me/15556547445?text=Hi!%20I%20would%20like%20to%20check%20my%20tax%20status."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsWhatsAppOpen(false)}
                  className="relative z-10 px-4 py-3 hover:bg-white/80 dark:hover:bg-slate-700/80 bg-white dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-sm flex items-center gap-3 border border-slate-100 dark:border-slate-700"
                >
                  <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </span>
                  Check Tax Status
                </a>
                
                <a
                  href="https://wa.me/15556547445?text=Hi!%20I%20need%20help%20calculating%20my%20VAT."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsWhatsAppOpen(false)}
                  className="relative z-10 px-4 py-3 hover:bg-white/80 dark:hover:bg-slate-700/80 bg-white dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-sm flex items-center gap-3 border border-slate-100 dark:border-slate-700"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Calculator className="w-4 h-4" />
                  </span>
                  Calculate VAT
                </a>

                <a
                  href="https://wa.me/15556547445?text=Hi!%20I%20would%20like%20to%20speak%20with%20a%20human%20agent."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsWhatsAppOpen(false)}
                  className="relative z-10 px-4 py-3 hover:bg-white/80 dark:hover:bg-slate-700/80 bg-white dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-sm flex items-center gap-3 border border-slate-100 dark:border-slate-700"
                >
                  <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </span>
                  Talk to Human
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          animate={isWhatsAppOpen ? {} : { y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_12px_rgba(37,211,102,0.4)] hover:bg-[#20b858] hover:scale-110 hover:shadow-[0_6px_16px_rgba(37,211,102,0.5)] transition-all duration-300 relative group"
          aria-label="Toggle WhatsApp Menu"
        >
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-bounce"></span>
          {isWhatsAppOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <svg
              className="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Primary Floating Chat AI (Right Side) */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <button
          onClick={() => navigate("/chat")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group flex items-center"
        >
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                className="absolute right-[calc(100%+1rem)] whitespace-nowrap bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:-right-2 before:border-8 before:border-transparent before:border-l-white dark:before:border-l-slate-800"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    AI Online
                  </span>
                </div>
                <p className="font-semibold text-sm">Ask MyTaxGenius AI</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105 border border-slate-200 dark:border-slate-700">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-indigo-50 dark:bg-indigo-900/50">
                <img
                  src={aiBotImage}
                  alt="AI Tax Assistant"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-indigo-600/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="absolute -bottom-1 -left-1 w-7 h-7 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-indigo-500 animate-ping opacity-20" />
               <MessageSquare className="w-3.5 h-3.5 text-white" />
            </div>
            
            <span className="absolute top-0 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></span>
          </div>
        </button>
      </div>
    </>
  );
}
