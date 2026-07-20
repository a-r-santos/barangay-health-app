import React, { useState } from 'react';
import { Search, CalendarDays, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { INITIAL_APPOINTMENTS } from '../components/mockPatients.js';

export default function AppointmentsPage({ 
  appointments = INITIAL_APPOINTMENTS, 
  searchTerm = '', 
  setSearchTerm = () => {}, 
  onStatusChange = () => {} 
}) {
  // 1. Local page filter states
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'Pending', 'Approved', 'Rejected'

  // 2. Metrics calculated locally
  const totalBooked = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const approvedCount = appointments.filter(a => a.status === 'Approved').length;
  const rejectedCount = appointments.filter(a => a.status === 'Rejected').length;

  // 3. Daily Capacity Logic calculation (10 max limit per day)
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
    const term = searchTerm.toLowerCase();
    const serviceName = app.service || app.clinic || '';
    
    const matchesSearch = 
      (app.name && app.name.toLowerCase().includes(term)) || 
      (app.patientId && app.patientId.toLowerCase().includes(term)) ||
      serviceName.toLowerCase().includes(term);
    
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
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Bookings Card */}
        <button 
          onClick={() => setStatusFilter('ALL')}
          className={`p-5 rounded-2xl border text-left transition shadow-sm flex items-center justify-between cursor-pointer ${
            statusFilter === 'ALL' ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-100' : 'bg-white border-blue-100 hover:bg-blue-50/20'
          }`}
        >
          <div>
            <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wider opacity-80">Total Bookings</p>
            <h4 className="text-2xl font-black text-blue-950 mt-1">{totalBooked}</h4>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-900">
            <Calendar size={20} />
          </div>
        </button>

        {/* Pending Verification Card */}
        <button 
          onClick={() => setStatusFilter('Pending')}
          className={`p-5 rounded-2xl border text-left transition shadow-sm flex items-center justify-between cursor-pointer ${
            statusFilter === 'Pending' ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-100' : 'bg-white border-blue-100 hover:bg-amber-50/20'
          }`}
        >
          <div>
            <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wider opacity-80">Pending Verification</p>
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
            statusFilter === 'Approved' ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-100' : 'bg-white border-blue-100 hover:bg-emerald-50/20'
          }`}
        >
          <div>
            <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wider opacity-80">Confirmed Slots</p>
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
            statusFilter === 'Rejected' ? 'bg-red-50/50 border-red-400 ring-2 ring-red-100' : 'bg-white border-blue-100 hover:bg-red-50/20'
          }`}
        >
          <div>
            <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wider opacity-80">Rejected History</p>
            <h4 className="text-2xl font-black text-red-600 mt-1">{rejectedCount}</h4>
          </div>
          <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-red-600">
            <XCircle size={20} />
          </div>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
        
        {/* Controls Bar */}
        <div className="p-6 border-b border-blue-50 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-blue-50/20">
          <div>
            <h3 className="text-base font-black text-blue-950">
              Appointment Queue
              {statusFilter !== 'ALL' && (
                <span className="ml-2 text-blue-900 font-black text-xs bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {statusFilter === 'Approved' ? 'Confirmed' : statusFilter} List
                </span>
              )}
            </h3>
            <p className="text-xs text-blue-600/80 font-medium mt-0.5">
              Manage online patient reservations requesting check-in parameters
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
            {/* Calendar Date Selector */}
            <div className="relative flex items-center min-w-[220px]">
              <span className="absolute left-3.5 pointer-events-none text-blue-600">
                <CalendarDays size={16} />
              </span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white border border-blue-100 pl-10 pr-8 py-2 rounded-xl text-sm font-semibold text-blue-950 focus:outline-none focus:border-blue-900 appearance-none cursor-pointer"
              >
                <option value="">All Scheduled Dates</option>
                {sortedDates.map((dateStr) => {
                  const dayApproved = capacityPerDay[dateStr].totalApproved;
                  const remainingSlots = 10 - dayApproved;
                  const isFull = remainingSlots <= 0;

                  return (
                    <option key={dateStr} value={dateStr}>
                      {dateStr} ({isFull ? 'FULL' : `${remainingSlots} Slots Left`})
                    </option>
                  );
                })}
              </select>
              <span className="absolute right-3.5 pointer-events-none text-blue-900 text-[10px] font-black">▼</span>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={16} className="text-blue-600" />
              </span>
              <input
                type="text"
                placeholder="Search by ID, Name, or Specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-blue-100 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-900 font-semibold text-blue-955"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-blue-50 bg-blue-50/10 text-[11px] font-bold text-blue-900 uppercase tracking-widest">
                <th className="py-4 px-6">Patient ID</th>
                <th className="py-4 px-6">Resident Name</th>
                <th className="py-4 px-6">Clinical Specialty</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Time Slot</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/60">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => {
                  const isDayFull = (capacityPerDay[app.date]?.totalApproved || 0) >= 10;

                  return (
                    <tr key={app.id} className="hover:bg-blue-50/20 transition">
                      <td className="py-4 px-6 font-extrabold text-blue-900 text-sm">{app.patientId}</td>
                      <td className="py-4 px-6 font-bold text-blue-955 text-sm">{app.name}</td>
                      <td className="py-4 px-6 text-xs font-semibold text-blue-900/80">
                        {app.service || app.clinic}
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-blue-955">{app.date || 'N/A'}</td>
                      <td className="py-4 px-6 text-xs font-semibold text-blue-955">
                        <span className="bg-blue-50 py-1 px-2.5 rounded-md border border-blue-100 text-blue-900 font-bold">
                          {app.time}
                        </span>
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
                                  ? 'bg-blue-50 border border-blue-100 text-blue-900/40 cursor-not-allowed shadow-none'
                                  : 'bg-blue-900 hover:bg-blue-950 text-white cursor-pointer'
                              }`}
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => onStatusChange(app.id, 'Rejected')}
                              className="bg-white border border-blue-100 hover:bg-red-50 hover:border-red-200 text-blue-900 hover:text-red-700 font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-blue-900/40 italic font-medium">No actions available</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-sm font-semibold text-blue-900/40">
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