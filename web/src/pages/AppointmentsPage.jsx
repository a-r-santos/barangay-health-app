import React, { useState } from 'react';
import { Search, CalendarDays, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function AppointmentsPage({ 
  appointments, 
  searchTerm, 
  setSearchTerm, 
  onStatusChange 
}) {
  // 1. Local page filter states
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'Pending', 'Approved', 'Rejected'

  // 2. Metrics calculated locally here
  const totalBooked = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const approvedCount = appointments.filter(a => a.status === 'Approved').length;
  const rejectedCount = appointments.filter(a => a.status === 'Rejected').length;

  // 3. Daily Capacity Logic calculation
  const capacityPerDay = appointments.reduce((acc, app) => {
    if (!app.date) return acc;
    if (!acc[app.date]) {
      acc[app.date] = { totalApproved: 0 };
    }
    if (app.status === 'Approved') {
      acc[app.date].totalApproved += 1;
    }
    return acc;
  }, {});

  const sortedDates = Object.keys(capacityPerDay).sort();

  // 4. Multi-layered structural records filtering
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate ? app.date === selectedDate : true;
    const matchesStatus = statusFilter === 'ALL' ? true : app.status === statusFilter;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleApproveClick = (app) => {
    const targetDate = app.date; 
    const approvedForTargetDate = capacityPerDay[targetDate]?.totalApproved || 0;

    if (approvedForTargetDate >= 10) {
      alert(`⚠️ Daily Limit Reached: The slots for ${targetDate} are completely full (10/10).`);
      return;
    }
    onStatusChange(app.id, 'Approved');
  };

  return (
    <div className="space-y-6">
      
      {/* Clickable Card Metrics Row - Contained only inside this workspace view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Bookings Card */}
        <button 
          onClick={() => setStatusFilter('ALL')}
          className={`p-5 rounded-2xl border text-left transition shadow-sm flex items-center justify-between cursor-pointer ${
            statusFilter === 'ALL' ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-100' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Bookings</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">{totalBooked}</h4>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-900">
            <Calendar size={20} />
          </div>
        </button>

        {/* Pending Verification Card */}
        <button 
          onClick={() => setStatusFilter('Pending')}
          className={`p-5 rounded-2xl border text-left transition shadow-sm flex items-center justify-between cursor-pointer ${
            statusFilter === 'Pending' ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-100' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Verification</p>
            <h4 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h4>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-600">
            <Clock size={20} />
          </div>
        </button>

        {/* Confirmed Slots Card */}
        <button 
          onClick={() => setStatusFilter('Approved')}
          className={`p-5 rounded-2xl border text-left transition shadow-sm flex items-center justify-between cursor-pointer ${
            statusFilter === 'Approved' ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-100' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirmed Slots</p>
            <h4 className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</h4>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
        </button>

        {/* Rejected History Card */}
        <button 
          onClick={() => setStatusFilter('Rejected')}
          className={`p-5 rounded-2xl border text-left transition shadow-sm flex items-center justify-between cursor-pointer ${
            statusFilter === 'Rejected' ? 'bg-red-50/50 border-red-400 ring-2 ring-red-100' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rejected History</p>
            <h4 className="text-2xl font-black text-red-600 mt-1">{rejectedCount}</h4>
          </div>
          <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-red-600">
            <XCircle size={20} />
          </div>
        </button>
      </div>

      {/* Database View Workspace Wrapper */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Sub-Header Actions panel layout */}
        <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-955">
              Daily Booking Approvals
              {statusFilter !== 'ALL' && (
                <span className="ml-2 text-blue-600 font-extrabold text-sm capitalize">
                  ({statusFilter === 'Approved' ? 'Confirmed' : statusFilter} List)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage online patient reservations requesting check-in parameters
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
            {/* Dropdown Calendar Date Selector */}
            <div className="relative flex items-center min-w-[220px]">
              <span className="absolute left-3.5 pointer-events-none text-slate-400">
                <CalendarDays size={16} />
              </span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-10 pr-8 py-2 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="">All Scheduled Dates</option>
                {sortedDates.map((dateStr) => {
                  const approvedCount = capacityPerDay[dateStr].totalApproved;
                  const remainingSlots = 10 - approvedCount;
                  const isFull = remainingSlots <= 0;

                  return (
                    <option key={dateStr} value={dateStr}>
                      {dateStr} ({isFull ? 'FULL' : `${remainingSlots} Slots Left`})
                    </option>
                  );
                })}
              </select>
              <span className="absolute right-3.5 pointer-events-none text-slate-400 text-xs font-black">▼</span>
            </div>

            {/* Input Search Box Element */}
            <div className="relative w-full sm:w-72">
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
        </div>

        {/* Core Records Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-4 px-6">Patient ID</th>
                <th className="py-4 px-6">Resident Name</th>
                <th className="py-4 px-6">Clinical Specialty</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Time Slot</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => {
                  const isDayFull = (capacityPerDay[app.date]?.totalApproved || 0) >= 10;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-extrabold text-blue-900 text-sm">{app.patientId}</td>
                      <td className="py-4 px-6 font-bold text-slate-955 text-sm">{app.name}</td>
                      <td className="py-4 px-6 text-xs font-semibold text-slate-600">{app.service}</td>
                      <td className="py-4 px-6 text-xs font-bold text-slate-700">{app.date || 'N/A'}</td>
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
                          {app.status === 'Approved' ? 'Confirmed' : app.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        {app.status === 'Pending' ? (
                          <>
                            <button 
                              onClick={() => handleApproveClick(app)}
                              className={`font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition shadow-sm ${
                                isDayFull
                                  ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                              }`}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-sm font-semibold text-slate-400">
                    No matching active bookings found under this category filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}