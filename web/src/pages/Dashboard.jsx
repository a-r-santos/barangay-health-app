import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Sliders,
  Database,
  Loader2,
  X
} from 'lucide-react';

// Imports: Local Data
import { INITIAL_APPOINTMENTS } from '../components/mockPatients.js';

// Imports: Separated Pages
import AppointmentsPage from './AppointmentsPage';
import PatientsPage from './PatientsPage';
import SchedulesPage from './SchedulesPage';

export default function StaffDashboard({ onLogout }) {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');
  
  // Logout Animation States
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  // Actions passed to the sub-page
  const handleStatusChange = (id, newStatus) => {
    setAppointments(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
  };

  // Secure Logout Handler with Simulated Buffer
  const handleLogoutClick = () => {
    setIsLoggingOut(true);
    setShowLogoutToast(true);

    setTimeout(() => {
      onLogout();
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased w-full overflow-hidden relative">
      
      {/* --- SESSION TERMINATION TOAST --- */}
      {showLogoutToast && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-5 px-6 py-5 rounded-3xl shadow-2xl border border-amber-400 text-amber-950 bg-amber-50 shadow-amber-100 animate-in fade-in slide-in-from-top-6 duration-300 w-full max-w-lg backdrop-blur-lg">
          <Loader2 className="text-amber-600 shrink-0 animate-spin" size={32} />
          <div className="flex-1">
            <h4 className="font-black text-xs uppercase tracking-widest opacity-85">
              Security Notice
            </h4>
            <p className="text-sm font-bold mt-1.5 leading-relaxed">
              Terminating secure session. Wiping admin tokens and signing out...
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setShowLogoutToast(false)} 
            className="text-amber-700 hover:text-amber-950 transition ml-2 p-1 hover:bg-white/50 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-blue-950 text-white flex flex-col justify-between border-r border-blue-900 shrink-0">
        <div>
          <div className="p-6 border-b border-blue-900 flex items-center gap-x-3">
            <div className="bg-blue-800 p-2 rounded-xl">
              <Database size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-wide uppercase">BHC Portal</h1>
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Admin Desk</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <button 
              disabled={isLoggingOut}
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-bold transition disabled:opacity-55 ${
                activeTab === 'appointments' ? 'bg-blue-900 text-white' : 'text-blue-200 hover:bg-blue-900/40'
              }`}
            >
              <Calendar size={18} />
              Appointments
            </button>
            <button 
              disabled={isLoggingOut}
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-bold transition disabled:opacity-55 ${
                activeTab === 'patients' ? 'bg-blue-900 text-white' : 'text-blue-200 hover:bg-blue-900/40'
              }`}
            >
              <Users size={18} />
              Patient Records
            </button>
            <button 
              disabled={isLoggingOut}
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-bold transition disabled:opacity-55 ${
                activeTab === 'services' ? 'bg-blue-900 text-white' : 'text-blue-200 hover:bg-blue-900/40'
              }`}
            >
              <Sliders size={18} />
              Manage Schedules
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-blue-900 space-y-1">
          <button 
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-300 hover:bg-red-950/40 transition cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin text-red-400" />
            ) : (
              <LogOut size={18} />
            )}
            {isLoggingOut ? 'Signing Out...' : 'Log Out'}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Frame */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-x-2">
            <h2 className="text-lg font-black text-slate-900">Health Center Desk</h2>
            <span className="bg-blue-50 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-100">
              Active Session
            </span>
          </div>
          
          <div className="flex items-center gap-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-955">Nurse Cruz</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Registered Health Worker</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
              <span className="text-blue-900 font-extrabold text-sm">NC</span>
            </div>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {activeTab === 'appointments' && (
            <AppointmentsPage 
              appointments={appointments} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              onStatusChange={handleStatusChange} 
            />
          )}

          {activeTab === 'patients' && (
            <PatientsPage appointments={appointments} />
          )}

          {activeTab === 'services' && (
            <SchedulesPage />
          )}

        </div>
      </main>
    </div>
  );
}