import React, { useState } from 'react';
import { Building2, CheckCircle2, Loader2 } from 'lucide-react';

export default function TinRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: 'SME'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/tin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data.tin);
      } else {
        setError(data.error || 'Failed to register TIN');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-8">Your Tax Identification Number has been generated.</p>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Your TIN</p>
            <p className="text-4xl font-mono font-bold text-green-700 tracking-widest">{result.tin}</p>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            An SMS confirmation has been sent to {result.phone}. Please keep your TIN safe as you will need it for all future tax filings.
          </p>
          
          <button 
            onClick={() => setResult(null)}
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Get Your TIN</h1>
        <p className="text-gray-600 mt-2">Register your business to receive your Tax Identification Number instantly.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                required
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                required
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                required
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (For SMS)</label>
              <input 
                required
                type="tel" 
                name="phone"
                placeholder="+234..."
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business/Company Name</label>
            <input 
              required
              type="text" 
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <select 
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="SME">Small/Medium Enterprise (SME)</option>
              <option value="Corporate">Corporate Entity</option>
              <option value="Individual">Individual / Freelancer</option>
            </select>
          </div>

          <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <input 
              required
              type="checkbox" 
              id="consent"
              className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="consent" className="text-sm text-gray-600">
              I consent to the processing of my personal and corporate data in accordance with the <a href="/privacy" className="text-green-700 hover:underline">Nigeria Data Protection Regulation (NDPR)</a> and the NRS Privacy Policy.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors flex justify-center items-center disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Generate TIN'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
