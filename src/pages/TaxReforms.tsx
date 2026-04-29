import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Briefcase, Calculator, CheckCircle2, ChevronDown, ChevronUp, PieChart, ShieldCheck, TrendingUp, UserCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'Will these new reforms mean I pay more tax?',
    a: 'Not necessarily. For low-income earners, the tax burden has been significantly reduced, with higher basic exemptions. However, high-net-worth individuals and large corporations face tighter compliance and slightly higher brackets.'
  },
  {
    q: 'What happens to the multiple taxes my business used to pay?',
    a: 'The new reform consolidates over 60 different taxes and levies into just 8 primary tax categories. This means less paperwork, less harassment by unauthorized collectors, and a single unified platform (like NRS) to pay.'
  },
  {
    q: 'Are basic food items still subject to VAT?',
    a: 'No. The recent reforms completely zero-rate basic food items, educational materials, and primary healthcare services to reduce the cost of living for everyday citizens.'
  },
  {
    q: 'How does the new SME exemption work?',
    a: 'If your business turnover is less than ₦100 Million annually, you are 100% exempt from Company Income Tax (CIT) and VAT charging requirements. You only need to file an annual nil return.'
  }
];

export default function TaxReforms() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[#FAFAFA] dark:bg-slate-950 min-h-screen transition-colors duration-300 pb-20">
      {/* HERO SECTION */}
      <div className="bg-[#0F172A] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            2025 Tax Policy Updates
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Decoding the New <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Tax Reforms</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
            Understand how the latest government tax changes impact your everyday finances, business costs, and long-term planning. Practical insights, clear solutions.
          </p>
        </div>
      </div>

      {/* CORE CHANGES (Impact Everyday Finances) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-6">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Taxes Consolidated</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Over 60 scattered nuisance taxes have been merged into 8 broad categories. This removes double taxation and simplifies how you calculate your liabilities.
            </p>
            <div className="flex items-center text-sm font-bold text-rose-500 dark:text-rose-400">
              <ArrowDown className="w-4 h-4 mr-1" /> Massive reduction in paperwork
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <UserCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Everyday Finances</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Basic food items, public transport, and tuition are now strictly VAT-exempt. Your spending power stretches further on essentials, protecting household budgets.
            </p>
            <div className="flex items-center text-sm font-bold text-emerald-500 dark:text-emerald-400">
              <ArrowUp className="w-4 h-4 mr-1" /> Protects lower-income earners
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">SME Relief</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              If your business makes less than ₦100M yearly, you pay 0% CIT. Withholding tax on small transactions has also been slashed to boost cash flow.
            </p>
            <div className="flex items-center text-sm font-bold text-blue-500 dark:text-blue-400">
              <ArrowUp className="w-4 h-4 mr-1" /> Retain more capital for growth
            </div>
          </div>
        </div>
      </div>

      {/* PRACTICAL INSIGHTS: INDIVIDUALS VS BUSINESSES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Practical Action Plans</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Clear solutions on what you need to do right now to remain compliant and avoid missing out on these new financial benefits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Individual Plan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center text-slate-900 dark:text-white mb-2">
                <UserCircle className="w-6 h-6 mr-3 text-emerald-500" />
                <h3 className="text-2xl font-bold">For Individuals / Freelancers</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your specific checklist for the new fiscal year.</p>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Verify Your TIN Linkage</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">NIN is now directly tied to your TIN. Verify that your banks and employers have the identical records to prevent account freezes.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Re-calculate Take Home</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Because basic allowances changed, your PAYE might be lower. Check your payslip or use our calculator to ensure you aren't over-taxed.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">File E-Returns Early</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manual filings are deprecated. Use our AI agent to submit your annual PIT returns directly to the state portal.</p>
                </div>
              </div>
              <Link to="/calculator" className="w-full mt-4 block text-center bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">
                Run Personal Estimate
              </Link>
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center text-slate-900 dark:text-white mb-2">
                <Briefcase className="w-6 h-6 mr-3 text-blue-500" />
                <h3 className="text-2xl font-bold">For Startups & Businesses</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Protect cash flow and maintain corporate compliance.</p>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Implement E-Invoicing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The law now requires business-to-business transactions to pass through central automated tracking. Generate compliant e-invoices instantly via our tool.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Claim SME Exemptions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">If your turnover is &lt; ₦100M, you are exempt from CIT. But you MUST still file a nil return on time to avoid harsh penalties.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Update Withholding Schedules</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">WHT rates have been updated for services and vendor payments. Update your payroll/vendor software to reflect the lower rates.</p>
                </div>
              </div>
              <Link to="/invoice" className="w-full mt-4 block text-center bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">
                Generate E-Invoice
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* COMMON CONCERNS FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-10">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Addressing Common Concerns</h2>
          <p className="text-slate-600 dark:text-slate-400">
            We know change can be intimidating. Here are the facts separating rumors from policy.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-bold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5">
                  <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CLEAR SOLUTIONS CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-emerald-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -m-16 w-64 h-64 bg-emerald-500 rounded-full blur-[50px]"></div>
          <div className="absolute bottom-0 left-0 -m-16 w-64 h-64 bg-emerald-700 rounded-full blur-[50px]"></div>
          
          <div className="relative z-10">
            <ShieldCheck className="w-16 h-16 text-emerald-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Your All-In-One Compliance Solution</h2>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8">
              Don't navigate the reforms alone. MyTaxGenius brings your tax records, returns, exemptions, and government linkage into one automated portal.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/chat" className="w-full sm:w-auto bg-white text-emerald-700 font-extrabold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors">
                Ask Questions Free
              </Link>
              <Link to="/file-tax" className="w-full sm:w-auto bg-emerald-800 text-white border border-emerald-500 font-extrabold px-8 py-4 rounded-xl hover:bg-emerald-900 transition-colors">
                File Securely Now
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
