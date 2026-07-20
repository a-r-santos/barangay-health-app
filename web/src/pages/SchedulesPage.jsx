import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Calendar as CalendarIcon, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

// Externalized Data Configuration Import
import { INITIAL_SERVICES } from '../components/mockServices.js';

const WEEKDAYS = [
  { label: 'Su', index: 0, fullName: 'Sunday' },
  { label: 'M',  index: 1, fullName: 'Monday' },
  { label: 'T',  index: 2, fullName: 'Tuesday' },
  { label: 'W',  index: 3, fullName: 'Wednesday' },
  { label: 'Th', index: 4, fullName: 'Thursday' },
  { label: 'F',  index: 5, fullName: 'Friday' },
  { label: 'Sa', index: 6, fullName: 'Saturday' }
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formatDateLocal = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseDateLocal = (str) => {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/* CUSTOM DROPDOWN CALENDAR COMPONENT */
function CustomDatePicker({ value, minDateStr, allowedDays, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const initialDate = value ? parseDateLocal(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const days = [];
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(currentYear, currentMonth, d));
    }
    return days;
  };

  const days = getDaysInMonth();

  return (
    <div className="relative" ref={containerRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-2 bg-blue-50/50 border border-blue-100 px-3 py-2 rounded-2xl shadow-sm hover:bg-blue-50 transition cursor-pointer"
      >
        <CalendarIcon size={14} className="text-blue-600 shrink-0" />
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-wider">Target Date</span>
          <span className="text-xs font-bold text-blue-900">{value}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 z-50 w-72 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex justify-between items-center mb-4">
            <button 
              type="button" 
              onClick={handlePrevMonth}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
            <span className="text-xs font-black text-slate-800">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button 
              type="button" 
              onClick={handleNextMonth}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 uppercase mb-2">
            <span>Su</span><span>M</span><span>T</span><span>W</span><span>Th</span><span>F</span><span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, idx) => {
              if (!date) return <div key={`empty-${idx}`} />;

              const formatted = formatDateLocal(date);
              const dayIdx = date.getDay();
              const isPast = formatted < minDateStr;
              const isAllowedDay = allowedDays.includes(dayIdx);
              const isDisabled = isPast || !isAllowedDay;
              const isSelected = value === formatted;

              return (
                <button
                  key={formatted}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(formatted);
                    setIsOpen(false);
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-blue-900 text-white shadow-md' 
                      : isDisabled 
                        ? 'opacity-20 pointer-events-none cursor-not-allowed bg-slate-50 text-slate-300' 
                        : 'hover:bg-blue-50 text-blue-900 cursor-pointer'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* MAIN CLINIC SCHEDULES PAGE */
export default function SchedulesPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [editingSlotServiceId, setEditingSlotServiceId] = useState(null);
  
  const getTodayString = () => {
    const today = new Date();
    return formatDateLocal(today);
  };

  const getWeekdayIndex = (dateString) => {
    return parseDateLocal(dateString).getDay();
  };

  const findNearestValidDate = (startDateStr, allowedDays) => {
    if (allowedDays.length === 0) return startDateStr;
    
    let current = parseDateLocal(startDateStr);
    for (let i = 0; i < 365; i++) {
      const currentStr = formatDateLocal(current);
      const dayIndex = getWeekdayIndex(currentStr);
      
      if (allowedDays.includes(dayIndex)) {
        return currentStr;
      }
      current.setDate(current.getDate() + 1);
    }
    return startDateStr;
  };

  const [selectedDates, setSelectedDates] = useState(() => {
    const initialDates = {};
    INITIAL_SERVICES.forEach(s => {
      initialDates[s.id] = findNearestValidDate(getTodayString(), s.allowedDays);
    });
    return initialDates;
  });

  const handleDateChange = (serviceId, dateValue) => {
    setSelectedDates(prev => ({ ...prev, [serviceId]: dateValue }));
  };

  const handleDayToggle = (serviceId, dayIndex) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const isAlreadyAllowed = s.allowedDays.includes(dayIndex);
        let nextAllowedDays = isAlreadyAllowed
          ? s.allowedDays.filter(d => d !== dayIndex)
          : [...s.allowedDays, dayIndex].sort((a, b) => a - b);
        
        if (nextAllowedDays.length === 0) {
          nextAllowedDays = [dayIndex];
        }

        const currentTargetDate = selectedDates[serviceId];
        const currentDayIndex = getWeekdayIndex(currentTargetDate);
        if (!nextAllowedDays.includes(currentDayIndex)) {
          const newValidDate = findNearestValidDate(currentTargetDate, nextAllowedDays);
          setSelectedDates(prev => ({ ...prev, [serviceId]: newValidDate }));
        }
        
        return { ...s, allowedDays: nextAllowedDays };
      }
      return s;
    }));
  };

  const handleUpdateSlots = (serviceId, amount) => {
    const targetDate = selectedDates[serviceId];
    
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const currentCapacity = s.dateSlots[targetDate] !== undefined ? s.dateSlots[targetDate] : s.defaultCapacity;
        const nextCapacity = Math.max(0, currentCapacity + amount);
        
        return {
          ...s,
          dateSlots: {
            ...s.dateSlots,
            [targetDate]: nextCapacity
          }
        };
      }
      return s;
    }));
  };

  const handleSlotsInputChange = (serviceId, value) => {
    const targetDate = selectedDates[serviceId];

    if (value === '') {
      setServices(prev => prev.map(s => {
        if (s.id === serviceId) {
          return {
            ...s,
            dateSlots: {
              ...s.dateSlots,
              [targetDate]: ''
            }
          };
        }
        return s;
      }));
      return;
    }

    const parsedValue = parseInt(value, 10);
    const nextCapacity = Number.isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);

    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          dateSlots: {
            ...s.dateSlots,
            [targetDate]: nextCapacity
          }
        };
      }
      return s;
    }));
  };

  return (
    <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-blue-50 bg-blue-50/20 flex justify-between items-center">
        <div>
          <h3 className="text-base font-black text-blue-950">Active Clinic Schedules</h3>
          <p className="text-xs text-blue-600/80 font-medium mt-0.5">Configure operational days and assign dynamic daily patient booking slot caps</p>
        </div>
        <span className="text-xs font-black text-blue-900 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Layers size={12} /> Live Scheduling Setup
        </span>
      </div>

      <div className="p-6 divide-y divide-blue-50">
        {services.map(service => {
          const currentTargetDate = selectedDates[service.id];
          const displaySlots = service.dateSlots[currentTargetDate] !== undefined 
            ? service.dateSlots[currentTargetDate]
            : service.defaultCapacity;

          // Compute string of selected days: "Mondays, Tuesdays" etc.
          const formattedDaysText = service.allowedDays
            .map(d => WEEKDAYS.find(w => w.index === d)?.fullName + 's')
            .join(', ');

          return (
            <div key={service.id} className="flex flex-col lg:flex-row lg:items-start justify-between py-6 first:pt-2 last:pb-2 gap-4">
              
              {/* Left Column: Context & Weekday Availability */}
              <div className="space-y-3 flex-1">
                <div>
                  <h4 className="font-bold text-sm text-blue-950">{service.title}</h4>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">Standard shift hours: {service.shift}</p>
                </div>

                {/* Dynamic Weekday Label and Grid Matrix */}
                <div className="space-y-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 max-w-md">
                  <span className="text-xs font-black text-blue-900 block min-h-[16px]">
                    {formattedDaysText || "No operating days selected"}
                  </span>
                  <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block pb-1">
                    Weekly Schedule Matrix
                  </span>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {WEEKDAYS.map(day => {
                      const isActive = service.allowedDays.includes(day.index);
                      return (
                        <button
                          key={day.index}
                          type="button"
                          onClick={() => handleDayToggle(service.id, day.index)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center border cursor-pointer select-none ${
                            isActive 
                              ? 'bg-blue-900 border-blue-950 text-white shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-blue-950'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Calendar Dropdown and Counter Adjusters */}
              <div className="flex flex-wrap items-center gap-4 justify-between lg:justify-end shrink-0 lg:pt-1">
                
                <CustomDatePicker 
                  value={currentTargetDate}
                  minDateStr={getTodayString()}
                  allowedDays={service.allowedDays}
                  onChange={(dateStr) => handleDateChange(service.id, dateStr)}
                />

                <div className="flex flex-col items-center min-w-[150px]">
                  <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase mb-1.5 text-center">
                    Slots on {currentTargetDate === getTodayString() ? 'Today' : currentTargetDate}
                  </span>
                  <div className="flex items-center gap-2 w-full justify-center">
                    {editingSlotServiceId === service.id ? (
                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        autoFocus
                        value={displaySlots}
                        onChange={(e) => handleSlotsInputChange(service.id, e.target.value)}
                        onBlur={() => setEditingSlotServiceId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.currentTarget.blur();
                          }
                        }}
                        className="w-14 h-9 rounded-lg border border-blue-200 bg-white px-2 text-center text-sm font-black text-blue-950 shadow-sm outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <span className="w-14 h-9 rounded-lg border border-blue-200 bg-blue-50/50 px-2 flex items-center justify-center text-sm font-black text-blue-950 shadow-sm">
                        {displaySlots === '' ? '—' : displaySlots}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingSlotServiceId(service.id)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-95 cursor-pointer shadow-sm"
                    >
                      <Edit3 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}