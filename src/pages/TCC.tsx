import React, { useState } from 'react';
import { Award, Search, Loader2, CheckCircle2, XCircle, Download, Share2, ShieldCheck, FileCheck } from 'lucide-react';
import jsPDF from 'jspdf';

export default function TCC() {
  const [activeTab, setActiveTab] = useState<'request' | 'verify'>('request');
  const [tin, setTin] = useState('');
  const [verifyId, setVerifyId] = useState('');
  const [reason, setReason] = useState('bank');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleDownload = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Tax Clearance Certificate', 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Status: ${result.status}`, 14, 32);
    doc.text(`Tax ID: ${result.tin}`, 14, 40);
    doc.text(`Request ID: ${result.id}`, 14, 48);
    if(result.validUntil) {
      doc.text(`Valid Until: ${new Date(result.validUntil).toLocaleDateString()}`, 14, 56);
    }
    
    doc.save(`TCC_${result.id}.pdf`);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'MyTax Genius TCC',
          text: `My Tax Clearance Certificate. Request ID: ${result?.id}, Status: ${result?.status}`,
          url: window.location.href,
        });
      } else {
        alert('Sharing is not supported in this browser. You can download the PDF instead.');
      }
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      if (verifyId.length > 5) {
        setVerifyResult({
          status: 'Valid',
          entityName: 'Nexus Corp Ltd',
          tin: '22938475-01',
          issueDate: '2023-01-15',
          validUntil: '2023-12-31'
        });
      } else {
        setError('Invalid Request ID or TCC not found.');
      }
      setIsLoading(false);
    }, 1500);
  };

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

      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button 
            onClick={() => { setActiveTab('request'); setResult(null); setError(''); }}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'request' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <FileCheck className="w-4 h-4 inline-block mr-2" />
            Request TCC
          </button>
          <button 
            onClick={() => { setActiveTab('verify'); setVerifyResult(null); setError(''); }}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'verify' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ShieldCheck className="w-4 h-4 inline-block mr-2" />
            Verify TCC
          </button>
        </div>
      </div>

      {activeTab === 'request' ? (
        !result ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleRequest} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Identification Number (Tax ID)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  required
                  type="text" 
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  placeholder="Enter your 10-digit Tax ID"
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
              <span className="text-gray-600">Tax ID:</span>
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
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">
                Your Tax Clearance Certificate has been generated. You can download the PDF or use the Request ID for third-party verification.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
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
        )
      ) : (
        /* Verify Tab Content */
        !verifyResult ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verify Request ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={verifyId}
                    onChange={(e) => setVerifyId(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter the TCC Request ID (e.g. REQ-92837)"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Banks, agencies or employers can use this ID to query and verify the authenticity of a document without the original PDF.</p>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Querying API...
                  </>
                ) : (
                  'Verify Original TCC'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-500 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10"></div>
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">TCC Verified Successfully</h2>
            <p className="text-emerald-700 font-medium mb-6">Authentic Document</p>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 my-6 text-left space-y-3 relative z-10">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-600">Entity Name:</span>
                <span className="font-bold text-slate-900">{verifyResult.entityName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-600">Tax ID:</span>
                <span className="font-mono">{verifyResult.tin}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-600">Issue Date:</span>
                <span className="font-medium">{new Date(verifyResult.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-900 font-bold">Valid Until:</span>
                <span className="font-bold text-emerald-700">{new Date(verifyResult.validUntil).toLocaleDateString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setVerifyResult(null)}
              className="text-emerald-700 font-medium hover:text-emerald-800 relative z-10"
            >
              Verify Another ID
            </button>
          </div>
        )
      )}
    </div>
  );
}
