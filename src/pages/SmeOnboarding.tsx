import React, { useState } from 'react';
import { Building2, CheckCircle, ShieldCheck, TrendingUp, Users, ArrowRight, Loader2, FileCheck, Lock } from 'lucide-react';

export default function SmeOnboarding() {
  const [formData, setFormData] = useState({
    businessName: '',
    tinOrRc: '',
    industry: 'Commerce',
    monthlyRevenue: '0-5m',
    contactName: '',
    email: '',
    phone: '',
    needs: {
      vat: true,
      paye: false,
      cit: true,
    }
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      needs: {
        ...prev.needs,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="max-w-2xl w-full bg-white p-10 md:p-16 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 text-center">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Request Received!</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Your business profile has been securely logged. One of our vetted CITN-certified accountants will contact you within 24 hours to finalize your monthly compliance setup.
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-10">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center"><ShieldCheck className="w-5 h-5 text-emerald-500 mr-2"/> Next Steps</h4>
            <ul className="space-y-3 text-slate-600 text-sm font-medium">
              <li>1. Accountant reviews your business volume ({formData.monthlyRevenue}/mo).</li>
              <li>2. We generate your secure MyTaxGenius Dashboard invite.</li>
              <li>3. You never worry about NRS deadlines again.</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-slate-900 text-white font-extrabold py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 🚀 PREMIUM HERO SECTION FOR SMES */}
      <section className="bg-[#0F172A] pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[120px]"></div>
          <div className="absolute top-[60%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold mb-6 uppercase tracking-wider text-xs shadow-sm">
            <TrendingUp className="w-4 h-4 mr-2" /> MyTaxGenius Premium for Business
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Hire a Dedicated Tax Accountant. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Zero Agency Fees.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Stop losing sleep over NRS audits. We match your business with a strictly vetted, registered professional to handle your VAT, CIT, and PAYE filings every single month.
          </p>
        </div>
      </section>

      {/* 🚀 ONBOARDING FLOW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Value Proposition Side Panel */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="font-extrabold text-xl text-slate-900 mb-6">Why SMEs Choose Us</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0 mr-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Vetted Professionals</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Every accountant is ICAN/CITN verified to protect your business.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0 mr-4">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Full Audit Defense</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">If NRS knocks, your dedicated accountant stands between them and you.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 flex-shrink-0 mr-4">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">100% Digital</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Upload receipts via our app. They file it via the government portal. Done.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A] rounded-3xl p-8 shadow-xl border border-slate-800 text-center">
              <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">NDPR Secure</h4>
              <p className="text-slate-400 text-sm font-medium">Your financial data is encrypted and never shared outside your assigned accountant.</p>
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="w-full lg:w-2/3 bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Get Started</h2>
            <p className="text-slate-500 font-medium mb-8">Tell us about your business to get matched with the right accountant.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Business Details</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Business / Company Name</label>
                    <input
                      type="text" required name="businessName" value={formData.businessName} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
                      placeholder="e.g. Alaba Tech Ventures Ltd"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">TIN or RC Number</label>
                    <input
                      type="text" required name="tinOrRc" value={formData.tinOrRc} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono text-sm"
                      placeholder="e.g. 2334455-0001"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Industry</label>
                    <select name="industry" value={formData.industry} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium">
                      <option value="Commerce">Trade & Commerce</option>
                      <option value="Tech">Technology / Software</option>
                      <option value="Agency">Agency / Services</option>
                      <option value="Logistics">Logistics / Transport</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Est. Monthly Revenue</label>
                    <select name="monthlyRevenue" value={formData.monthlyRevenue} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium">
                      <option value="0-5m">Under ₦5 Million</option>
                      <option value="5m-20m">₦5m - ₦20 Million</option>
                      <option value="20m-50m">₦20m - ₦50 Million</option>
                      <option value="50m+">Above ₦50 Million</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Services Required */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Services Needed Every Month</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.needs.vat ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                    <input type="checkbox" name="vat" checked={formData.needs.vat} onChange={handleCheckboxChange} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300" />
                    <span className="ml-3 font-bold text-slate-900">VAT Filing</span>
                  </label>
                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.needs.cit ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                    <input type="checkbox" name="cit" checked={formData.needs.cit} onChange={handleCheckboxChange} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300" />
                    <span className="ml-3 font-bold text-slate-900">CIT / WHT</span>
                  </label>
                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.needs.paye ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                    <input type="checkbox" name="paye" checked={formData.needs.paye} onChange={handleCheckboxChange} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300" />
                    <span className="ml-3 font-bold text-slate-900">Staff PAYE</span>
                  </label>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Your Contact Details</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Your Full Name</label>
                  <input type="text" required name="contactName" value={formData.contactName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium" placeholder="CEO / Manager Name" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Details</label>
                    <input type="email" required name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                    <input type="tel" required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium" placeholder="0800..." />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-emerald-600 text-white font-extrabold text-lg py-4 rounded-2xl shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center"
                >
                  {status === 'submitting' ? (
                    <><Loader2 className="w-6 h-6 animate-spin mr-2" /> Assigning Accountant...</>
                  ) : (
                    <>Request Dedicated Accountant <ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </button>
                <p className="text-center text-slate-500 text-xs font-medium mt-4">
                  By submitting, you agree to our Terms of Service. No credit card required yet.
                </p>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
