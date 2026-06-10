import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ArrowRight, TrendingDown, Wallet, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickTaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState<string>('');

  const calculateTax = (incomeValue: number) => {
    if (incomeValue <= 0) return { tax: 0, effectiveRate: 0, netIncome: 0, monthlyNet: 0 };

    // Approximation for Nigerian PAYE (excluding Pension, NHF, NHIS for quick estimate)
    const cra = Math.max(200000, incomeValue * 0.01) + 0.2 * incomeValue;
    let taxableIncome = incomeValue - cra;
    if (taxableIncome < 0) taxableIncome = 0;

    let tax = 0;

    if (taxableIncome > 300000) {
      tax += 300000 * 0.07;
      taxableIncome -= 300000;
    } else {
      tax += taxableIncome * 0.07;
      taxableIncome = 0;
    }

    if (taxableIncome > 300000) {
      tax += 300000 * 0.11;
      taxableIncome -= 300000;
    } else {
      tax += taxableIncome * 0.11;
      taxableIncome = 0;
    }

    if (taxableIncome > 500000) {
      tax += 500000 * 0.15;
      taxableIncome -= 500000;
    } else {
      tax += taxableIncome * 0.15;
      taxableIncome = 0;
    }

    if (taxableIncome > 500000) {
      tax += 500000 * 0.19;
      taxableIncome -= 500000;
    } else {
      tax += taxableIncome * 0.19;
      taxableIncome = 0;
    }

    if (taxableIncome > 1600000) {
      tax += 1600000 * 0.21;
      taxableIncome -= 1600000;
    } else {
      tax += taxableIncome * 0.21;
      taxableIncome = 0;
    }

    if (taxableIncome > 0) {
      tax += taxableIncome * 0.24;
    }

    const netIncome = incomeValue - tax;
    const effectiveRate = ((tax / incomeValue) * 100).toFixed(1);
    const monthlyNet = netIncome / 12;

    return { tax, effectiveRate, netIncome, monthlyNet };
  };

  const incomeNum = parseFloat(annualIncome.replace(/,/g, '')) || 0;
  const { tax, effectiveRate, netIncome, monthlyNet } = calculateTax(incomeNum);

  const formatCurrency = (val: number) => {
    return '₦' + val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic formatting for thousands separators
    const rawVal = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(rawVal))) {
      const formatted = rawVal ? Number(rawVal).toLocaleString('en-US') : '';
      setAnnualIncome(formatted);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-20 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Text */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-extrabold text-sm border border-amber-100 dark:border-amber-800/50">
              <Calculator className="w-4 h-4 mr-2" /> Quick Estimate
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Know Your <span className="text-emerald-500">Tax Burden</span> Before You File.</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Input your gross annual income to see an instant, rough estimate of your PAYE tax burden based on current Nigerian tax brackets and standard consolidated relief.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link to="/calculator" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-6 py-3 rounded-xl font-bold flex items-center transition-colors shadow-lg">
                Full Tax Calculator <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* Right Interactive Card */}
          <div className="flex-1 w-full max-w-lg lg:max-w-xl">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Annual Gross Income (₦)</label>
                <div className="relative mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₦</span>
                  <input 
                    type="text" 
                    value={annualIncome}
                    onChange={handleInputChange}
                    placeholder="10,000,000"
                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-12 py-4 text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm">
                    <div className="flex items-center text-rose-500 font-bold">
                       <TrendingDown className="w-5 h-5 mr-3" /> Estimated Annual Tax
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(tax)}</div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm">
                    <div className="flex items-center text-emerald-500 font-bold">
                       <Wallet className="w-5 h-5 mr-3" /> Monthly Take-Home
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(monthlyNet)}</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm block">
                     <div className="flex items-center text-blue-500 font-bold">
                       <ShieldCheck className="w-5 h-5 mr-3" /> Effective Tax Rate
                     </div>
                     <div className="text-xl font-black text-slate-900 dark:text-white">{effectiveRate}%</div>
                  </div>
                </div>

                <div className="mt-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                  *This is a simplified estimate assuming standard CRA and no additional tax-exempt deductions like Pension or NHF.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
