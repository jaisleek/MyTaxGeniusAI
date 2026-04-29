import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, LogOut, Bell, ChevronDown, RefreshCw, 
  LayoutDashboard, FileText, FolderOpen, CreditCard, 
  MessageSquare, AlertTriangle, CheckCircle2, Download,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Logo } from '../components/Logo';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Taxpayer');

  useEffect(() => {
    // Listen to Firebase auth state to get the user's name
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName);
        }
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B132B] text-slate-400 flex flex-col transition-all duration-300 hidden md:flex">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 mb-6">
          <Link to="/" className="flex items-center">
            <Logo className="w-8 h-8 mr-3 transition-transform hover:scale-105" />
            <span className="font-extrabold text-xl tracking-tight text-white hover:text-emerald-400 transition-colors">
              MyTaxGenius
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Overview
          </Link>
          <Link to="/file-tax" className="flex items-center px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5 mr-3" />
            Tax Returns
          </Link>
          <Link to="/file-tax" className="flex items-center px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
            <CreditCard className="w-5 h-5 mr-3" />
            Payments
          </Link>
          <Link to="/tcc" className="flex items-center px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
            <FolderOpen className="w-5 h-5 mr-3" />
            Documents
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link 
            to="/chat"
            className="flex items-center w-full px-4 py-3 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition-colors font-bold"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            AI Tax Assistant
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center text-slate-800 font-bold text-lg">
            Taxpayer Dashboard
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <button 
              onClick={() => navigate('/chat')}
              className="hidden sm:flex items-center bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Quick Actions
            </button>
            
            <div className="flex items-center border-l border-slate-200 pl-6 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mr-3 uppercase">
                {userName.charAt(0)}
              </div>
              <span className="font-bold text-sm text-slate-700 group-hover:text-slate-900 transition-colors mr-2">
                {userName}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            </div>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Warning Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-800 mb-1">Action Required: Link your BVN</h3>
                  <p className="text-sm font-medium text-amber-700 leading-relaxed">
                    To process your Tax Clearance Certificate (TCC) and file returns seamlessly, you must securely link your BVN to your taxpayer profile.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/tin')}
                className="shrink-0 bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center"
              >
                Link BVN Now
              </button>
            </motion.div>

            {/* Greeting */}
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back, {userName}</h1>
              <p className="text-slate-500 font-medium">Here's a summary of your current tax standing.</p>
            </div>

            {/* Wallets / Summaries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Outstanding Tax */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Total Tax Liability</p>
                  <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight flex items-baseline">
                    <span className="text-2xl mr-1">₦</span>0.00
                  </h2>
                  <button 
                    onClick={() => navigate('/file-tax')}
                    className="w-full sm:w-auto bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center"
                  >
                    Make a Payment
                  </button>
                </div>
              </div>

              {/* Tax Paid */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Total Tax Paid (2024)</p>
                  <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight flex items-baseline">
                    <span className="text-2xl mr-1">₦</span>1,250,500<span className="text-2xl ml-1 text-slate-400">.00</span>
                  </h2>
                  <button 
                    onClick={() => navigate('/tcc')}
                    className="w-full sm:w-auto bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Receipts
                  </button>
                </div>
              </div>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Compliance Profile */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center space-y-5">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Registration Type</p>
                  <span className="font-bold text-slate-700 text-lg">Corporate Entity</span>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">TIN (Tax ID Number)</p>
                  <div className="flex items-center">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-lg tracking-widest border border-emerald-100">2394-8859-001</span>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">BVN Status</p>
                  <div className="flex items-center text-amber-600 font-bold bg-amber-50 w-fit px-3 py-1 rounded-lg border border-amber-100">
                    <AlertTriangle className="w-4 h-4 mr-1.5" />
                    Unlinked
                  </div>
                </div>
              </div>

              {/* Quick File */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">File Annual Return</h3>
                <p className="text-slate-500 font-medium text-sm mb-6 flex-1">
                  Start your 2024 annual tax return filing here. Auto-calculate forms directly.
                </p>
                <button 
                  onClick={() => navigate('/file-tax')}
                  className="text-white bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold flex items-center justify-center transition-colors"
                >
                  Start Filing <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              {/* Tools & Resources */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">My Documents & TCC</h3>
                <p className="text-slate-500 font-medium text-sm mb-6 flex-1">
                  Generate your Tax Clearance Certificate and e-invoices instantly.
                </p>
                <div className="space-y-2 mt-auto">
                  <button 
                    onClick={() => navigate('/tcc')}
                    className="w-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-lg font-bold text-sm transition-colors text-left px-4"
                  >
                    Generate TCC
                  </button>
                  <button 
                    onClick={() => navigate('/invoice')}
                    className="w-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-lg font-bold text-sm transition-colors text-left px-4"
                  >
                    Create E-Invoice
                  </button>
                </div>
              </div>

            </div>

            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col sm:flex-row items-center justify-between shadow-lg">
              <div className="absolute left-0 top-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10 flex items-center mb-5 sm:mb-0 max-w-xl">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-5 shrink-0">
                  <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Meet your AI Tax Advisor</h3>
                  <p className="text-emerald-100/80 font-medium text-sm sm:text-base">
                    Not sure what expenses are deductible? Need help calculating your VAT? Chat with our AI immediately.
                  </p>
                </div>
              </div>
              <Link 
                to="/chat"
                className="relative z-10 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold transition-colors shrink-0 text-center"
              >
                Chat with AI
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
