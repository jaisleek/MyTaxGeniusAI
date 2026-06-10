import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Calculator, FileCheck, ArrowRight, ArrowLeft, Loader2, CheckCircle, Sparkles } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'Individual',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const checkUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            businessName: data.businessName || '',
            phone: data.phone || '',
            address: data.address || '',
          }));
        }
      } catch (error) {
        console.error("Error reading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Add small delay to ensure auth state is ready
    const timer = setTimeout(() => {
       checkUser();
    }, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const currentStepData = () => {
    if (step === 0) {
      return (
        <div className="space-y-8 text-center pt-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Welcome to MyTaxGenius!</h1>
            <p className="text-lg text-slate-600 font-medium max-w-lg mx-auto">
              Your intelligent tax companion. Let's get your profile set up so you can access all our powerful features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto pt-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">AI Tax Chat</h3>
              <p className="text-sm text-slate-500 font-medium">Get instant, accurate answers to complex Nigerian tax questions.</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Tax Calculator</h3>
              <p className="text-sm text-slate-500 font-medium">Quickly estimate PAYE, VAT, and CIT without complex spreadsheets.</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Direct Filing</h3>
              <p className="text-sm text-slate-500 font-medium">File your taxes directly to NRS with our guided, seamless interface.</p>
            </div>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-6 pt-4 max-w-xl mx-auto text-left">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">A bit about you</h2>
            <p className="text-slate-500 font-medium">This helps us tailor your tax experience.</p>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Are you an Individual or a Business?</label>
              <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-medium">
                <option value="Individual">Individual (PAYE, Personal Income)</option>
                <option value="Registered Business">Registered Business (Limited, Enterprise)</option>
                <option value="Freelancer">Freelancer / Consultant</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Business / Personal Name</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-medium" placeholder="E.g. Alaba Ventures or John Doe" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-medium" placeholder="0800..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Address / State</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-medium" placeholder="E.g. Lagos, Nigeria" />
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleFinish = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          businessName: formData.businessName,
          businessType: formData.businessType,
          phone: formData.phone,
          address: formData.address,
          onboardingComplete: true
        }, { merge: true });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans text-slate-500 font-medium">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white md:bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-white md:rounded-[2rem] md:shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:border border-slate-100 overflow-hidden min-h-[600px] flex flex-col relative">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
            style={{ width: `${(step / 1) * 100}%` }}
          />
        </div>
        
        <div className="flex-1 p-8 sm:p-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {currentStepData()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          {step > 0 ? (
            <button 
              onClick={handleBack}
              disabled={saving}
              className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-200/50 rounded-xl transition-colors flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          ) : (
            <div></div> // Spacer
          )}
          
          {step < 1 ? (
             <button 
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl flex items-center font-bold shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
             <button 
              onClick={handleFinish}
              disabled={saving}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl flex items-center font-bold shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
              {saving ? 'Completing...' : 'Finish Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
