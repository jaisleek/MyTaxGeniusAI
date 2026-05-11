import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { Logo } from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'accountant') {
          navigate('/accountant-portal');
        } else {
          navigate('/dashboard');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // If redirecting from signup, show success message
  React.useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError('');
    setMessage('');
    setIsEmailLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Strict Security: Prevent login if email is not verified (unless they use Google)
      if (!userCredential.user.emailVerified) {
        // Send a new verification email just in case
        await sendEmailVerification(userCredential.user);
        
        // Log them out immediately
        await auth.signOut();
        setError("Your email address is not verified. Please check your inbox and click the verification link. We've sent another link just in case.");
        setIsEmailLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().role === 'accountant') {
        navigate('/accountant-portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMessage = err.message || "Failed to sign in. Please check your credentials.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/Password login is not enabled in Firebase. Please enable it in your Firebase Console.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
      }
      setError(errorMessage);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setError('');
    setMessage('');
    setIsResetting(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setIsResetting(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().role === 'accountant') {
        navigate('/accountant-portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Error: "mytaxgenius.com.ng" is not authorized in Firebase. To fix: Go to Firebase Console > Authentication > Settings > Authorized Domains > Add "mytaxgenius.com.ng".');
      } else {
        setError(`Google Login Error: ${err.message || err.code || "Unknown error"}`);
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

             {message && (
               <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 flex items-start space-x-3">
                 <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                 <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 relative top-[1px]">
                   {message}
                 </p>
               </div>
             )}

             <form onSubmit={handleLogin} className="space-y-4">
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
                 <div className="flex items-center justify-between pl-1 mb-1.5">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                   <button 
                     type="button" 
                     onClick={handleForgotPassword}
                     disabled={isResetting}
                     className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors focus:outline-none disabled:opacity-50"
                   >
                     {isResetting ? "Sending..." : "Forgot password?"}
                   </button>
                 </div>
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
                 {isEmailLoading ? 'Signing in...' : 'Sign In'}
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
                 onClick={handleGoogleSignIn}
                 className="w-full flex justify-center items-center py-4 px-4 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm text-base font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 {isGoogleLoading ? 'Authenticating...' : 'Sign In with Google'}
               </button>
             </form>

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
