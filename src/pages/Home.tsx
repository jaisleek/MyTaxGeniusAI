import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle, Calculator as CalculatorIcon, Building2, UserCircle, Briefcase, Zap, Fingerprint, Lock, FileText, MessageSquare, Receipt, HelpCircle, BookOpen, Rocket, Smartphone, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [calcSalary, setCalcSalary] = useState<number | ''>('');

  // Basic static PAYE estimation calculation for the "sticky" preview
  const estimatedTax = typeof calcSalary === 'number' ? (calcSalary * 0.05).toFixed(0) : '0';
  const takeHome = typeof calcSalary === 'number' ? (calcSalary - Number(estimatedTax)).toFixed(0) : '0';

  return (
    <div className="flex flex-col bg-[#FAFAFA] dark:bg-slate-950 transition-colors duration-300 overflow-hidden -mt-16 lg:-mt-24">
      
      {/* 🚀 SUPERCHARGED HERO SECTION (Fintech Premium Vibe) */}
      <section className="relative overflow-hidden bg-[#0F172A] pt-36 pb-28 md:pt-48 md:pb-40">
        
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
                className="pt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm font-bold text-slate-500"
              >
                <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" /> NDPR Secure</div>
                <div className="flex items-center"><Lock className="w-4 h-4 mr-1 text-emerald-500" /> Encrypted Logs</div>
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
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
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

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/tin" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[280px]">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">Get Your TIN</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed">Register seamlessly as an individual or business. Conceptualizing active connection to the JTB.</p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
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

          <motion.div className="md:col-span-1 lg:col-span-2" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/file-tax" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[280px]">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shadow-inner">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">File Returns</h3>
                  <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Fast</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed">Easily declare your PIT, CIT or VAT straight through our official gateway simulation. Skip the paperwork and transmit directly to NRS nodes securely.</p>
              </div>
            </Link>
          </motion.div>

          <motion.div className="md:col-span-1 lg:col-span-1" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <Link to="/info" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[280px]">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform shadow-inner">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl lg:text-2xl text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">Information Hub</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-[15px] leading-relaxed">Read structured guides on CIT, PAYE, VAT, and NDPR protocols. Understand your tax rights.</p>
              </div>
            </Link>
          </motion.div>

          {/* WhatsApp Bot Full-Width Banner */}
          <motion.div className="md:col-span-2 lg:col-span-3" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}>
            <div className="relative overflow-hidden group bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(37,211,102,0.3)] flex flex-col md:flex-row items-center justify-between border border-[#25D366]/50 transition-transform hover:-translate-y-1 duration-300">
              
              {/* Decorative Background Elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700"></div>
              <div className="absolute bottom-0 left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

              <div className="relative z-10 flex-1 md:pr-8 text-center md:text-left mb-8 md:mb-0">
                <div className="inline-flex items-center bg-white text-[#128C7E] px-4 py-1.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest mb-6 shadow-lg animate-bounce mt-2 md:mt-0">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Coming Soon
                </div>
                <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                  MyTaxGenius on <span className="text-green-100 underline decoration-green-300/50 underline-offset-4">WhatsApp</span>
                </h3>
                <p className="text-green-50 text-base md:text-lg lg:text-xl font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
                  We are bringing Africa's smartest tax AI straight to your pocket. Soon, you'll be able to chat, file returns, calculate NDPR-compliant deductions, and get instant answers exactly where you already message your friends!
                </p>
              </div>

              <div className="relative z-10 flex-shrink-0 flex justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center shadow-2xl relative">
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                  <MessageSquare className="w-16 h-16 md:w-20 md:h-20 text-white fill-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  {/* A little whatsapp-like tail */}
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white backdrop-blur-md border border-white/30 shadow-lg rounded-full flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-[#128C7E]" />
                  </div>
                </div>
              </div>
            </div>
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
                a: "Absolutely. We employ bank-level SSL encryption and are fully compliant with the Nigeria Data Protection Regulation (NDPR). Our systems mask your TIN and BVN from unauthorized parties."
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

      {/* 🚀 QUICK CTA FOOTER */}
      <section className="bg-emerald-600 py-16 px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight">Ready to file stress-free?</h2>
        <Link to="/pricing" className="inline-block bg-white text-emerald-900 font-extrabold text-lg px-10 py-5 rounded-2xl shadow-xl hover:scale-105 transition-transform">
          View SME Pricing
        </Link>
      </section>
      {/* Video Modal Overlay */}
    </div>
  );
}
