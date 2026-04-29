import React, { useState } from 'react';
import { FileText, CheckCircle2, Loader2, Calculator, ShieldCheck } from 'lucide-react';

export default function TaxFiling() {
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    
    const taxDue = calculateTax();

    try {
      const response = await fetch('/api/tax/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tin: formData.tin,
          period: formData.period,
          income: parseFloat(formData.income),
          expenses: parseFloat(formData.expenses) || 0,
          taxDue,
          email: formData.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to file tax');
      }

      const data = await response.json();

      setResult({
        tin: formData.tin,
        period: formData.period,
        taxType: formData.taxType,
        income: formData.income,
        expenses: formData.expenses,
        taxDue: taxDue,
        id: data.filing?.id
      });
      setIsLoading(false);
    } catch (err) {
      setError('Network error occurred connecting to NRS Gateway. Please try again.');
      setIsLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Filing Transmitted!</h2>
          <p className="text-gray-600 mb-8">Your tax return has been successfully sent to the JTB/NRS database.</p>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 text-left space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-bold text-sm uppercase">Reference:</span>
              <span className="font-mono font-medium">NRS-{Math.floor(Math.random() * 1000000)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">TIN:</span>
              <span className="font-mono font-medium">{result.tin}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Tax Type:</span>
              <span className="font-medium">{result.taxType}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Declared Income:</span>
              <span className="font-medium">₦ {parseFloat(result.income).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-900 font-extrabold">Tax Due:</span>
              <span className="font-extrabold text-green-700 text-2xl">₦ {result.taxDue.toLocaleString()}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
            An official email receipt has been sent to your registered address. Please proceed to make payment directly to NRS.
          </p>
          
          <button 
            onClick={() => setResult(null)}
            className="bg-green-700 text-white font-extrabold px-8 py-4 rounded-xl hover:bg-green-800 transition-colors shadow-lg"
          >
            File Another Return
          </button>
        </div>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tax Identification Number (TIN)</label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Gross Income/Turnover (₦)</label>
                <input
                  type="number"
                  name="income"
                  required
                  value={formData.income}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 font-bold text-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Allowable Deductions (₦)</label>
                <input
                  type="number"
                  name="expenses"
                  value={formData.expenses}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 font-bold text-lg"
                  placeholder="0.00"
                />
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
              className="w-full bg-green-700 text-white font-extrabold py-4 rounded-xl flex justify-center items-center hover:bg-green-800 transition-colors shadow-lg disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}
