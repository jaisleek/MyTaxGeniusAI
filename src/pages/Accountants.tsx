import React, { useState } from 'react';
import { Briefcase, CheckCircle, ShieldCheck, DollarSign, Clock, Users, Send, Loader2 } from 'lucide-react';

export default function Accountants() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    citnNumber: '',
    experience: '1-3',
    linkedin: '',
    consent: false
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 text-center pt-20">
        <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Application Received!</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          Thank you for applying to join the MyTaxGenius network. Our compliance team will securely verify your CITN registration and reach out via email within 48 hours for the next onboarding steps.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="bg-green-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-green-800 transition-colors"
        >
          Return to Application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center relative">
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center bg-gray-800 text-green-400 font-extrabold text-xs px-4 py-2 rounded-full mb-4 uppercase tracking-wider">
            <Briefcase className="w-4 h-4 mr-2" /> Partner Network
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Become a Certified MyTaxGenius Accountant.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Our automated tools handle the small traders. For growing SMEs, our premium feature matches them directly with certified CITN professionals like you.
          </p>
        </div>
      </section>

      {/* Benefits Content */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-20 mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 duration-300 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-slate-800 text-center">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-lg mb-2">Zero Marketing Needed</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">We pool high-value SME clients directly from our platform into your dashboard. Review ledgers, not leads.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 duration-300 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-slate-800 text-center">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-lg mb-2">Guaranteed Payments</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Earn dedicated hourly consulting fees through our secure subscription model. Paid monthly, directly to your bank account.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 duration-300 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-slate-800 text-center">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-lg mb-2">Work Anywhere</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Log in alongside the MyTaxGenius assistant. Review corporate taxes remotely from your phone or laptop.</p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 duration-300 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex items-center space-x-4">
            <ShieldCheck className="w-10 h-10 text-green-700 dark:text-green-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Apply for the Professional Network</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">You must hold an active CITN or ICAN registration to be approved.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Legal Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Adebayo Ogunlesi"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500"
                  placeholder="accountant@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500"
                  placeholder="0800..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 font-medium"
                >
                  <option value="1-3">1 to 3 Years</option>
                  <option value="4-7">4 to 7 Years</option>
                  <option value="8-12">8 to 12 Years</option>
                  <option value="13+">13+ Years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">CITN / ICAN Registration Number</label>
              <input
                type="text"
                name="citnNumber"
                required
                value={formData.citnNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 font-mono"
                placeholder="CITN-XXXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-2">We will cross-reference this directly with official registries.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn Profile URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="flex items-start bg-blue-50 p-4 rounded-xl border border-blue-100">
              <input
                type="checkbox"
                name="consent"
                id="consent"
                required
                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="consent" className="ml-3 text-sm text-gray-700 font-medium">
                I certify that the professional details provided above are authentic. I consent to MyTaxGenius storing and verifying my data under the NDPR policy for onboarding purposes.
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-gray-900 text-white font-extrabold py-4 rounded-xl flex justify-center items-center hover:bg-black transition-colors shadow-lg disabled:opacity-50 mt-6"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Verifying Credentials...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
