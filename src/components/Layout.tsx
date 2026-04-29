import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MessageSquare, BookOpen, Quote, Shield, Zap, Menu, X, Twitter, Linkedin, Facebook, Instagram, ChevronDown, Star, Sun, Moon, Mail, Phone, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'motion/react';
import CookieBanner from './CookieBanner';
import FloatingTaxPro from './FloatingTaxPro';
import { Logo } from './Logo';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const mainNav = [
    { name: 'Chat AI', path: '/chat', icon: MessageSquare },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'New Reforms', path: '/reforms', icon: Shield },
    { name: 'Testimonials', path: '/testimonials', icon: Star },
    { name: 'Pricing', path: '/pricing' }
  ];

  const toolsNav = [
    { name: 'Tax Calculator', path: '/calculator' },
    { name: 'Get TIN', path: '/tin' },
    { name: 'File Returns', path: '/file-tax' },
    { name: 'E-Invoice', path: '/invoice' },
    { name: 'Information Hub', path: '/info' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex flex-col font-sans relative selection:bg-emerald-200 selection:text-emerald-900 transition-colors duration-300">
      {/* Floating Island Header */}
      <div className="fixed top-4 w-full z-50 px-4 sm:px-6 pointer-events-none">
        <header className="max-w-7xl mx-auto bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl rounded-2xl lg:rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 pointer-events-auto">
          <div className="px-4 md:px-6 flex justify-between h-16 lg:h-20 items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group cursor-pointer z-50 lg:mr-8">
              <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#184890] dark:text-white transition-colors">
                MyTaxGenius
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 flex-1">
              
              {/* Tools Dropdown */}
              <div className="relative group">
                <button 
                  onMouseEnter={() => setIsToolsDropdownOpen(true)}
                  onMouseLeave={() => setIsToolsDropdownOpen(false)}
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className={cn(
                    "px-2 xl:px-4 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center space-x-1 whitespace-nowrap",
                    isToolsDropdownOpen 
                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400"
                  )}
                >
                  <span>Features</span>
                  <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  onMouseEnter={() => setIsToolsDropdownOpen(true)}
                  onMouseLeave={() => setIsToolsDropdownOpen(false)}
                  className={cn(
                    "absolute top-full left-0 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl py-2 transition-all duration-200 transform origin-top-left",
                    isToolsDropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                  )}
                >
                  {toolsNav.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "block px-5 py-2.5 text-sm font-bold transition-colors",
                        location.pathname === item.path ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30" : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Links */}
              {mainNav.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "px-2 xl:px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center space-x-2 whitespace-nowrap",
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA & Toggle */}
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                to="/login"
                className="text-sm font-extrabold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-2 whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md whitespace-nowrap"
              >
                Create Account
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -mr-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>

        {/* 📱 Mobile Full-Screen Menu Overlay */}
        <div className={cn(
          "lg:hidden absolute top-[calc(100%+10px)] left-0 right-0 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl transition-all duration-300 ease-in-out origin-top z-50 p-4 pointer-events-auto",
          isMobileMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
        )}>
          <div className="flex flex-col space-y-2 pb-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-4 mb-2 mt-4">Features</div>
            {toolsNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-4 rounded-2xl text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors bg-white dark:bg-slate-950 border border-transparent"
              >
                {item.name}
              </Link>
            ))}
            
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-4 mb-2 mt-6">Resources</div>
            {mainNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-4 rounded-2xl text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center"
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-4 py-4 rounded-xl text-lg font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-4 py-4 rounded-xl text-lg font-extrabold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg flex items-center justify-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </header>
      </div>

      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-grow pt-16 lg:pt-24"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <footer className="bg-[#0F172A] text-slate-400 py-16 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand & Socials */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <Logo className="w-8 h-8" />
              <span className="font-extrabold text-xl text-white">MyTaxGenius</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Making Nigerian tax compliance automated, invisible, and strictly NDPR compliant. 
            </p>
            <p className="mt-6 text-slate-500 text-xs">
              <strong>Disclaimer:</strong> An independent tech bridge collaborating with NRS standards.
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start text-sm">
            <h4 className="text-white font-extrabold text-lg mb-6">Contact Us</h4>
            <div className="flex flex-col space-y-4">
              <div className="flex items-start space-x-3 text-slate-400">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-medium hover:text-emerald-400 cursor-pointer transition-colors">hello@my tax genius</span>
              </div>
              <div className="flex items-start space-x-3 text-slate-400">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-medium">+234(0)9058283054</span>
              </div>
              <div className="flex items-start space-x-3 text-slate-400">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-medium">Lagos, Nigeria.</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-end space-y-4 text-sm font-bold text-center md:text-right">
            <Link to="/sme-onboarding" className="hover:text-white transition-colors">
              SMEs: Hire a Tax Pro
            </Link>
            <Link to="/testimonials" className="hover:text-white transition-colors">
              Read Success Stories
            </Link>
            <Link to="/accountants" className="hover:text-white transition-colors">
              Join as Accountant Partner
            </Link>
            <Link to="/blog" className="hover:text-white transition-colors">
              Tax Library & Downloads
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy & Security Policy (NDPR)
            </Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
            <span className="text-slate-500 font-medium pt-4">&copy; 2026 MyTaxGenius.</span>
          </div>
        </div>
      </footer>
      <CookieBanner />
      <FloatingTaxPro />
    </div>
  );
}

