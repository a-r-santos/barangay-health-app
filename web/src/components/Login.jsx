import React, { useState } from 'react';
import { Lock, User, Database, ShieldAlert, Loader2, CheckCircle2, X } from 'lucide-react';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'adminpassword123'
};

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Toast Alert State ('success' | 'error')
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Helper to trigger large feedback toasts
  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
    // Keep error alerts visible slightly longer so administrators can read them
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setToast({ show: false, type: '', message: '' }); // Clear existing alert

    // Simulate standard server authentication lag (1.5 seconds)
    setTimeout(() => {
      if (
        username.trim() === ADMIN_CREDENTIALS.username && 
        password === ADMIN_CREDENTIALS.password
      ) {
        // Trigger GREEN success notification
        triggerToast('success', 'Authentication verified. Initializing secure systems dashboard...');
        
        // Give the administrator a moment to see the green banner before redirecting
        setTimeout(() => {
          onLoginSuccess();
          setIsLoggingIn(false);
        }, 1500);
      } else {
        // Trigger RED failure notification
        triggerToast('error', 'Access Denied: Invalid username or security PIN. Please try again.');
        setIsLoggingIn(false);
      }
    }, 1500);
  };

  // Dynamic style matching for success vs error banners
  const getToastStyles = () => {
    if (toast.type === 'success') {
      return {
        wrapperClass: 'border-2 border-emerald-400 text-emerald-950 bg-emerald-50 shadow-emerald-100',
        icon: <CheckCircle2 className="text-emerald-600 shrink-0" size={32} />,
        title: 'Access Granted'
      };
    }
    return {
      wrapperClass: 'border-2 border-red-400 text-red-955 bg-red-50 shadow-red-100',
      icon: <ShieldAlert className="text-red-600 shrink-0" size={32} />,
      title: 'Authentication Failed'
    };
  };

  const toastStyle = getToastStyles();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased relative overflow-hidden">
      
      {/* --- LARGE SECURE NOTIFICATION BANNER --- */}
      {toast.show && (
        <div className={`fixed top-8 right-8 z-50 flex items-center gap-5 px-6 py-5 rounded-3xl shadow-2xl border animate-in fade-in slide-in-from-top-6 duration-300 w-full max-w-lg backdrop-blur-lg ${toastStyle.wrapperClass}`}>
          {toastStyle.icon}
          <div className="flex-1">
            <h4 className="font-black text-xs uppercase tracking-widest opacity-85">
              {toastStyle.title}
            </h4>
            <p className="text-sm font-bold mt-1.5 leading-relaxed">{toast.message}</p>
          </div>
          <button 
            type="button"
            onClick={() => setToast({ show: false, type: '', message: '' })} 
            className="text-slate-500 hover:text-slate-900 transition ml-2 p-1 hover:bg-white/50 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-900 p-3.5 rounded-2xl shadow-md border border-blue-950/30">
            <Database size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
          BHC Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm font-semibold text-slate-500 uppercase tracking-widest">
          Barangay Health Center Operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/60 rounded-3xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </span>
                <input
                  type="text"
                  required
                  disabled={isLoggingIn}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold transition text-slate-955 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </span>
                <input
                  type="password"
                  required
                  disabled={isLoggingIn}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold transition text-slate-955 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-black text-white bg-blue-900 hover:bg-blue-950 focus:outline-none transition active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Authenticating System...
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <span className="inline-block bg-blue-50 text-blue-900/70 text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-blue-100">
              Demo Credentials: admin / adminpassword123
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}