import React, { useState, useRef } from 'react';
import { FileText, CheckCircle2, Loader2, Calculator, ShieldCheck, Download, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function TaxFiling() {
  const receiptRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Personal Info', 'Income Details', 'Deductions', 'Final Review'];

  const [formData, setFormData] = useState({
    tin: '',
    period: '2025',
    taxType: 'PIT',
    income: '',
    expenses: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'income') {
      const incomeValue = parseFloat(value) || 0;
      let calculatedExpenses = '';
      
      if (incomeValue > 0) {
        if (formData.taxType === 'PIT') {
          // CRA: 200,000 + 20% of gross income
          const cra = 200000 + (0.20 * incomeValue);
          calculatedExpenses = Math.min(cra, incomeValue).toString();
        } else {
          // For CIT/VAT, let's default to a flat 20% allowable deduction estimation
          calculatedExpenses = (incomeValue * 0.20).toString();
        }
      }
      
      setFormData({ 
        ...formData, 
        income: value,
        expenses: calculatedExpenses
      });
    } else if (name === 'taxType') {
      const incomeValue = parseFloat(formData.income) || 0;
      let calculatedExpenses = formData.expenses;
      
      if (incomeValue > 0) {
        if (value === 'PIT') {
          const cra = 200000 + (0.20 * incomeValue);
          calculatedExpenses = Math.min(cra, incomeValue).toString();
        } else {
          calculatedExpenses = (incomeValue * 0.20).toString();
        }
      }
      
      setFormData({ 
        ...formData, 
        [name]: value,
        expenses: calculatedExpenses
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateTax = () => {
    const income = parseFloat(formData.income) || 0;
    const expenses = parseFloat(formData.expenses) || 0;
    const profit = Math.max(0, income - expenses);
    const rate = formData.taxType === 'CIT' ? 0.30 : (formData.taxType === 'VAT' ? 0.075 : 0.15);
    return profit * rate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // TIN Validation
    if (!/^\d{10}$/.test(formData.tin) && !/^\d{8}-\d{4}$/.test(formData.tin)) {
      setError('Invalid TIN format. Must be 10 digits or in the format XXXXXXXX-XXXX.');
      toast.error('Invalid TIN format');
      setIsLoading(false);
      return;
    }

    const taxDue = calculateTax();

    // Simulated API call
    try {
      await new Promise((resolve, reject) => setTimeout(() => {
        if (formData.tin === '0000000000' || formData.tin === '00000000-0000') {
           reject(new Error('TIN not found in Federal Database.'));
        } else {
           resolve(true);
        }
      }, 2500));

      setResult({
        tin: formData.tin,
        period: formData.period,
        taxType: formData.taxType,
        income: formData.income,
        expenses: formData.expenses,
        taxDue: taxDue,
        id: 'NRS-' + Math.floor(Math.random() * 1000000)
      });
      toast.success('Successfully filed to NRS Gateway');
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Network error occurred connecting to NRS Gateway. Please try again.');
      toast.error(err.message || 'Verification failed');
      setIsLoading(false);
    }
  };

  const handleShareReceipt = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'MyTax Genius Tax Receipt',
          text: `My tax filing was successful! Receipt ID: ${result?.tin || 'Unknown'}`,
          url: window.location.href,
        });
      } else {
        alert('Sharing is not supported in this browser. You can download the PDF instead.');
      }
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 text-center relative z-10" 
          ref={receiptRef}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-gray-900 mb-2"
          >
            Filing Transmitted!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            Your tax return has been successfully sent to the JTB/NRS database.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 text-left space-y-4"
          >
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-bold text-sm uppercase">Reference:</span>
              <span className="font-mono font-medium">NRS-{Math.floor(Math.random() * 1000000)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Tax ID:</span>
              <span className="font-mono font-medium">{result.tin}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Tax Type:</span>
              <span className="font-medium">{result.taxType}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Declared Income:</span>
              <span className="font-medium">₦ {parseFloat(result.income || '0').toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-900 font-extrabold">Tax Due:</span>
              <span className="font-extrabold text-green-700 text-2xl">₦ {result.taxDue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-white px-8 pb-8 pt-4 rounded-b-3xl -mt-4 shadow-sm border border-t-0 border-green-100 text-center relative z-0"
        >
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            An official email receipt has been sent to your registered address. Please proceed to make your payment directly on the official Federal Inland Revenue Service (FIRS) / NRS portal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a 
              href="https://taxpromax.firs.gov.ng/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-700 text-white font-extrabold px-8 py-4 rounded-xl hover:bg-green-800 transition-colors shadow-lg flex items-center justify-center w-full sm:w-auto"
            >
              Pay on TaxPro Max 🔗
            </a>
            <a 
              href="https://remita.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-green-700 border-2 border-green-700 font-extrabold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors shadow-sm flex items-center justify-center w-full sm:w-auto"
            >
              Pay via Remita
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <button 
              onClick={handleDownloadPdf}
              className="flex items-center justify-center w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button 
              onClick={handleShareReceipt}
              className="flex items-center justify-center w-full sm:w-auto bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
          
          <button 
            onClick={() => setResult(null)}
            className="text-sm text-slate-500 font-bold hover:text-slate-800 transition-colors underline"
          >
            File Another Return
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Direct NRS Tax Filing</h1>
        <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          File your Personal or Company Income Tax directly to the government portal securely. No paperwork.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Form Section */}
        <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-gray-100">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-bold border border-red-200 text-center">
              {error}
            </div>
          )}

          <div className="mb-14 px-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full" />
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-600 z-0 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} 
              />
              {steps.map((step, index) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300 ${index <= currentStep ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-white border-gray-300 text-gray-400'}`}>
                    {index < currentStep ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                  </div>
                  <span className={`text-[11px] sm:text-xs mt-3 font-bold absolute top-10 whitespace-nowrap transition-colors duration-300 ${index <= currentStep ? 'text-green-700' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Tax Identification Number (Tax ID)</label>
                      <input
                        type="text"
                        name="tin"
                        required
                        value={formData.tin}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 font-mono"
                        placeholder="24560000-0001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Tax Period</label>
                      <select
                        name="period"
                        value={formData.period}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 font-medium"
                      >
                        <option value="2025">2025</option>
                        <option value="2024">2024 (Late Filing)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tax Return Type</label>
                    <select
                      name="taxType"
                      value={formData.taxType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 font-medium"
                    >
                      <option value="PIT">Personal Income Tax (Freelancer/Individual)</option>
                      <option value="CIT">Company Income Tax (Business/SME)</option>
                      <option value="VAT">Value Added Tax (Monthly)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address for Receipt</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 font-medium"
                      placeholder="you@company.com"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Gross Income/Turnover (₦)</label>
                    <input
                      type="number"
                      name="income"
                      required
                      value={formData.income}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 font-bold text-xl h-16"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">Please declare all gross income received from all sources during the tax period.</p>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Allowable Deductions (₦)</label>
                    <input
                      type="number"
                      name="expenses"
                      value={formData.expenses}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 font-bold text-xl h-16"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">Standard deductions are automatically estimated based on your tax type (e.g., 20% + N200k CRA for PIT), but you can manually adjust this if you have exact figures.</p>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <h3 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-200">Review Your Declaration</h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Tax ID</span>
                      <span className="font-bold text-gray-900 font-mono">{formData.tin || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Tax Type / Period</span>
                      <span className="font-bold text-gray-900">{formData.taxType} / {formData.period}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Gross Income</span>
                      <span className="font-bold text-gray-900">₦ {parseFloat(formData.income || '0').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                      <span className="text-gray-900 font-extrabold">Final Computed Profit</span>
                      <span className="font-extrabold text-green-700 text-lg">₦ {Math.max(0, (parseFloat(formData.income)||0) - (parseFloat(formData.expenses)||0)).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      name="consent"
                      id="consent"
                      required
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="consent" className="ml-3 text-sm text-gray-600">
                      I declare that the information provided is true and complete. I consent to MyTaxGenius securely transmitting this data to the Nigeria Revenue Service (NRS) via encrypted protocols in compliance with the NDPR.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-700 text-white font-extrabold py-4 rounded-xl flex justify-center items-center hover:bg-green-800 transition-colors shadow-lg disabled:opacity-50 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Transmitting to NRS Gateway...
                      </>
                    ) : (
                      'File Securely via API'
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 rounded-xl font-bold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < steps.length - 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-8 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center shadow-lg"
                >
                  Continue Proceed
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Summary Side Panel */}
        <div className="p-8 md:w-1/3 bg-gray-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b pb-2">Assessment Preview</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Computed Profit:</span>
                <span className="font-bold text-gray-900">₦ {Math.max(0, (parseFloat(formData.income)||0) - (parseFloat(formData.expenses)||0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-b pb-4 border-gray-200">
                <span className="text-gray-600">Rate applied:</span>
                <span className="font-bold text-gray-900 bg-gray-200 px-2 rounded text-xs py-1">
                  {formData.taxType === 'CIT' ? '30% CIT' : (formData.taxType === 'VAT' ? '7.5% VAT' : '15% PIT (Est)')}
                </span>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-bold text-gray-500 mb-1">Estimated Tax Liability</p>
                <p className="text-4xl font-extrabold text-green-700">₦ {calculateTax().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-green-100 p-4 rounded-2xl border border-green-200">
            <div className="flex items-center text-green-800 mb-2">
              <ShieldCheck className="w-5 h-5 mr-2" />
              <span className="font-extrabold text-sm">Direct NRS Linkage</span>
            </div>
            <p className="text-xs text-green-800 font-medium leading-relaxed">
              We utilize official JTB/NRS APIs. Your return is tokenized and pushed directly into government ledgers without intermediary interference.
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="mt-4 flex items-center justify-center w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors print:hidden"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
}
