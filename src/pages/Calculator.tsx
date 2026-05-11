import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Percent, Briefcase, User, Factory } from "lucide-react";

type UserType = "employee" | "freelancer" | "company" | "vat";
type Mode = "monthly" | "yearly";

export default function Calculator() {
  const [income, setIncome] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("employee");
  const [mode, setMode] = useState<Mode>("monthly");
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [usdRate, setUsdRate] = useState<string>("1500");
  
  const [vatType, setVatType] = useState<"standard" | "exempt">("standard");

  // NRS PIT Data
  const amount = Number(income || 0);
  const rate = Number(usdRate || 1500);
  
  // Base Annual Income
  let baseMonthly = mode === "monthly" ? amount : amount / 12;
  let baseAnnual = mode === "monthly" ? amount * 12 : amount;
  
  if (currency === "USD" && userType === "freelancer") {
    baseMonthly = baseMonthly * rate;
    baseAnnual = baseAnnual * rate;
  }

  // Common formatters
  const formatNaira = (value: number) =>
    `₦${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const calculatePIT = (gross: number) => {
    // NRS PIT Structure (Simplified)
    // No more CRA (Consolidated Relief Allowance) based on 2024/2025 reforms note
    
    let taxableIncome = gross;
    
    let tax = 0;
    if (taxableIncome <= 0) {
      tax = 0; // No minimum tax for individuals under new reform? Actually, let's keep it 0
    } else {
      const bands = [
        { limit: 800000, rate: 0.00 },
        { limit: 2200000, rate: 0.15 },
        { limit: 7000000, rate: 0.18 },
        { limit: 40000000, rate: 0.21 },
        { limit: Infinity, rate: 0.25 }
      ];
      
      for (const band of bands) {
        if (taxableIncome > 0) {
          const taxableInBand = Math.min(taxableIncome, band.limit);
          tax += taxableInBand * band.rate;
          taxableIncome -= taxableInBand;
        }
      }
    }
    
    return { tax };
  };

  const renderEmployeeFreelancer = () => {
    const { tax } = calculatePIT(baseAnnual);
    const netAnnual = baseAnnual - tax;
    const netMonthly = netAnnual / 12;
    
    return (
      <div className="space-y-4 mt-6">
        <div className="p-4 rounded-2xl bg-slate-50 border shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-2">Annual Breakdown (NRS Standard)</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-slate-500">Gross Income:</span>
            <span className="font-bold text-right">{formatNaira(baseAnnual)}</span>
            
            <div className="col-span-2 h-px bg-slate-200 my-1"></div>
            
            <span className="text-slate-800 font-bold">Annual Personal Income Tax (PIT):</span>
            <span className="text-right text-red-600 font-bold">-{formatNaira(tax)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm flex flex-col justify-center text-center py-6">
            <p className="text-xs text-emerald-700 font-semibold mb-1">Net Annual</p>
            <p className="text-xl font-black text-emerald-800">{formatNaira(netAnnual)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm flex flex-col justify-center text-center py-6">
            <p className="text-xs text-blue-700 font-semibold mb-1">Net Monthly</p>
            <p className="text-xl font-black text-blue-800">{formatNaira(netMonthly)}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 bg-white p-3 rounded-xl border">
          💡 Calculated based on proposed 2025 NRS Personal Income Tax (PIT) brackets (0% to 25%).
          First ₦800,000 is tax-free. No CRA applied.
        </p>
      </div>
    );
  };

  const renderCompany = () => {
    let citRate = 0;
    if (baseAnnual > 100000000) citRate = 0.3; // Large
    else if (baseAnnual > 50000000) citRate = 0.2; // Medium
    else citRate = 0; // Small (Exempt up to 50M)
    
    const citTax = baseAnnual * citRate;
    const tetTax = citRate > 0 ? baseAnnual * 0.03 : 0; // Tertiary Education Tax usually applies to non-small companies
    const netProfit = baseAnnual - citTax - tetTax;

    return (
      <div className="space-y-4 mt-6">
        <div className="p-4 rounded-2xl bg-slate-50 border shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-2">Company Income Tax (CIT) Breakdown</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-slate-500">Assessable Annual Profit:</span>
            <span className="font-bold text-right">{formatNaira(baseAnnual)}</span>
            
            <span className="text-slate-500">Company Size Indicator:</span>
            <span className="font-bold text-right text-indigo-600">
              {citRate === 0.3 ? "Large (>₦100m)" : citRate === 0.2 ? "Medium (₦50m - ₦100m)" : "Small (≤₦50m - EXEMPT)"}
            </span>
            
            <span className="text-slate-500">CIT ({citRate * 100}%):</span>
            <span className="text-right text-red-600 font-bold">-{formatNaira(citTax)}</span>
            
            <span className="text-slate-500">Education Tax (TET 3%):</span>
            <span className="text-right text-red-600 font-bold">-{formatNaira(tetTax)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm flex flex-col justify-center items-center text-center py-6">
            <p className="text-xs text-emerald-700 font-semibold mb-1">Net Profit After Tax</p>
            <p className="text-2xl font-black text-emerald-800">{formatNaira(netProfit)}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderVAT = () => {
    const vatRate = vatType === "standard" ? 0.075 : 0; // 7.5% Standard, 0% Exempt (Food/Educational)
    const effectiveAmount = mode === "monthly" ? baseMonthly : baseAnnual;
    const vatAmount = effectiveAmount * vatRate;
    
    return (
      <div className="space-y-4 mt-6">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl mb-4">
          <button
            onClick={() => setVatType("standard")}
            className={`flex-1 p-2 rounded-lg text-sm font-semibold transition ${
              vatType === "standard" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Standard (7.5%)
          </button>
          <button
            onClick={() => setVatType("exempt")}
            className={`flex-1 p-2 rounded-lg text-sm font-semibold transition ${
              vatType === "exempt" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Food / Educational (0%)
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border shadow-sm text-center">
          <p className="text-sm text-slate-500 mb-1">Transaction Amount</p>
          <p className="text-2xl font-bold">{formatNaira(effectiveAmount)}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm text-center py-6 flex flex-col justify-center">
            <p className="text-xs text-blue-700 font-semibold mb-1">VAT Amount ({vatRate * 100}%)</p>
            <p className="text-lg font-black text-blue-800">{formatNaira(vatAmount)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm text-center py-6 flex flex-col justify-center">
            <p className="text-xs text-indigo-700 font-semibold mb-1">Total Inclusive</p>
            <p className="text-lg font-black text-indigo-800">{formatNaira(effectiveAmount + vatAmount)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 pb-24 font-sans text-slate-900 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tax Intelligence Engine</h1>
          <p className="text-slate-500 text-sm mt-1">NRS Compliant Tax Calculator</p>
        </div>

        {/* User Type Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[
            { id: "employee", icon: User, label: "Employee" },
            { id: "freelancer", icon: Briefcase, label: "Freelancer" },
            { id: "company", icon: Factory, label: "Company" },
            { id: "vat", icon: Percent, label: "VAT" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setUserType(item.id as UserType)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors border ${
                userType === item.id 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <item.icon className="w-5 h-5 mb-2" />
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="space-y-4">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
             <button
              onClick={() => setMode("monthly")}
              className={`flex-1 p-2 rounded-lg text-sm font-semibold transition ${
                mode === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setMode("yearly")}
              className={`flex-1 p-2 rounded-lg text-sm font-semibold transition ${
                mode === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Yearly
            </button>
          </div>

          {userType === "freelancer" && (
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setCurrency("NGN")}
                className={`flex-1 p-2 rounded-lg text-sm font-semibold transition ${
                  currency === "NGN" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                NGN
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`flex-1 p-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1 ${
                  currency === "USD" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-500"
                }`}
              >
                <DollarSign className="w-4 h-4" /> USD
              </button>
            </div>
          )}

          {currency === "USD" && userType === "freelancer" && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Exchange Rate (NGN per 1 USD)</label>
              <input
                type="number"
                value={usdRate}
                onChange={(e) => setUsdRate(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              {userType === "company" ? "Profit / Revenue" : userType === "vat" ? "Transaction Amount" : "Income Amount"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 font-black text-3xl">
                {currency === "USD" && userType === "freelancer" ? "$" : "₦"}
              </div>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="0.00"
                className="w-full p-4 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-400 outline-none transition-all font-black text-3xl text-slate-900"
              />
            </div>
            {currency === "USD" && userType === "freelancer" && amount > 0 && (
              <div className="flex flex-col sm:flex-row gap-2 mt-2 text-center">
                <div className="flex-1 text-xs text-blue-700 font-bold bg-blue-50 p-2 rounded-lg border border-blue-100">
                  <span className="block font-semibold text-blue-500 mb-0.5 uppercase tracking-wider text-[10px]">Monthly in NGN</span>
                  {formatNaira(baseMonthly)}
                </div>
                <div className="flex-1 text-xs text-indigo-700 font-bold bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                  <span className="block font-semibold text-indigo-500 mb-0.5 uppercase tracking-wider text-[10px]">Yearly in NGN</span>
                  {formatNaira(baseAnnual)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Block */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${userType}-${amount}-${mode}-${currency}-${usdRate}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {userType === "employee" || userType === "freelancer" 
              ? renderEmployeeFreelancer() 
              : userType === "company" 
              ? renderCompany() 
              : renderVAT()
            }
          </motion.div>
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
