import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Clock, AlertTriangle, Building, Search, ArrowRight, DollarSign, LogOut, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AccountantPortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Auth Form State
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const navigate = useNavigate();

  const [accountantName, setAccountantName] = useState('Accountant');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setIsAuthenticated(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserStatus(userDoc.data().status);
            setAccountantName(userDoc.data().name || user.email?.split('@')[0] || 'Accountant');
          } else {
            setUserStatus('pending_approval');
            setAccountantName(user.email?.split('@')[0] || 'Accountant');
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      } else {
        setIsAuthenticated(false);
        setUserStatus(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user doc
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          name: name || userCredential.user.email?.split('@')[0],
          role: 'accountant',
          status: 'pending_approval',
          createdAt: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setAuthError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const clients = [
    {
      id: 1,
      name: 'Oluwa Enterprises Ltd',
      tin: '22938475-01',
      status: 'action_required',
      pendingTasks: 3,
      nextDeadline: '2023-11-21',
      lastActive: '2 hours ago',
      type: 'Retail'
    },
    {
      id: 2,
      name: 'TechFlow Solutions',
      tin: '33984501-12',
      status: 'compliant',
      pendingTasks: 0,
      nextDeadline: '2023-12-31',
      lastActive: '1 day ago',
      type: 'IT Services'
    },
    {
      id: 3,
      name: 'Amaka Fashion House',
      tin: '11029483-00',
      status: 'pending_review',
      pendingTasks: 1,
      nextDeadline: '2023-11-25',
      lastActive: '3 days ago',
      type: 'Fashion'
    }
  ];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.tin.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <div className="bg-indigo-600 text-white p-3 rounded-2xl inline-flex items-center justify-center shadow-lg">
              <Building className="w-8 h-8" />
            </div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Accountant <span className="text-indigo-600">Portal</span>
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">
            Manage your clients and their tax compliance in one place.
          </p>
        </div>

        <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {isLoginMode ? 'Welcome back' : 'Join as an Accountant'}
          </h2>
          
          {authError && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium mb-6">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-900"
                    placeholder="E.g. Adebayo Ogunlesi"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-900"
                  placeholder="You@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-900"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLoginMode ? 'Sign In to Portal' : 'Create Accountant Account'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600 font-medium text-sm">
              {isLoginMode ? "Don't have an account?" : "Already registered?"}
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setAuthError('');
                }}
                className="ml-2 text-indigo-600 font-bold hover:underline"
              >
                {isLoginMode ? 'Register here' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (userStatus === 'pending_approval') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Application Under Review</h2>
          <p className="text-slate-500 font-medium mb-8">
            Your application to join the MyTaxGenius Pro network is currently being reviewed. We are verifying your credentials with the relevant professional bodies. This process typically takes 24-48 hours.
          </p>
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl uppercase">
            {accountantName.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{accountantName}</h1>
            <p className="text-xs font-medium text-slate-500">Certified Partner</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Exit Portal
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" /> Log Out
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Clients</p>
              <h3 className="text-2xl font-bold text-slate-900">14</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Action Required</p>
              <h3 className="text-2xl font-bold text-slate-900">3</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Review</p>
              <h3 className="text-2xl font-bold text-slate-900">5</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Est. Monthly Earnings</p>
              <h3 className="text-2xl font-bold text-slate-900">₦450k</h3>
            </div>
          </div>
        </div>

        {/* Client List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Client Organizations</h2>
              <p className="text-sm text-slate-500 mt-1">Manage your connected SMEs and their tax filings.</p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tasks</th>
                  <th className="px-6 py-4">Next Deadline</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{client.name}</h4>
                          <div className="flex items-center text-xs text-slate-500">
                            <span>TIN: {client.tin}</span>
                            <span className="mx-2">•</span>
                            <span>{client.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.status === 'compliant' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Compliant
                        </span>
                      )}
                      {client.status === 'action_required' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Action Required
                        </span>
                      )}
                      {client.status === 'pending_review' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3.5 h-3.5 mr-1" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {client.pendingTasks > 0 ? (
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold mr-2">
                            {client.pendingTasks}
                          </span>
                          <span className="text-sm font-medium text-slate-600">Pending</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Up to date</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">{client.nextDeadline}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
