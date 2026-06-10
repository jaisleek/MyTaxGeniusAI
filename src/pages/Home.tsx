import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle, Calculator as CalculatorIcon, Building2, UserCircle, Briefcase, Zap, Fingerprint, Lock, FileText, MessageSquare, Receipt, HelpCircle, BookOpen, Rocket, Smartphone, Play, X, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { TaxBlogSection } from '../components/TaxBlogSection';
import { NigeriaTaxLayer } from '../components/NigeriaTaxLayer';
import { TaxCalendarSystem } from '../components/TaxCalendarSystem';
import { QuickTaxCalculator } from '../components/QuickTaxCalculator';
import { TaxFAQ } from '../components/TaxFAQ';
import { TaxUpdatesFeed } from '../components/TaxUpdatesFeed';
import NearestOfficeMap from '../components/NearestOfficeMap';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Home = () => {
  const [calcSalary, setCalcSalary] = useState<number | ''>('');
  
  // Contact Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Basic static PAYE estimation calculation for the "sticky" preview
  const estimatedTax = typeof calcSalary === 'number' ? (calcSalary * 0.05).toFixed(0) : '0';
  const takeHome = typeof calcSalary === 'number' ? (calcSalary - Number(estimatedTax)).toFixed(0) : '0';

  return (
    <div className="flex flex-col bg-[#FAFAFA] dark:bg-slate-950 transition-colors duration-300 overflow-hidden -mt-[140px] lg:-mt-[160px]">
      
      {/* 🚀 SUPERCHARGED HERO SECTION (Fintech Premium Vibe) */}
      <section className="relative overflow-hidden bg-[#0F172A] pt-40 pb-28 md:pt-[220px] md:pb-40">
        
        {/* Animated Grid & Glow Background */}
        <div className="absolute inset-0 z-0 bg-[#0F172A]">
          {/* subtle animated grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          {/* radial gradient overlay to fade edges */}
          <div className="absolute inset-0 bg-[#0F172A] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        </div>

        {/* Abstract Glowing Backgrounds */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"
        ></motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Copy */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 text-center lg:text-left space-y-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-500/10 to-emerald-500/10 border border-fuchsia-500/20 text-fuchsia-300 font-bold mb-4 shadow-[0_0_20px_rgba(217,70,239,0.15)]">
                <span className="flex h-2 w-2 rounded-full bg-fuchsia-500 mr-2 animate-pulse"></span>
                Authorized NRS Tax Bridge
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                Tax no <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-emerald-400">
                  suppose hard.
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-300 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                MyTaxGenius decodes the new 2025 NRS tax reforms for you. We protect your everyday finances, shield you from multiple taxes, and automate your compliance instantly.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <Link to="/reforms" className="w-full sm:w-auto bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:from-fuchsia-500 hover:to-purple-500 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(192,38,211,0.3)] border border-fuchsia-400/30">
                  Explore 2025 Reforms <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/chat" className="w-full sm:w-auto bg-white/5 text-slate-300 border border-white/10 px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-md">
                  <MessageSquare className="w-5 h-5 mr-3 fill-current opacity-70" /> Talk to AI Expert
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="pt-8 space-y-4"
              >
                <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm font-bold text-slate-500">
                  <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" /> NDPR Secure</div>
                  <div className="flex items-center"><Lock className="w-4 h-4 mr-1 text-emerald-500" /> Encrypted Logs</div>
                </div>

                {/* Quick anchor links to new sections */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quick Jump:</span>
                  <a href="#tax-calendar" className="text-xs bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700 font-bold px-3 py-1.5 rounded-full transition-colors flex items-center">
                    🗓️ Compliance Calendar
                  </a>
                  <a href="#nigeria-layer" className="text-xs bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700 font-bold px-3 py-1.5 rounded-full transition-colors flex items-center">
                    🟢 State & Federal Intelligence
                  </a>
                  <a href="#tax-blog" className="text-xs bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700 font-bold px-3 py-1.5 rounded-full transition-colors flex items-center">
                    📰 Tax News & Blog
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Hero Image Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4, delay: 0.3 }}
              className="flex-1 w-full relative z-20 block mt-12 lg:mt-0"
            >
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto"
              >
                {/* Decorative background glow behind the image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-fuchsia-500/20 rounded-full blur-3xl transform scale-110"></div>
                
                {/* The Main Hero Image */}
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                   <img 
                      src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=1200&auto=format&fit=crop" 
                      alt="Confident Nigerian Business Professional" 
                      className="w-full h-full object-cover object-center"
                   />
                   {/* Gradient overlay to blend the bottom edge smoothly */}
                   <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0F172A] to-transparent"></div>
                </div>

                {/* Floating Widget 1: Fast Resolution */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-4 sm:-left-12 top-1/4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center gap-3 sm:gap-4 scale-90 sm:scale-100"
                >
                  <div className="bg-emerald-500 rounded-full p-2 sm:p-3"><Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></div>
                  <div>
                    <p className="text-white font-black text-base sm:text-lg">Instant</p>
                    <p className="text-emerald-100 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Tax Verification</p>
                  </div>
                </motion.div>

                {/* Floating Widget 2: Security */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -right-4 sm:-right-8 bottom-1/4 bg-[#1E293B]/90 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center gap-3 sm:gap-4 scale-90 sm:scale-100"
                >
                  <div className="bg-fuchsia-500/20 rounded-full p-2 sm:p-3"><ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400" /></div>
                  <div>
                     <p className="text-white font-bold text-xs sm:text-sm">NDPR Compliant</p>
                     <p className="text-slate-400 text-[10px] sm:text-xs font-medium">Bank-grade Security</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 🚀 QUICK TAX CALCULATOR */}
      <QuickTaxCalculator />

      {/* 🚀 LIVE TAX UPDATES FEED */}
      <TaxUpdatesFeed />

      {/* 🚀 FAQ SECTION */}
      <TaxFAQ />

      {/* 🚀 OFFICIAL PARTNERS & MARQUEE BANNER */}
      <section className="bg-white dark:bg-slate-950 transition-colors duration-300 border-b border-slate-100 dark:border-slate-800 py-8 relative z-30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted Data Frameworks & Authoritative Standards</p>
        </div>
        <div className="flex w-[200%] lg:w-max animate-marquee space-x-12 lg:space-x-24 opacity-60 grayscale hover:grayscale-0 transition-opacity duration-300 items-center justify-around">
          {/* Double the content to create infinite scroll effect */}
          {[1,2].map((k) => (
             <React.Fragment key={k}>
               <div className="flex items-center text-slate-800 dark:text-slate-200 font-extrabold text-xl whitespace-nowrap"><ShieldCheck className="w-6 h-6 mr-2 text-slate-700 dark:text-slate-400" /> NDPR Certified</div>
               <div className="flex items-center text-slate-800 dark:text-slate-200 font-extrabold text-xl whitespace-nowrap"><Lock className="w-6 h-6 mr-2 text-slate-700 dark:text-slate-400" /> AES-256 Encryption</div>
               <div className="flex items-center text-slate-800 dark:text-slate-200 font-extrabold text-xl whitespace-nowrap"><Building2 className="w-6 h-6 mr-2 text-slate-700 dark:text-slate-400" /> JTB Protocols</div>
               <div className="flex items-center text-slate-800 dark:text-slate-200 font-extrabold text-xl whitespace-nowrap"><Briefcase className="w-6 h-6 mr-2 text-slate-700 dark:text-slate-400" /> CITN Network</div>
               <div className="flex items-center text-slate-800 dark:text-slate-200 font-extrabold text-xl whitespace-nowrap"><CheckCircle className="w-6 h-6 mr-2 text-slate-700 dark:text-slate-400" /> VGG API Enabled</div>
             </React.Fragment>
          ))}
        </div>
      </section>

      {/* 🚀 METRICS / SCALE SECTION (Modern Fintech Trust Drivers) */}
      <section className="bg-[#FAFAFA] dark:bg-slate-950 transition-colors duration-300 relative z-20 pt-20 pb-4 border-b border-white/50 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Automating compliance across the Nigerian economy.</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Whether you are verifying employee income, registering an SME, or checking exemptions for market traders, MyTaxGenius brings unrivaled precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 text-center shadow-lg shadow-emerald-900/5">
              <div className="text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-2">99.9%</div>
              <p className="text-slate-800 dark:text-slate-200 font-extrabold text-lg mb-1">API Reliability</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Stable infrastructure for accounting & financial integrations.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 text-center shadow-lg shadow-blue-900/5">
              <div className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">~1 Min</div>
              <p className="text-slate-800 dark:text-slate-200 font-extrabold text-lg mb-1">Average Resolution</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Contextual answers delivered via massive, localized NLP models.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 text-center shadow-lg shadow-fuchsia-900/5">
              <div className="text-4xl md:text-5xl font-black text-fuchsia-600 dark:text-fuchsia-400 mb-2">Zero</div>
              <p className="text-slate-800 dark:text-slate-200 font-extrabold text-lg mb-1">Data Breaches</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Architected with Bank-grade (AES-256) data isolation natively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 TACTILE BENTO GRID ACTIONS (Consumer flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Row 1, Col 1 */}
          <motion.div className="md:col-span-1 lg:col-span-1" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/chat" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[280px]">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-inner">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">Ask MyTaxGenius</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed">Chat with our intelligent bot. Get simple answers in Pidgin, Yoruba, Hausa or Igbo instantly.</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 1, Col 2: Tax Calculator */}
          <motion.div className="md:col-span-1 lg:col-span-1" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/calculator" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[280px]">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shadow-inner">
                <CalculatorIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 transition-colors">Tax Calculator</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed">Calculate PAYE, CIT, and VAT accurately with the latest state and federal rates instantly.</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 1, Col 3: 2025 Reforms */}
          <motion.div className="md:col-span-1 lg:col-span-1" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/reforms" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[280px]">
               <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform shadow-inner">
                 <Zap className="w-8 h-8" />
               </div>
               <div>
                 <div className="flex items-center justify-between mb-2">
                   <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">2025 Reforms</h3>
                   <span className="bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                 </div>
                 <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed">Decode the massive new tax laws. Zero VAT on food, multiple taxes merged, and SME cash relief.</p>
               </div>
            </Link>
          </motion.div>

          {/* Row 2, Col 1: Get Your Tax ID */}
          <motion.div className="md:col-span-1 lg:col-span-1" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/tin" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[280px]">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">Get Your Tax ID</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed">Register seamlessly as an individual or business. Conceptualizing active connection to the JTB.</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 2, Col 2: Expense Tracker (Under Tax Calculator) */}
          <motion.div className="md:col-span-1 lg:col-span-1" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/expenses" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[280px]">
              <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform shadow-inner">
                <Receipt className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">Expense Tracker</h3>
                  <span className="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">AI Scan</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed">Auto-categorize receipts for tax deductions. Just scan with your camera and let our AI do the work.</p>
              </div>
            </Link>
          </motion.div>

          {/* Row 2, Col 3: File Returns */}
          <motion.div className="md:col-span-1 lg:col-span-1" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/file-tax" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[280px]">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shadow-inner">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">File Returns</h3>
                  <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Fast</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed">Easily declare your PIT, CIT or VAT straight through our official gateway simulation.</p>
              </div>
            </Link>
          </motion.div>

          {/* WhatsApp / Chat Banner */}
          <motion.div className="md:col-span-2 lg:col-span-3" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <button onClick={(e) => {
              e.preventDefault();
              if ((window as any).Tawk_API) {
                (window as any).Tawk_API.maximize();
              }
            }} className="w-full text-left relative overflow-hidden group bg-[#25D366] hover:bg-[#20b858] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(37,211,102,0.3)] flex flex-col md:flex-row items-center justify-between transition-transform hover:-translate-y-1 duration-300 block">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors duration-700"></div>
              <div className="absolute bottom-0 left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

              <div className="relative z-10 flex-1 md:pr-8 text-center md:text-left mb-8 md:mb-0">
                <div className="inline-flex items-center bg-white/20 text-white px-4 py-1.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest mb-6 shadow-sm mt-2 md:mt-0 backdrop-blur-sm border border-white/30">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Live Support
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                  Chat with <span className="underline decoration-white/50 underline-offset-4">Our Support Team</span>
                </h3>
                <p className="text-white/90 text-base md:text-lg lg:text-xl font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
                  Have questions or need assistance? Our customer support agents are ready to help you with anything you need directly. Connect with WhatsApp or our internal chat AI.
                </p>
                <div className="mt-8 flex flex-row flex-wrap items-center justify-center md:justify-start gap-4">
                  <span className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#25D366] rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-colors cursor-pointer text-center">
                     Live Chat <ArrowRight className="inline-block w-5 h-5 ml-2" />
                  </span>
                  <Link to="/chat" onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl font-bold shadow-sm hover:bg-white/30 transition-colors cursor-pointer text-center">
                    TaxBuddy AI <MessageSquare className="inline-block w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="relative z-10 flex-shrink-0 flex justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center shadow-2xl relative">
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                  <MessageSquare className="w-16 h-16 md:w-20 md:h-20 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </button>
          </motion.div>

          {/* Row 3: Information Hub */}
          <motion.div className="md:col-span-2 lg:col-span-3" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/info" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between h-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform shadow-inner shrink-0">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">Information Hub</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed max-w-3xl">Read structured guides on CIT, PAYE, VAT, and NDPR protocols. Understand your tax rights, limits, and the easiest ways to remain totally compliant without breaking a sweat.</p>
                </div>
              </div>
              <div className="mt-6 md:mt-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl font-bold flex items-center shrink-0 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                Browse Guides <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </motion.div>

          {/* Tax Accountant Full-Width Banner */}
          <motion.div className="md:col-span-2 lg:col-span-3" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/accountant-portal" className="relative overflow-hidden group bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-500 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex flex-col md:flex-row items-center justify-between border border-indigo-500/50 transition-transform hover:-translate-y-1 duration-300">
              
              {/* Decorative Background Elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700"></div>
              <div className="absolute bottom-0 left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

              <div className="relative z-10 flex-1 md:pr-8 text-center md:text-left mb-8 md:mb-0">
                <div className="inline-flex items-center bg-white text-indigo-700 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest mb-6 shadow-lg mt-2 md:mt-0">
                  <Briefcase className="w-4 h-4 mr-2" />
                  For Professionals
                </div>
                <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                  <span className="text-indigo-100 underline decoration-indigo-300/50 underline-offset-4">Tax Accountant</span> Portal
                </h3>
                <p className="text-indigo-50 text-base md:text-lg lg:text-xl font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
                  Manage multiple SMEs from a single, powerful dashboard. Gain restricted access to your clients' ledgers, verify their transactions, and ensure 100% NRS compliance on their behalf.
                </p>
                <div className="mt-8">
                  <span className="inline-flex items-center justify-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm font-bold border border-white/30 shadow-lg group-hover:bg-white text-indigo-800 transition-colors cursor-pointer">
                     Go to Portal <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex-shrink-0 flex justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center shadow-2xl relative">
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                  <UserCircle className="w-16 h-16 md:w-20 md:h-20 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 🚀 ACCOUNTANTS & SME SECTION (Dark Glassmorphism Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 mt-8 relative z-20">
        <div className="bg-[#0F172A] rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-slate-800">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative p-10 lg:p-16 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                <Briefcase className="w-3.5 h-3.5 mr-2" /> For Startups & SMEs
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Your Automated Business Accountant.
              </h2>
              <p className="text-lg text-slate-300 font-medium leading-relaxed">
                Send NRS-compliant e-invoices instantly. Once you grow, upgrade to connect with our network of <strong className="text-white">ICAN/CITN certified professionals</strong> directly on your dashboard.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-center text-slate-200 font-medium text-lg">
                  <CheckCircle className="w-6 h-6 text-fuchsia-400 mr-3 shadow-fuchsia-500/20" /> Auto-calculate 7.5% VAT on invoices
                </li>
                <li className="flex items-center text-slate-200 font-medium text-lg">
                  <CheckCircle className="w-6 h-6 text-cyan-400 mr-3 shadow-cyan-500/20" /> Direct CIT ledger reviews by humans
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link to="/invoice" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-cyan-400 hover:to-blue-500 transition-colors shadow-[0_8px_25px_rgba(6,182,212,0.25)] text-center flex items-center justify-center">
                  Create E-Invoice <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/sme-onboarding" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-colors text-center backdrop-blur-sm">
                  Hire an Accountant
                </Link>
              </div>
            </div>

            {/* Visual element for SME */}
            <div className="flex-1 w-full hidden lg:block">
              <div className="relative p-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl transform rotate-3 scale-105 blur-md"></div>
                <div className="bg-[#1E293B] border border-white/10 rounded-[2rem] p-8 relative shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-5">
                    <h3 className="font-extrabold text-white text-xl">Tax Health Score</h3>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-4 py-1.5 rounded-full text-sm">Excellent</span>
                  </div>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-slate-400 font-medium">VAT Collected</span>
                      <span className="font-bold text-white text-lg">₦145,000</span>
                    </div>
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-slate-400 font-medium">Unpaid Invoices</span>
                      <span className="font-bold text-rose-400 text-lg">3 Pending</span>
                    </div>
                    <div className="pt-2">
                       <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">Quarterly Compliance</span>
                       <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                         <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 w-3/4 h-full rounded-full"></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 NRS COLLABORATION / BRIDGING THE GAP */}
      <section className="bg-white dark:bg-slate-950 transition-colors duration-300 py-24 border-t border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm mb-4 border border-emerald-100 dark:border-emerald-800/50">
              <ShieldCheck className="w-4 h-4 mr-2" /> Authorized API Gateway
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Bridging the Gap for the Nigeria Revenue Service</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 font-medium max-w-3xl mx-auto">We are proudly aligned with the NRS's mission to simplify taxation. By integrating directly with official government APIs, we build trust and make compliance effortless for every Nigerian.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* NRS Vision */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <Building2 className="w-8 h-8 text-slate-400 dark:text-slate-500 mr-3" />
                Nigeria Revenue Service (NRS) Vision
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start">
                  <CheckCircle className="text-slate-400 dark:text-slate-500 mr-3 mt-0.5 font-bold w-5 h-5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Expand the national tax net to include the informal sector.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-slate-400 dark:text-slate-500 mr-3 mt-0.5 font-bold w-5 h-5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Digitalize and automate tax remittance for total transparency.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-slate-400 dark:text-slate-500 mr-3 mt-0.5 font-bold w-5 h-5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Educate citizens on the real benefits of national tax compliance.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-slate-400 dark:text-slate-500 mr-3 mt-0.5 font-bold w-5 h-5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Eliminate localized "multiple taxation" and illegal extortions.</span>
                </li>
              </ul>
            </div>

            {/* MyTaxGenius Bridge */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] p-8 border border-emerald-200 dark:border-emerald-800 shadow-[0_8px_30px_rgb(16,185,129,0.1)] relative">
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-full shadow-lg transform rotate-6">
                WORLD CLASS PARTNER
              </div>
              <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-400 mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mr-3" />
                MyTaxGenius Technology Bridge
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-900 dark:text-emerald-200 font-medium">Translating NRS policies to Pidgin, Yoruba, Hausa & Igbo via AI.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-900 dark:text-emerald-200 font-medium">Securely linking individual taxpayers directly to the JTB databases.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-900 dark:text-emerald-200 font-medium">Standardizing SME accounting with built-in 7.5% E-Invoicing.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-900 dark:text-emerald-200 font-medium">Providing Certified Professionals to ensure flawless ledger reviews.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 SOCIAL PROOF / TESTIMONIALS */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Trusted by Nigerians Everywhere</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 font-medium max-w-2xl mx-auto">See how local businesses and individuals use MyTaxGenius to simplify their compliance and avoid extortion.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Tunde Afolabi",
                role: "SME Owner, Lagos",
                testimony: "Before MyTaxGenius, I used to pay agents ridiculous amounts just to calculate my VAT. The AI correctly identified my exemptions and registered me for my Tax ID in less than a day.",
                rating: 5,
                image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=faces"
              },
              {
                name: "Josh E.",
                role: "Freelance Developer",
                testimony: "I had no idea how foreign income was taxed in Nigeria. I jumped into the chat, asked the AI, and it explained the NDPR compliance and tech exemptions perfectly. Top notch!",
                rating: 5,
                image: "https://images.unsplash.com/photo-1579038773867-044c48829161?w=150&h=150&fit=crop&crop=faces"
              },
              {
                name: "Aisha M.",
                role: "Market Trader",
                testimony: "I don't know much about big tax laws, but the presumptive tax guide helped me calculate exactly what I owe the local government without being extorted.",
                rating: 5,
                image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=150&h=150&fit=crop&crop=faces"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#FAFAFA] dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex space-x-1 mb-6">
                  {[...Array(item.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-amber-400 text-amber-400" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 italic">"{item.testimony}"</p>
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-slate-500 text-sm font-medium">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/testimonials" className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
              Read more stories <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 🚀 NEW: TAX CALENDAR & ALERTS */}
      <div id="tax-calendar"><TaxCalendarSystem /></div>

      {/* 🚀 NEW: NIGERIA TAX INTELLIGENCE LAYER */}
      <div id="nigeria-layer"><NigeriaTaxLayer /></div>

      {/* 🚀 NEW: TAX BLOG SECTION */}
      <div id="tax-blog"><TaxBlogSection /></div>

      {/* 🚀 TRUST / FAQS */}
      <section className="bg-[#FAFAFA] py-24 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Got Questions?</h2>
            <p className="text-lg text-slate-500 mt-4 font-medium max-w-2xl mx-auto">Navigate official tax policies with ease. Ask our AI for quick, simplified interpretations of official NRS guidelines.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Does MyTaxGenius submit my tax directly to NRS?",
                a: "Yes. For users on our compliant plan, we utilize secure NRS endpoint linkages to ensure your PIT, CIT, and VAT returns are logged directly into the government's tax database legally and officially."
              },
              {
                q: "Is my personal financial data secure?",
                a: "Absolutely. We employ bank-level SSL encryption and are fully compliant with the Nigeria Data Protection Regulation (NDPR). Our systems mask your Tax ID and BVN from unauthorized parties."
              },
              {
                q: "I run a small shop. Do I still need to pay tax?",
                a: "Yes, but there is good news! The new tax reforms introduce simple Presumptive Taxes for small shops, and exempt them from complicated withholding taxes. MyTaxGenius calculates exactly the small amount you need to pay, so no 'area boys' can extort you."
              },
              {
                q: "Do I still need an accountant?",
                a: "For small-scale traders and freelancers, our automated tools replace basic accounting fees. However, if you run a large company, our SME subscription gives you direct access to certified CITN professionals inside our app to review your ledgers."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-[#FAFAFA] rounded-2xl p-6 md:p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group">
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 flex items-start">
                  <HelpCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" /> 
                  {faq.q}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed md:pl-9">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
             <Link to="/chat" className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
               Did we miss your question? Ask the AI <ArrowRight className="w-4 h-4 ml-1" />
             </Link>
          </div>
        </div>
      </section>

      {/* ⭐ FEEDBACK SECTION */}
      <section className="bg-slate-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight">We Value Your Feedback</h2>
          <p className="text-slate-400 font-medium text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            MyTaxGenius is continually evolving based on your experiences. Help us build the perfect tax companion for Nigerians.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 flex flex-col items-center justify-center text-center group w-full"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Send an Email</h3>
              <p className="text-slate-400 text-sm">Drop us a detailed message. We read every single email.</p>
            </button>

            <a 
              href="https://wa.me/2340000000000" // Replace with actual number if available, else keep placeholder
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 flex flex-col items-center justify-center text-center group"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">WhatsApp Us</h3>
              <p className="text-slate-400 text-sm">Join our WhatsApp channel to send suggestions directly.</p>
            </a>
          </div>
        </div>
      </section>

      {/* 🚀 FIND NEAREST TAX OFFICE (Google Maps) */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold mb-4 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full text-sm">
                <MapPin className="w-4 h-4" />
                <span>Nationwide Coverage</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Locate a Tax Office.</h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Find the closest FIRS or LIRS physical office to you using our intelligent geolocation map. Essential if you need to perform manual audits or physical verification offline.
              </p>
            </div>
          </div>
          <NearestOfficeMap />
        </div>
      </section>

      {/* 🚀 QUICK CTA FOOTER */}
      <section className="bg-emerald-600 py-16 px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight">Ready to file stress-free?</h2>
        <Link to="/pricing" className="inline-block bg-white text-emerald-900 font-extrabold text-lg px-10 py-5 rounded-2xl shadow-xl hover:scale-105 transition-transform">
          View SME Pricing
        </Link>
      </section>
      {/* Video Modal Overlay */}
      
      {/* 🚀 CONTACT MODAL */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 md:p-8 relative">
                <button 
                  onClick={() => setIsContactModalOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Send us a message</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Have an idea or a question? Let us know below.</p>
                
                {contactSuccess ? (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-6 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-300 mb-2">Message Sent!</h4>
                    <p className="text-emerald-700 dark:text-emerald-400/80 mb-6 font-medium">Thank you for your feedback. We read everything.</p>
                    <button 
                      onClick={() => setIsContactModalOpen(false)}
                      className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setIsSendingContact(true);
                    setTimeout(() => {
                      setIsSendingContact(false);
                      setContactSuccess(true);
                      setContactEmail('');
                      setContactMessage('');
                    }, 1200);
                  }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Your Email</label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="hello@example.com"
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-slate-900 dark:text-white font-medium placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                      <textarea 
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Tell us what you love or what needs fixing..."
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-slate-900 dark:text-white font-medium placeholder-slate-400 resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSendingContact}
                      className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {isSendingContact ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
