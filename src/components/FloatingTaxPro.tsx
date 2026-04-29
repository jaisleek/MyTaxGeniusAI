import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FloatingTaxPro() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the floating button if we're already on the chat page
  if (location.pathname === "/chat") return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
      <motion.button
        onClick={() => navigate("/chat")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative group flex items-center justify-center p-0 rounded-full focus:outline-none cursor-pointer"
      >
        {/* Pulsing Behind Effect */}
        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30 group-hover:opacity-60 duration-1000"></div>

        {/* Avatar */}
        <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 border-4 border-white dark:border-slate-800 shadow-[0_8px_30px_rgba(16,185,129,0.4)] overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&h=200&fit=crop&crop=faces"
            alt="Nigerian Tax Expert"
            className="w-full h-full object-cover"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Notification Badge */}
        <span className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full z-20 shadow-lg animate-pulse flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
        </span>

        {/* Tooltip Label */}
        <div className="absolute -top-32 md:-top-36 right-0 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs md:text-sm font-bold px-5 py-4 rounded-2xl md:rounded-br-none shadow-xl border border-slate-200 dark:border-slate-700 w-64 z-30 flex flex-col pointer-events-none transform transition-all duration-300 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 origin-bottom-right">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-emerald-500">
              <MessageSquare className="w-5 h-5" fill="currentColor" />
            </span>
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 font-extrabold leading-tight">Tax Expert AI</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Online & Ready</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-xs leading-relaxed">
            Hello! Click below to enter the portal and chat securely about your taxes, NDPR compliance, or to generate a new TIN.
          </p>
        </div>
      </motion.button>
    </div>
  );
}
