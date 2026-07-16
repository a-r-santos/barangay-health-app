import React, { useState } from 'react';
import { ShieldCheck, ToggleLeft, ToggleRight, Settings } from 'lucide-react';

const INITIAL_SERVICES = [
  { id: 'srv-1', title: 'General Medical Consultation', availability: 'Mon - Fri (8:00 AM - 4:00 PM)', isActive: true },
  { id: 'srv-2', title: 'Prenatal & Maternal Clinic', availability: 'Tuesdays & Thursdays (9:00 AM - 12:00 PM)', isActive: true },
  { id: 'srv-3', title: 'Child Care & Immunization', availability: 'Wednesdays Only (8:00 AM - 2:00 PM)', isActive: false },
  { id: 'srv-4', title: 'NCD Care & Senior Wellness', availability: 'Fridays Only (1:00 PM - 4:00 PM)', isActive: true },
];

export default function SchedulesPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);

  const handleToggle = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <h3 className="text-base font-black text-slate-950">Active Clinic Schedules</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Toggle live online program availability for patient bookings</p>
      </div>

      <div className="p-6 divide-y divide-slate-100">
        {services.map(service => (
          <div key={service.id} className="flex justify-between items-center py-5 first:pt-2 last:pb-2">
            <div>
              <div className="flex items-center gap-x-2">
                <h4 className="font-bold text-sm text-slate-950">{service.title}</h4>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  service.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {service.isActive ? 'Live' : 'Paused'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">Shift hours: {service.availability}</p>
            </div>

            <button 
              onClick={() => handleToggle(service.id)}
              className="text-slate-400 hover:text-slate-900 transition focus:outline-none"
            >
              {service.isActive ? (
                <ToggleRight size={38} className="text-blue-900 cursor-pointer" />
              ) : (
                <ToggleLeft size={38} className="text-slate-300 cursor-pointer" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}