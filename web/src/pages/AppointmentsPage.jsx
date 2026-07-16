import React from 'react';
import { Search } from 'lucide-react';

export default function AppointmentsPage({ appointments, searchTerm, setSearchTerm, onStatusChange }) {
  const filteredAppointments = appointments.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header section with Search */}
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-base font-black text-slate-950">Daily Booking Approvals</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage online patient reservations requesting check-in</p>
        </div>
        
        {/* Search Bar Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-900"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <th className="py-4 px-6">Patient ID</th>
              <th className="py-4 px-6">Resident Name</th>
              <th className="py-4 px-6">Clinical Specialty</th>
              <th className="py-4 px-6">Time Slot</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-extrabold text-blue-900 text-sm">{app.patientId}</td>
                  <td className="py-4 px-6 font-bold text-slate-950 text-sm">{app.name}</td>
                  <td className="py-4 px-6 text-xs font-semibold text-slate-600">{app.service}</td>
                  <td className="py-4 px-6 text-xs font-semibold text-slate-800">
                    <span className="bg-slate-100 py-1 px-2.5 rounded-md border border-slate-200">{app.time}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      app.status === 'Approved' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : app.status === 'Rejected' 
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                    {app.status === 'Pending' ? (
                      <>
                        <button 
                          onClick={() => onStatusChange(app.id, 'Approved')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => onStatusChange(app.id, 'Rejected')}
                          className="bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No actions available</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-sm font-semibold text-slate-400">
                  No matching clinical appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}