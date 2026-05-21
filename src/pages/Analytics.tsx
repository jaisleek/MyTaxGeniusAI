import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, BarChart2, ShieldAlert, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, ShieldCheck, HelpCircle, 
  Download, Filter, Calendar, ArrowRight, Share2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [timeframe, setTimeframe] = useState<'6m' | '1y' | 'ytd'>('1y');

  // Simulated Data
  const monthlyData = [
    { name: 'Jan', income: 450000, expenses: 120000, tax: 45000 },
    { name: 'Feb', income: 520000, expenses: 135000, tax: 55000 },
    { name: 'Mar', income: 480000, expenses: 210000, tax: 48000 }, // High expense month
    { name: 'Apr', income: 610000, expenses: 140000, tax: 65000 },
    { name: 'May', income: 590000, expenses: 155000, tax: 62000 },
    { name: 'Jun', income: 650000, expenses: 310000, tax: 68000 }, // Splurge
    { name: 'Jul', income: 720000, expenses: 180000, tax: 75000 },
    { name: 'Aug', income: 680000, expenses: 160000, tax: 71000 },
    { name: 'Sep', income: 850000, expenses: 220000, tax: 88000 },
    { name: 'Oct', income: 810000, expenses: 190000, tax: 84000 },
    { name: 'Nov', income: 920000, expenses: 280000, tax: 95000 },
    { name: 'Dec', income: 1100000, expenses: 450000, tax: 115000 }
  ];

  const expenseCategories = [
    { name: 'Software & Tools', value: 350000, color: '#10b981' },
    { name: 'Travel & Meetings', value: 420000, color: '#3b82f6' },
    { name: 'Office Supplies', value: 150000, color: '#f59e0b' },
    { name: 'Internet & Comm', value: 240000, color: '#8b5cf6' },
    { name: 'Miscellaneous', value: 850000, color: '#ef4444' } // High risk
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  const riskFactors = [
    {
      title: "High 'Miscellaneous' Deductions",
      description: "Your unclassified expenses represent over 30% of your total deductions. The FIRS flags returns with excessive miscellaneous write-offs.",
      impact: "High",
      status: "warning"
    },
    {
      title: "Entertainment vs Income Ratio",
      description: "Travel and entertainment expenses match industry averages for your income bracket.",
      impact: "Low",
      status: "good"
    },
    {
      title: "Consistent Revenue Growth",
      description: "Monthly revenue has grown consistently, matching your estimated tax deposits.",
      impact: "Positive",
      status: "good"
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().fullName) {
            setUserName(userDoc.data().fullName);
          } else {
            setUserName(user.displayName || user.email?.split('@')[0] || 'User');
          }
        } catch (error) {
          console.error("Error fetching user", error);
        }
      }
      setTimeout(() => setLoading(false), 800);
    };
    fetchUserData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600 dark:text-slate-400 capitalize">{entry.name}:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Analytics & Audit Shield Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Financial Summary`, 14, 45);
    
    doc.setFontSize(11);
    doc.text(`Total Income (YTD): ${formatCurrency(8380000)}`, 14, 55);
    doc.text(`Deductible Expenses: ${formatCurrency(2550000)}`, 14, 65);
    doc.text(`Est. Tax Savings: ${formatCurrency(382500)}`, 14, 75);

    doc.text(`Audit Risk Score: 24/100`, 14, 95);
    doc.text(`Tax Efficiency: 88%`, 14, 105);

    doc.save(`analytics_report_${new Date().getTime()}.pdf`);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'MyTax Genius Analytics',
          text: `Check out my financial analytics on MyTax Genius! Total Income: ${formatCurrency(8380000)}, Deductible Expenses: ${formatCurrency(2550000)}`,
          url: window.location.href,
        });
      } else {
        alert('Sharing is not supported in this browser. You can export the report instead.');
      }
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Analytics & Audit Shield</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Financial Insights & Risk Analysis</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Hello, {userName}</h2>
              <p className="text-emerald-50 text-opacity-90 max-w-2xl">
                Your estimated tax liability is on track. We've detected 1 potential audit risk factor based on your recent expense patterns.
              </p>
            </div>
            <div className="flex bg-black/20 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <div className="text-center px-4">
                <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider mb-1">Audit Risk Score</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-3xl font-bold text-yellow-300">24</span>
                  <span className="text-emerald-100 text-sm mb-1 pb-0.5">/100</span>
                </div>
              </div>
              <div className="w-px bg-white/20 mx-2"></div>
              <div className="text-center px-4">
                <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider mb-1">Tax Efficiency</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-3xl font-bold text-white">88%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                +14.5% <TrendingUp className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Income (YTD)</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(8380000)}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                -2.4% <TrendingDown className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Deductible Expenses</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(2550000)}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-transparent to-emerald-50 dark:to-emerald-900/10 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 relative z-10">Est. Tax Savings</h3>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 relative z-10">{formatCurrency(382500)}</p>
          </motion.div>
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cash Flow & Tax Trends</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Income vs Expenses over time</p>
              </div>
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {(['6m', '1y', 'ytd'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      timeframe === t 
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} 
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Expense Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Deduction Breakdown</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Where you're saving money</p>
            </div>
            
            <div className="h-50 w-full my-4 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {expenseCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {((category.value / 2010000) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Audit Shield Module */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 rounded-2xl border border-yellow-200 dark:border-yellow-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Audit Shield</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-500">1 Risk Factor Detected</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/chat')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-medium transition-colors text-sm shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Analyze with AI
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {riskFactors.map((factor, index) => (
                <div key={index} className="p-6 sm:p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`mt-1 shrink-0 ${
                      factor.status === 'warning' ? 'text-yellow-500' : 'text-emerald-500'
                    }`}>
                      {factor.status === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{factor.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">{factor.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2 sm:gap-1 pl-9 sm:pl-0">
                    <span className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider font-semibold">Impact</span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      factor.status === 'warning' 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                    }`}>
                      {factor.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
      </main>
    </div>
  );
}
