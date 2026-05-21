import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { Logo } from '../components/Logo';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError("Please fill in all required fields.");
      return;
    }
    setError('');
    setIsEmailLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const generatedTaxId = `TIN-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;

      // Add user document to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: fullName,
        email,
        phone: phone || '',
        taxId: generatedTaxId,
        createdAt: serverTimestamp(),
      });

      // Send Verification Email
      await sendEmailVerification(user);

      setIsSuccess(true);
      // Wait for a few seconds then redirect to login page for verification check
      setTimeout(() => navigate('/login', { state: { message: "Account created! Please check your email to verify before logging in." } }), 4000);
    } catch (err: any) {
      console.error("Signup error:", err);
      let errorMessage = err.message || "Failed to create an account. Please try again.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address.";
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/Password login is not enabled in Firebase. Please enable it in your Firebase Console.";
      }
      setError(errorMessage);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if user document already exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      // Only create if it's a completely new signup via Google
      if (!userDoc.exists()) {
        const generatedTaxId = `TIN-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
        await setDoc(userDocRef, {
          fullName: user.displayName || 'Tax Payer',
          email: user.email || 'no-email@provided.com',
          phone: user.phoneNumber || '',
          taxId: generatedTaxId,
          createdAt: serverTimestamp(),
        });
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google sign up error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Error: "mytaxgenius.com.ng" is not authorized in Firebase. To fix: Go to Firebase Console > Authentication > Settings > Authorized Domains > Add "mytaxgenius.com.ng".');
      } else {
        setError(`Google Sign Up Error: ${err.message || err.code || "Unknown error"}`);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-200 selection:text-emerald-900 transition-colors duration-300">
      
      {/* Left Panel - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-linear-to-br from-emerald-600/30 to-blue-600/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-100 h-100 bg-emerald-600/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>
        
        {/* Logo */}
        <div className="relative z-10 flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105">
            <Logo className="w-10 h-10" />
            <span className="font-extrabold text-2xl tracking-tight text-white">
              MyTaxGenius
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
              Automated Tax Infrastructure for Scale.
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
              Join the platform powering the next generation of Nigerian businesses. Get TCCs, verify compliance, and automate with AI.
            </p>
            
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-max">
               <ShieldCheck className="w-8 h-8 text-emerald-400" />
               <div>
                 <p className="text-white font-bold text-sm">Enterprise Grade</p>
                 <p className="text-slate-400 text-xs">Direct integration with JTB</p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-slate-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} MyTaxGenius. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
         {/* Mobile Logo Only */}
         <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <Logo className="w-8 h-8" />
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white transition-colors">
                MyTaxGenius
              </span>
            </Link>
         </div>

         <div className="w-full max-w-md">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4 }}
           >
             <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create an account</h2>
             <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Start your journey to stress-free tax compliance.</p>

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
                   Account created securely! Verification email sent to {email}. Redirecting...
                 </p>
               </div>
             )}

             <form onSubmit={handleSignup} className="space-y-4">
               
               <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Legal Name</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <User className="h-5 w-5 text-slate-400" />
                   </div>
                   <input
                     type="text"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                     placeholder="Babajide Babalola"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Mail className="h-5 w-5 text-slate-400" />
                   </div>
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                     placeholder="you@company.com"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number (Optional)</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Phone className="h-5 w-5 text-slate-400" />
                   </div>
                   <input
                     type="tel"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                     className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                     placeholder="+234 800 000 0000"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Lock className="h-5 w-5 text-slate-400" />
                   </div>
                   <input
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                     placeholder="••••••••"
                   />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="text-slate-400 hover:text-slate-500 focus:outline-none"
                     >
                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                     </button>
                   </div>
                 </div>
               </div>

               <button
                 type="submit"
                 disabled={isEmailLoading || isGoogleLoading}
                 className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
               >
                 {isEmailLoading ? 'Creating account...' : 'Create Account'}
                 {!isEmailLoading && <ArrowRight className="ml-2 -mr-1 w-5 h-5" />}
               </button>

               <div className="relative py-4">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                 </div>
                 <div className="relative flex justify-center text-sm">
                   <span className="px-2 bg-slate-50 dark:bg-slate-950 text-slate-500 font-medium">Or continue with</span>
                 </div>
               </div>

               <button
                 type="button"
                 disabled={isEmailLoading || isGoogleLoading}
                 onClick={handleGoogleSignUp}
                 className="w-full flex justify-center items-center py-4 px-4 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm text-base font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 {isGoogleLoading ? 'Authenticating...' : 'Sign Up with Google'}
               </button>
             </form>

             <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
               Already have an account?{' '}
               <Link to="/login" className="font-extrabold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                 Sign In
               </Link>
             </p>

             <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
               Are you a certified Tax Accountant?{' '}
               <Link to="/accountant-signup" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-extrabold transition-colors">
                 Partner with us
               </Link>
             </p>
             <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500 font-medium px-4">
               By creating an account, you agree to our <Link to="/privacy" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</Link> & <Link to="/privacy" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</Link>.
             </p>
           </motion.div>
         </div>
      </div>

    </div>
  );
}
