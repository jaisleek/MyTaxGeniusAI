import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Briefcase, Building, FileText, CheckCircle, AlertCircle, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Logo } from '../components/Logo';

export default function AccountantSignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    professionalBody: '',
    membershipId: '',
    companyName: '',
    yearsOfExperience: '',
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.professionalBody || !formData.membershipId || !formData.yearsOfExperience) {
      setError("Please fill in all KYC fields.");
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Add user document to Firestore with accountant role
      await setDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: 'accountant',
        status: 'pending_approval',
        kycData: {
          professionalBody: formData.professionalBody,
          membershipId: formData.membershipId,
          companyName: formData.companyName,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
        },
        createdAt: serverTimestamp(),
      });

      // Send Verification Email
      await sendEmailVerification(user);

      setIsSuccess(true);
      setTimeout(() => navigate('/login', { state: { message: "Accountant application submitted! Please verify your email." } }), 5000);
    } catch (err: any) {
      console.error("Signup error:", err);
      let errorMessage = err.message || "Failed to create an account. Please try again.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-200 selection:text-indigo-900 transition-colors duration-300">
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-950 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-linear-to-br from-indigo-600/30 to-purple-600/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>
        
        {/* Logo */}
        <div className="relative z-10 flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105">
            <Logo className="w-10 h-10" />
            <span className="font-extrabold text-2xl tracking-tight text-white">
              MyTaxGenius <span className="text-indigo-400 font-medium">Pro</span>
            </span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Empower your practice with AI.
            </h1>
            <p className="text-indigo-200 text-lg font-medium leading-relaxed mb-10">
              Join the elite network of certified tax professionals. Manage multiple SMEs, automate NDPR compliance, and grow your practice exponentially.
            </p>
            
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-max">
               <Briefcase className="w-8 h-8 text-indigo-400" />
               <div>
                 <p className="text-white font-bold text-sm">Professional Portal</p>
                 <p className="text-indigo-200 text-xs">For certified accountants only</p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-indigo-200/50 text-sm font-medium">
          &copy; {new Date().getFullYear()} MyTaxGenius Pro. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
         {/* Mobile Logo Only */}
         <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <Logo className="w-8 h-8" />
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white transition-colors">
                MyTaxGenius <span className="text-indigo-600 dark:text-indigo-400">Pro</span>
              </span>
            </Link>
         </div>

         <div className="w-full max-w-md">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4 }}
           >
             <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Partner Application</h2>
             <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
               {step === 1 ? "Step 1: Basic Information" : "Step 2: Professional KYC"}
             </p>

             {error && (
               <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 flex items-start space-x-3">
                 <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                 <p className="text-sm font-medium text-red-800 dark:text-red-300 relative top-px">
                   {error}
                 </p>
               </div>
             )}

             {isSuccess && (
               <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 flex items-start space-x-3">
                 <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                 <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 relative top-px">
                   Application submitted securely! Verification email sent to {formData.email}. We will review your credentials within 24-48 hours. Redirecting...
                 </p>
               </div>
             )}

             <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSignup} className="space-y-4">
               <AnimatePresence mode="wait">
                 {step === 1 && (
                   <motion.div
                     key="step1"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-4"
                   >
                     {/* Full Name */}
                     <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Legal Name</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <User className="h-5 w-5 text-slate-400" />
                         </div>
                         <input
                           type="text"
                           name="fullName"
                           value={formData.fullName}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                           placeholder="John Doe"
                         />
                       </div>
                     </div>

                     {/* Email */}
                     <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Email</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Mail className="h-5 w-5 text-slate-400" />
                         </div>
                         <input
                           type="email"
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                           placeholder="john@accountingfirm.com"
                         />
                       </div>
                     </div>

                     {/* Phone */}
                     <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Phone className="h-5 w-5 text-slate-400" />
                         </div>
                         <input
                           type="tel"
                           name="phone"
                           value={formData.phone}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                           placeholder="+234 800 000 0000"
                         />
                       </div>
                     </div>

                     {/* Password */}
                     <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Lock className="h-5 w-5 text-slate-400" />
                         </div>
                         <input
                           type="password"
                           name="password"
                           value={formData.password}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                           placeholder="••••••••"
                         />
                       </div>
                     </div>

                     <button
                       type="submit"
                       className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-6 transition-colors"
                     >
                       Continue to KYC <ArrowRight className="w-5 h-5 ml-2" />
                     </button>
                   </motion.div>
                 )}

                 {step === 2 && (
                   <motion.div
                     key="step2"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-4"
                   >
                     {/* Professional Body */}
                     <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Certification</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Bookmark className="h-5 w-5 text-slate-400" />
                         </div>
                         <select
                           name="professionalBody"
                           value={formData.professionalBody}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium appearance-none"
                         >
                           <option value="">Select Professional Body</option>
                           <option value="ICAN">ICAN (Institute of Chartered Accountants of Nigeria)</option>
                           <option value="CITN">CITN (Chartered Institute of Taxation of Nigeria)</option>
                           <option value="ANAN">ANAN (Association of National Accountants of Nigeria)</option>
                           <option value="ACCA">ACCA (Association of Chartered Certified Accountants)</option>
                           <option value="Other">Other</option>
                         </select>
                       </div>
                     </div>

                     {/* Membership ID */}
                     <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Membership ID / License No.</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <FileText className="h-5 w-5 text-slate-400" />
                         </div>
                         <input
                           type="text"
                           name="membershipId"
                           value={formData.membershipId}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                           placeholder="e.g. MB123456"
                         />
                       </div>
                     </div>

                     {/* Company/Firm Name */}
                     <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Firm / Company Name</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Building className="h-5 w-5 text-slate-400" />
                         </div>
                         <input
                           type="text"
                           name="companyName"
                           value={formData.companyName}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                           placeholder="e.g. Deloitte Nigeria"
                         />
                       </div>
                     </div>

                     {/* Years of Experience */}
                     <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Years of Experience</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Briefcase className="h-5 w-5 text-slate-400" />
                         </div>
                         <input
                           type="number"
                           name="yearsOfExperience"
                           min="1"
                           value={formData.yearsOfExperience}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                           placeholder="Years"
                         />
                       </div>
                     </div>

                     <div className="flex space-x-3 mt-6">
                       <button
                         type="button"
                         onClick={() => setStep(1)}
                         className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                       >
                         Back
                       </button>
                       <button
                         type="submit"
                         disabled={isLoading}
                         className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70"
                       >
                         {isLoading ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         ) : (
                           'Submit Application'
                         )}
                       </button>
                     </div>
                     
                     <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500 font-medium px-4">
                       By submitting, you consent to our team verifying your credentials with the relevant professional bodies.
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>
             </form>

             <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
               Regular SME user?{' '}
               <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-extrabold transition-colors">
                 Sign up here
               </Link>
             </p>
           </motion.div>
         </div>
      </div>
    </div>
  );
}
