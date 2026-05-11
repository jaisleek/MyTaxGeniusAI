import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { Camera, Upload, Plus, FileText, Receipt, PieChart as PieChartIcon, TrendingUp, Search, Download, Trash2, CheckCircle2, AlertCircle, X, Share2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Logo } from '../components/Logo';
import { Link } from 'react-router-dom';

export default function Expenses() {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [recentScan, setRecentScan] = useState<any>(null);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualExpense, setManualExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    category: 'Travel',
    amount: '',
    status: 'Deductible'
  });

  const [expenses, setExpensesState] = useState(() => {
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

  const setExpenses = (newExpenses: any) => {
    setExpensesState(newExpenses);
    localStorage.setItem('userExpenses', JSON.stringify(newExpenses));
  };

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];

  const categoryData = useMemo(() => {
    const acc: Record<string, number> = {};
    expenses.forEach(exp => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    });
    return Object.keys(acc).map(key => ({
      name: key,
      value: acc[key]
    })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const monthlyTrendData = useMemo(() => {
    const acc: Record<string, number> = {};
    expenses.forEach((exp: any) => {
      const date = new Date(exp.date);
      if (isNaN(date.getTime())) return;
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} '${year.toString().slice(-2)}`;
      acc[key] = (acc[key] || 0) + Number(exp.amount);
    });
    
    return Object.keys(acc).map(key => ({
      month: key,
      amount: acc[key]
    })).reverse(); // simple reverse to keep recent at end if input is newest first
  }, [expenses]);

  const simulateScan = () => {
    setIsScanning(true);
    setScanSuccess(false);
    
    // Simulate OCR processing time
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      const randomAmount = Math.floor(Math.random() * 50000) + 10000;
      setRecentScan({
        merchant: 'Scanned Merchant receipt',
        date: new Date().toISOString().split('T')[0],
        amount: randomAmount,
        category: 'Meals & Entertainment',
        taxDeductible: true,
        confidence: 96
      });
    }, 2500);
  };
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateScan();
    }
  };

  const addScannedExpense = () => {
    if (recentScan) {
      setExpenses([
        {
          id: Date.now(),
          date: recentScan.date,
          merchant: recentScan.merchant,
          category: recentScan.category,
          amount: recentScan.amount,
          status: recentScan.taxDeductible ? 'Deductible' : 'Non-Deductible',
          receipt: true
        },
        ...expenses
      ]);
      setIsScanModalOpen(false);
      setRecentScan(null);
      setScanSuccess(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualExpense.merchant || !manualExpense.amount) return;
    
    setExpenses([
      {
        id: Date.now(),
        date: manualExpense.date,
        merchant: manualExpense.merchant,
        category: manualExpense.category,
        amount: Number(manualExpense.amount),
        status: manualExpense.status,
        receipt: false
      },
      ...expenses
    ]);
    setIsManualModalOpen(false);
    setManualExpense({
      date: new Date().toISOString().split('T')[0],
      merchant: '',
      category: 'Travel',
      amount: '',
      status: 'Deductible'
    });
  };

  const handleShareReport = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'MyTax Genius Expenses',
          text: `Check out my expense report on MyTax Genius! Total Deductible: ₦${expenses.filter(e => e.status === 'Deductible').reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()}`,
          url: window.location.href,
        });
      } else {
        alert('Sharing is not supported in this browser. You can download the PDF instead.');
      }
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Expense Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Using a simple table layout without requiring autoTable library
    const headers = ['Date', 'Merchant', 'Category', 'Amount (NGN)', 'Status'];
    let yPos = 45;
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    
    // Draw headers
    doc.text(headers[0], 14, yPos);
    doc.text(headers[1], 45, yPos);
    doc.text(headers[2], 95, yPos);
    doc.text(headers[3], 150, yPos);
    doc.text(headers[4], 180, yPos);
    
    doc.line(14, yPos + 2, 196, yPos + 2);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    
    expenses.forEach((expense: any) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(expense.date, 14, yPos);
      doc.text(expense.merchant.substring(0, 20), 45, yPos);
      doc.text(expense.category.substring(0, 20), 95, yPos);
      doc.text(Number(expense.amount).toLocaleString(), 150, yPos);
      doc.text(expense.status, 180, yPos);
      yPos += 8;
    });
    
    const safeDate = new Date().toISOString().split('T')[0];
    doc.save(`Expenses_Report_${safeDate}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Main Content (Simplifying layout for standalone page) */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden min-w-0">
        
        {/* Header */}
        <header className="h-auto min-h-[5rem] py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 shrink-0 z-40 shadow-sm relative gap-4">
          <div className="flex items-center gap-4">
             <Link to="/dashboard" className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shrink-0">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             </Link>
             <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 truncate">Smart Expense Tracker</h1>
                <p className="text-sm text-slate-500 font-medium truncate">Auto-categorize receipts for tax deductions</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            <button 
              onClick={() => setIsManualModalOpen(true)}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center shadow-sm shrink-0 text-sm sm:text-base"
            >
              <Plus className="w-5 h-5 mr-1 sm:mr-2" />
              Add Manual
            </button>
            <button 
              onClick={() => setIsScanModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center shadow-sm shrink-0 text-sm sm:text-base"
            >
              <Camera className="w-5 h-5 mr-1 sm:mr-2" />
              Scan Receipt
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-500 truncate">Total Deductible</p>
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 truncate">
                    ₦{expenses.filter(e => e.status === 'Deductible').reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()}
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
                    {expenses.filter(e => e.status === 'Review Needed').length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense by Category Pie Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col min-w-0">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2 text-emerald-600" />
                  Expenses by Category
                </h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Amount']}
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

              {/* Monthly Trend Bar Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col min-w-0">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Monthly Spending Trend
                </h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₦${val >= 1000 ? (val/1000) + 'k' : val}`} />
                      <Tooltip 
                        cursor={{ fill: '#f1f5f9' }} 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Expenses']}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-bold text-slate-900">Recent Expenses</h3>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search expenses..." 
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <button 
                    onClick={handleShareReport}
                    className="w-full sm:w-auto flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleDownloadReport}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Merchant</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Amount (₦)</th>
                      <th className="px-6 py-4">Tax Status</th>
                      <th className="px-6 py-4 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-600">{expense.date}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{expense.merchant}</td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 text-right">
                          {expense.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {expense.status === 'Deductible' && <span className="text-emerald-600 font-bold flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Deductible</span>}
                          {expense.status === 'Review Needed' && <span className="text-amber-600 font-bold flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Needs Review</span>}
                          {expense.status === 'Non-Deductible' && <span className="text-slate-500 font-bold flex items-center"><X className="w-4 h-4 mr-1"/> Non-Deductible</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {expense.receipt ? (
                            <button className="text-emerald-600 hover:text-emerald-700 mx-auto p-1 bg-emerald-50 rounded-md">
                              <FileText className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="text-slate-400 hover:text-slate-600 mx-auto p-1">
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* AI Scan Modal */}
      <AnimatePresence>
        {isScanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Scan Receipt</h3>
                <button onClick={() => setIsScanModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {!isScanning && !scanSuccess && (
                  <>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileUpload} 
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-2xl rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100 hover:border-emerald-400 transition-colors"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                        <Camera className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-emerald-800 text-center mb-1">Tap to capture or upload</p>
                      <p className="text-sm font-medium text-emerald-600/70 text-center">Our AI will extract the data automatically</p>
                    </div>
                  </>
                )}

                {isScanning && (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                      <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-600 animate-pulse" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Analyzing Receipt...</h3>
                    <p className="text-slate-500 text-sm font-medium">Extracting merchant, date, and tax category.</p>
                  </div>
                )}

                {scanSuccess && recentScan && (
                  <div className="animate-fade-in-up">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <h4 className="font-bold text-emerald-900">Data Extracted Successfully</h4>
                        <span className="ml-auto bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded-md">
                          {recentScan.confidence}% Match
                        </span>
                      </div>
                      
                      <div className="space-y-3 bg-white p-4 rounded-xl border border-emerald-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500 text-sm font-bold">Merchant</span>
                          <span className="text-slate-900 font-bold">{recentScan.merchant}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 text-sm font-bold">Date</span>
                          <span className="text-slate-900 font-bold">{recentScan.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 text-sm font-bold">Amount</span>
                          <span className="text-slate-900 font-black">₦{recentScan.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 text-sm font-bold">Category</span>
                          <span className="text-slate-900 font-bold bg-slate-100 px-2 rounded">{recentScan.category}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                          <span className="text-slate-500 text-sm font-bold">Tax Deductible</span>
                          <span className="text-emerald-600 font-bold flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-1"/> Yes
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={addScannedExpense}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                    >
                      Log Expense
                    </button>
                    <button 
                      onClick={() => setScanSuccess(false)}
                      className="w-full mt-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl transition-colors"
                    >
                      Rescan
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl my-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Add Expense Log</h3>
                <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date"
                    required
                    value={manualExpense.date}
                    onChange={(e) => setManualExpense({...manualExpense, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Merchant</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., Shoprite, MTN..."
                    value={manualExpense.merchant}
                    onChange={(e) => setManualExpense({...manualExpense, merchant: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Amount (₦)</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      placeholder="0.00"
                      value={manualExpense.amount}
                      onChange={(e) => setManualExpense({...manualExpense, amount: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={manualExpense.category}
                      onChange={(e) => setManualExpense({...manualExpense, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option>Travel</option>
                      <option>Meals & Ent.</option>
                      <option>Office Supplies</option>
                      <option>Telecommunication</option>
                      <option>Utilities</option>
                      <option>Software</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tax Status</label>
                  <select
                    value={manualExpense.status}
                    onChange={(e) => setManualExpense({...manualExpense, status: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option>Deductible</option>
                    <option>Non-Deductible</option>
                    <option>Review Needed</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm">
                    Save Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
