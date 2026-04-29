import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Logo } from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      // Clean up Firebase error messages for the user
      let errorMessage = err.message || "Failed to sign in. Please check your credentials.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/Password login is not enabled in Firebase. Please use Google Sign In instead.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Error: "mytaxgenius.com.ng" is not authorized in Firebase. To fix: Go to Firebase Console > Authentication > Settings > Authorized Domains > Add "mytaxgenius.com.ng".');
      } else {
        setError(`Google Login Error: ${err.message || err.code || "Unknown error"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-200 selection:text-emerald-900 transition-colors duration-300">
      
      {/* Left Panel - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-600/30 to-fuchsia-600/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>
        
        {/* Logo */}
        <div className="relative z-10 flex items-center space-x-2">
          <Logo className="w-10 h-10" />
          <span className="font-extrabold text-2xl tracking-tight text-white">
            MyTaxGenius
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Building a Tax Compliant Africa.
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
              Automate verification and tax compliance for modern businesses. Join thousands of SMEs relying on bank-grade security.
            </p>
            
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-max">
               <ShieldCheck className="w-8 h-8 text-emerald-400" />
               <div>
                 <p className="text-white font-bold text-sm">NDPR Certified</p>
                 <p className="text-slate-400 text-xs">AES-256 Encryption enabled</p>
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
            <Logo className="w-8 h-8" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white transition-colors">
              MyTaxGenius
            </span>
         </div>

         <div className="w-full max-w-md">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4 }}
           >
             <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome back</h2>
             <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Sign in to your MyTaxGenius dashboard.</p>

             {error && (
               <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 flex items-start space-x-3">
                 <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                 <p className="text-sm font-medium text-red-800 dark:text-red-300 relative top-[1px]">
                   {error}
                 </p>
               </div>
             )}

             <div className="space-y-4">
               <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-5 mb-6">
                 <div className="flex items-start space-x-3">
                   <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                   <div>
                     <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">Bank-Grade Security Active</h3>
                     <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/80 leading-relaxed">
                       To comply with NDPR regulations and prevent unauthorized access, standard email/password login is disabled. You must authenticate using your secure Google Account.
                     </p>
                   </div>
                 </div>
               </div>

               <button
                 type="button"
                 disabled={isLoading}
                 onClick={handleGoogleSignIn}
                 className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-md text-base font-extrabold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 {isLoading ? 'Authenticating...' : 'Sign In with Google'}
               </button>
             </div>

             <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
               New to MyTaxGenius?{' '}
               <Link to="/signup" className="font-extrabold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                 Create an account
               </Link>
             </p>
           </motion.div>
         </div>
      </div>

    </div>
  );
}
