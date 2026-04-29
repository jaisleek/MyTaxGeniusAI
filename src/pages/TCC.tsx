import React, { useState } from 'react';
import { Award, Search, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function TCC() {
  const [tin, setTin] = useState('');
  const [reason, setReason] = useState('bank');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/tcc/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tin, requestReason: reason })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data.tcc);
      } else {
        setError(data.error || 'Failed to process TCC request');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-10 text-center">
        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Award className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Tax Clearance Certificate (TCC)</h1>
        <p className="text-gray-600 mt-2">Request or verify your electronic TCC for official use.</p>
      </div>

      {!result ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleRequest} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Identification Number (TIN)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  required
                  type="text" 
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  placeholder="Enter your 10-digit TIN"
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of TCC</label>
              <select 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="bank">Opening Corporate Bank Account</option>
                <option value="contract">Government Contract Bidding</option>
                <option value="visa">Visa Processing</option>
                <option value="loan">Loan Application</option>
                <option value="other">Other Official Purposes</option>
              </select>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> A TCC will only be approved if you have filed your returns and paid all assessed taxes for the preceding three (3) years.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !tin}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors flex justify-center items-center disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Check Eligibility & Request TCC'
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
          {result.status === 'Approved' ? (
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8" />
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">TCC Status: {result.status}</h2>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 my-6 text-left space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">TIN:</span>
              <span className="font-mono font-medium">{result.tin}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Request ID:</span>
              <span className="font-mono text-sm">{result.id}</span>
            </div>
            {result.validUntil && (
              <div className="flex justify-between pt-2">
                <span className="text-gray-900 font-bold">Valid Until:</span>
                <span className="font-bold text-green-700">{new Date(result.validUntil).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {result.status === 'Approved' ? (
            <p className="text-gray-600 mb-6">
              Your Tax Clearance Certificate has been generated. You can download the PDF or use the Request ID for third-party verification.
            </p>
          ) : (
            <p className="text-gray-600 mb-6">
              Your request is pending review. This usually happens if there are outstanding tax liabilities or unfiled returns for previous years. Please check your filing history.
            </p>
          )}

          <button 
            onClick={() => setResult(null)}
            className="text-green-700 font-medium hover:text-green-800"
          >
            Make Another Request
          </button>
        </div>
      )}
    </div>
  );
}
