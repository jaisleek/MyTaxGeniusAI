import React from 'react';
import { Info, BookOpen, Briefcase, Calculator, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InfoHub() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-10 text-center">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Info className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tax Information Hub</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Essential guides and resources for SMEs and Companies in Nigeria.</p>
      </div>

      {/* Seamless NRS Integration Section - Moved to top for visibility */}
      <div className="mb-12 bg-white dark:bg-slate-900 transition-colors duration-300 rounded-2xl shadow-xl border-2 border-emerald-500 dark:border-emerald-600 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-black px-4 py-1 rounded-bl-xl tracking-widest uppercase">
          Official Partner
        </div>
        <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-8">
          <div className="flex items-start mb-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 border border-emerald-200 dark:border-emerald-800/50 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Seamless NRS Integration</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                MyTaxGenius acts as an officially aligned, authorized digital gateway for the Nigeria Revenue Service (NRS). This means our platform connects directly to the Joint Tax Board (JTB) systems.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-colors duration-300 hover:border-emerald-300 dark:hover:border-emerald-700">
               <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mb-3 text-lg">1</div>
               <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-2">Real-Time Verification</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400">Your TIN and corporate details are verified instantaneously against national registries to prevent fraud.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-colors duration-300 hover:border-emerald-300 dark:hover:border-emerald-700">
               <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold mb-3 text-lg">2</div>
               <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-2">Direct Remittance</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400">Calculated payments are safely routed directly into NRS corporate accounts. MyTaxGenius never holds your tax funds.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-colors duration-300 hover:border-emerald-300 dark:hover:border-emerald-700">
               <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold mb-3 text-lg">3</div>
               <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-2">NDPR Data Security</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400">All data transmission utilizes 256-bit encryption strictly adhering to the 2023 Nigeria Data Protection Act.</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors duration-300">
             <span className="text-sm text-slate-500 dark:text-slate-400">Your privacy is our priority.</span>
             <Link to="/privacy" className="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 text-sm flex items-center group transition-colors">
               Read Privacy Policy <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
             </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* SME Guide */}
        <div className="bg-white dark:bg-slate-900 transition-colors duration-300 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-2">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">For SMEs</h2>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-300">Key tax obligations for Small and Medium Enterprises.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">1. Company Income Tax (CIT) Exemption</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Under the Finance Act, small companies with an annual gross turnover of less than ₦100 million are exempted from paying CIT. Medium companies (₦100m - ₦250m) pay a reduced rate of 20%.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">2. Value Added Tax (VAT)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SMEs with an annual turnover of less than ₦100 million are exempt from VAT registration and filing obligations.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">3. Tertiary Education Trust Fund (TETFund)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Small companies are also exempted from the 3% TETFund tax.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">4. Pay-As-You-Earn (PAYE)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you have employees, you must deduct PAYE from their salaries and remit to the State Internal Revenue Service by the 10th of the following month.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Guide */}
        <div className="bg-white dark:bg-slate-900 transition-colors duration-300 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-2">
              <BookOpen className="w-6 h-6 text-green-700 dark:text-green-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">For Large Companies</h2>
            </div>
            <p className="text-sm text-green-800 dark:text-green-300">Standard tax obligations for corporate entities.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">1. Company Income Tax (CIT)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Large companies (turnover above ₦100 million) are required to pay CIT at the standard rate of 30% of their assessed profit.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">2. Value Added Tax (VAT)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The standard VAT rate in Nigeria is 7.5%. Companies must file VAT returns on or before the 21st day of the following month.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">3. Withholding Tax (WHT)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Companies are required to deduct WHT at applicable rates (usually 5% or 10%) on specified transactions and remit to the NRS.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">4. Tax Clearance Certificate (TCC)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A valid TCC is required for government contracts, banking, and expatriate quotas. It is issued only when tax liabilities for the preceding 3 years are cleared.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Library & Insights Section */}
      <div className="mt-12">
        <div className="flex justify-between items-end mb-6 border-b border-gray-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tax Library & Insights</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Latest updates and official documents from our blog.</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Featured Post 1 */}
          <Link to="/blog/new-nrs-tax-reforms-2025" className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 block">Breaking News</span>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Say Bye to "Multiple Taxation": What the New NRS Tax Reforms Mean for Your Business
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                The massive new tax bill just dropped! Zero VAT on food, withholding tax exemptions for SMEs, and 60+ taxes merged into 8. Click here to see how your business benefits.
              </p>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-500 dark:text-gray-500 text-xs">April 16, 2026</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                Read More →
              </span>
            </div>
          </Link>

          {/* Featured Post 2 */}
          <Link to="/blog/wetin-be-tin" className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-600 transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 block">Pidgin Guides</span>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Wetin be TIN and Why You Need Am?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                If you dey do business or you dey receive salary, government say you must get TIN. E easy and e free. See how to get yours.
              </p>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-500 dark:text-gray-500 text-xs">April 15, 2026</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                Read More →
              </span>
            </div>
          </Link>

          {/* Call to Action Card */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-center items-center text-center">
            <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Dive Deeper</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Access the full library of official NRS documents, compliance guides, and expert tax breakdowns.
            </p>
            <Link to="/blog" className="bg-slate-900 dark:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors w-full">
              Explore Full Library
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-900 dark:bg-slate-950 transition-colors duration-300 rounded-2xl p-8 text-white text-center border border-gray-800 dark:border-slate-800 shadow-xl">
        <Calculator className="w-10 h-10 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Need Help Calculating Your Taxes?</h2>
        <p className="text-gray-300 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Our AI-powered Tax Assistant is trained on the latest Nigerian tax laws and can help you estimate your liabilities or answer specific questions.
        </p>
        <Link to="/chat" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors shadow-sm">
          Chat with Assistant
        </Link>
      </div>
    </div>
  );
}
