import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, LogOut, Bell, ChevronDown, RefreshCw, 
  LayoutDashboard, FileText, FolderOpen, CreditCard, 
  MessageSquare, AlertTriangle, CheckCircle2, Download,
  ArrowRight, Folder, Settings, Shield, X, Mail, Receipt,
  TrendingUp, AlertCircle, PhoneCall, Calculator, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Logo } from '../components/Logo';

import TaxCalendar from './TaxCalendar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Taxpayer');
  const [taxId, setTaxId] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [securityEmail, setSecurityEmail] = useState('');
  const [isEmailSaved, setIsEmailSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [expenses] = useState(() => {
    const saved = localStorage.getItem('userExpenses');
    if (saved) return JSON.parse(saved);
    
    const today = new Date();
    const formatDate = (daysAgo: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().split('T')[0];
    };

    return [
      { id: 1, date: formatDate(12), merchant: 'Mtn Nigeria', category: 'Telecommunication', amount: 15000, status: 'Deductible', receipt: true },
      { id: 2, date: formatDate(8), merchant: 'Arik Air', category: 'Travel', amount: 125000, status: 'Deductible', receipt: true },
      { id: 3, date: formatDate(3), merchant: 'Shoprite', category: 'Office Supplies', amount: 45000, status: 'Review Needed', receipt: false },
      { id: 4, date: formatDate(1), merchant: 'Lagos State Water Corp', category: 'Utilities', amount: 8500, status: 'Deductible', receipt: true },
    ];
  });

  const taxLiabilityData = useMemo(() => {
    const acc: Record<string, number> = {};
    expenses.forEach((exp: any) => {
      const date = new Date(exp.date);
      if (isNaN(date.getTime())) return;
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} '${year.toString().slice(-2)}`;
      acc[key] = (acc[key] || 0) + Number(exp.amount) * 0.15; // Rough liability estimate based on 15% of expenses
    });
    return Object.keys(acc).map(key => ({
      month: key,
      liability: Math.round(acc[key])
    })).reverse();
  }, [expenses]);

  const expenseCategoryData = useMemo(() => {
    const acc: Record<string, number> = {};
    expenses.forEach((exp: any) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    });
    return Object.keys(acc).map(key => ({
      name: key,
      value: acc[key]
    })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const PIE_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#6366f1', '#f43f5e'];

  const notifications = [
    { id: 1, title: 'New Device Login', message: 'Signed in from Chrome on Windows', time: 'Just now', type: 'security' },
    { id: 2, title: 'Calculator Used', message: 'Viewed Personal Income Tax calculations', time: '10m ago', type: 'activity' },
    { id: 3, title: 'Session Started', message: 'Dashboard access granted', time: '1h ago', type: 'activity' },
    { id: 4, title: 'Document Vault', message: 'Vault initialized for the first time', time: '2d ago', type: 'activity' },
  ];

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityEmail.trim() && auth.currentUser) {
      setIsSaving(true);
      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'dashboardAlertSubscriptions', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          await setDoc(docRef, {
            alertEmail: securityEmail
          }, { merge: true });
        } else {
          await setDoc(docRef, {
            userId,
            alertEmail: securityEmail,
            createdAt: serverTimestamp()
          });
        }
        
        setIsEmailSaved(true);
        setTimeout(() => {
          setIsSecurityModalOpen(false);
          setIsEmailSaved(false);
        }, 2000);
      } catch (error) {
        console.error("Error saving alert email:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  useEffect(() => {
    // Listen to Firebase auth state to get the user's name
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Set userName
            if (data.fullName) {
              setUserName(data.fullName);
            } else if (user.displayName) {
              setUserName(user.displayName);
            } else if (user.email) {
              setUserName(user.email.split('@')[0]);
            }
            
            if (data.profilePicture) {
              setProfilePic(data.profilePicture);
            }
            
            if (data.onboardingComplete) {
              setNeedsOnboarding(false);
            } else {
              setNeedsOnboarding(true);
              navigate('/onboarding');
              return;
            }

            // Set/Generate taxId
            if (data.taxId) {
              setTaxId(data.taxId);
            } else {
              // Redirect to TIN setup if no tax ID
              navigate('/tin');
              return;
            }
          } else {
            // Document doesn't exist, flag for onboarding
            setNeedsOnboarding(true);
            setUserName(user.displayName || (user.email ? user.email.split('@')[0] : 'Taxpayer'));
            navigate('/onboarding');
            return;
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          if (user.displayName) setUserName(user.displayName);
          else if (user.email) setUserName(user.email.split('@')[0]);
        }
        
        // Fetch existing alert subscription
        try {
          const docSnap = await getDoc(doc(db, 'dashboardAlertSubscriptions', user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.alertEmail) {
              setSecurityEmail(data.alertEmail);
            }
          }
        } catch (err) {
          console.error("Error fetching alert subscription:", err);
        }
        setIsAuthLoading(false);
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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B132B] text-slate-400 flex flex-col transition-all duration-300 hidden md:flex shrink-0">
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
          <Link to="/expenses" className="flex items-center px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
            <Receipt className="w-5 h-5 mr-3" />
            Expenses
          </Link>
          <Link to="/analytics" className="flex items-center px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
            <BarChart2 className="w-5 h-5 mr-3" />
            Analytics & Audit
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
          <Link 
            to="/settings"
            className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
          >
            <Settings className="w-5 h-5 mr-3" />
            Profile & Settings
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
      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40 shadow-sm relative">
          <div className="flex items-center text-slate-800 font-bold text-lg">
            Taxpayer Dashboard
          </div>
          
          <div className="flex items-center space-x-6 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50 origin-top-right"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-slate-900">Activity Log</h3>
                    <button 
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        setIsSecurityModalOpen(true);
                      }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center"
                    >
                      <Shield className="w-3.5 h-3.5 mr-1" />
                      Alert Settings
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start gap-3">
                        <div className={`mt-0.5 p-2 rounded-full shrink-0 ${notif.type === 'security' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {notif.type === 'security' ? <Shield className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 mb-0.5">{notif.title}</p>
                          <p className="text-xs text-slate-500 mb-1 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">Mark all as read</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              onClick={() => navigate('/chat')}
              className="hidden sm:flex items-center bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Quick Actions
            </button>
            
            <div className="flex items-center border-l border-slate-200 pl-6 cursor-pointer group" onClick={() => navigate('/settings')}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 mr-3 object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mr-3 uppercase">
                  {userName.charAt(0)}
                </div>
              )}
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
            
            {needsOnboarding && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-sm">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mr-4 shrink-0 text-amber-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">Complete Your Profile</h3>
                    <p className="text-amber-800 text-sm font-medium">Please generate or enter your Tax ID and upload your signature to start filing.</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/settings')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap"
                >
                  Set up Profile
                </button>
              </div>
            )}
            
            {/* Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back, {userName}</h1>
                <p className="text-slate-500 font-medium">Here's a summary of your current tax standing.</p>
              </div>
              {taxId && (
                <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl flex items-center shadow-sm">
                  <span className="text-emerald-800 text-sm font-bold mr-2">Tax ID:</span>
                  <span className="font-mono text-emerald-900 tracking-wider font-semibold">{taxId}</span>
                </div>
              )}
            </div>

            {/* AI Assistant & Calculator Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AI Assistant Banner */}
              <div 
                onClick={() => navigate('/chat')}
                className="cursor-pointer bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden flex items-center shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="absolute left-0 top-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex items-center pr-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-4 shrink-0 shadow-inner">
                    <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-0.5">Meet your AI Tax Advisor</h3>
                    <p className="text-emerald-100/80 font-medium text-xs sm:text-sm">
                      Chat with MyTaxGenius to ask tax questions instantly.
                    </p>
                  </div>
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 drop-shadow-md">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <ArrowRight className="w-4 h-4 text-emerald-300" />
                  </div>
                </div>
              </div>

              {/* Tax Calculator Banner */}
              <div 
                onClick={() => navigate('/calculator')}
                className="cursor-pointer bg-white border border-slate-200 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all group relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 flex items-center justify-center">
                </div>
                <div className="relative z-10 flex items-center pr-10">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 border border-blue-200 rounded-2xl flex items-center justify-center mr-4 shrink-0 shadow-sm">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-0.5">Tax Calculator</h3>
                    <p className="text-slate-500 font-medium text-xs sm:text-sm">
                      Quickly estimate your PAYE, VAT, and company income tax.
                    </p>
                  </div>
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 drop-shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 truncate">Total Deductible</p>
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 truncate">
                    ₦{expenses.filter((e: any) => e.status === 'Deductible').reduce((sum: number, e: any) => sum + Number(e.amount), 0).toLocaleString()}
                  </h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-500 truncate">Receipts Logged</p>
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 truncate">{expenses.length}</h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-500 truncate">Needs Review</p>
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 truncate">
                    {expenses.filter((e: any) => e.status === 'Review Needed').length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Wallets / Summaries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Outstanding Tax */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 w-full min-w-0">
                  <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider truncate">Total Tax Liability</p>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-8 tracking-tight flex items-baseline truncate">
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
                <div className="relative z-10 w-full min-w-0">
                  <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider truncate">Total Tax Paid (2024)</p>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-8 tracking-tight flex items-baseline truncate">
                    <span className="text-2xl mr-1">₦</span>1,250,500<span className="text-xl lg:text-2xl ml-1 text-slate-400">.00</span>
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Tax Liability Chart */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col min-w-0">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Tax Liability</h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taxLiabilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₦${val}`} />
                      <Tooltip 
                        cursor={{ fill: '#f1f5f9' }} 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`₦${value}`, 'Liability']}
                      />
                      <Bar dataKey="liability" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expense Categories Chart */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col min-w-0">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Expense Categories</h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {expenseCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`₦${value}`, 'Amount']}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle" 
                        wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Compliance Profile */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center space-y-5">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Registration Type</p>
                  <span className="font-bold text-slate-700 text-lg">Corporate Entity</span>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">State / Federal Tax ID</p>
                  <div className="flex items-center">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-lg tracking-widest border border-emerald-100">2394-8859-001</span>
                  </div>
                </div>
              </div>

              {/* Monthly Filing (VAT & WHT) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Monthly VAT & WHT</h3>
                <p className="text-slate-500 font-medium text-sm mb-6 flex-1">
                  File and remit your monthly Value Added Tax (VAT) and Withholding Tax (WHT).
                </p>
                <button 
                  onClick={() => navigate('/file-tax')}
                  className="text-white bg-amber-500 hover:bg-amber-600 py-3 rounded-xl font-bold flex items-center justify-center transition-colors"
                >
                  Start Filing <ArrowRight className="w-4 h-4 ml-2" />
                </button>
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

              {/* Digital Vault */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5">
                  <Folder className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Digital Vault</h3>
                <p className="text-slate-500 font-medium text-sm mb-6 flex-1">
                  Upload, organize, and manage your documents, TCCs, and invoices safely.
                </p>
                <button 
                  onClick={() => navigate('/vault')}
                  className="mt-auto w-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-3 rounded-xl font-bold flex items-center justify-center transition-colors px-4"
                >
                  Open Vault <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>

            </div>

            {/* Tax Deadline Calendar */}
            <TaxCalendar />

            {/* USSD Offline Component */}
            <div className="bg-indigo-900 border border-indigo-800 rounded-3xl p-6 shadow-sm overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <PhoneCall className="w-32 h-32 text-indigo-400 transform rotate-12" />
               </div>
               <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                 <div className="w-16 h-16 bg-indigo-800 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-700 shadow-inner">
                   <PhoneCall className="w-8 h-8 text-indigo-300" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white mb-2">Offline? No Problem.</h3>
                   <p className="text-indigo-200 text-sm mb-4">
                     You can file and pay your taxes without internet using our USSD integration. Just dial the shortcode from any registered phone number.
                   </p>
                   <div className="inline-flex items-center gap-3 bg-indigo-950/50 backdrop-blur-md border border-indigo-800 px-4 py-2 rounded-xl">
                     <span className="text-sm font-medium text-indigo-300">Fast tracking code:</span>
                     <span className="text-xl font-black text-emerald-400 font-mono tracking-widest">*347*829#</span>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* Security Alert Settings Modal */}
      <AnimatePresence>
        {isSecurityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Security Alerts</h3>
                </div>
                <button onClick={() => setIsSecurityModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
                  Enhance your account security. Add an email address to receive instant notifications for sensitive actions (e.g., successful logins, TCC downloads, new return filings).
                </p>
                <form onSubmit={handleSaveEmail}>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Alert Email Address</label>
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      value={securityEmail}
                      onChange={(e) => setSecurityEmail(e.target.value)}
                      placeholder="alerts@yourcompany.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl outline-none font-medium transition-all"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isEmailSaved || isSaving}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                      isEmailSaved 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-70 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <span>Saving...</span>
                    ) : isEmailSaved ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Settings Saved!</span>
                      </>
                    ) : (
                      <span>Save Security Settings</span>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
