import React, { useState } from 'react';
import { Search, UserCheck, Plus, X, UserPlus, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// Matches exact component name
import PatientsRecords from './PatientsRecords.jsx';
// Import directly from unified mock data file
import { INITIAL_PATIENTS } from '../components/mockPatients.js';

export default function PatientsPage({ appointments = [] }) {
  const [patients, setPatients] = useState(() => {
    return INITIAL_PATIENTS.map(p => ({ 
      ...p, 
      history: p.history || [],
      appointments: p.appointments || []
    }));
  });
  const [search, setSearch] = useState('');
  
  // Selected Profile Context
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Modal & Processing States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Global Context Alert System
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Baseline Registration Data State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: ''
  });

  const sortedPatients = [...patients].sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  const filtered = sortedPatients.filter(p => {
    const term = search.toLowerCase();
    const clinicName = p.overview?.clinic || '';
    const condition = p.currentCondition?.condition || '';

    return (
      p.name.toLowerCase().includes(term) || 
      p.id.toLowerCase().includes(term) ||
      clinicName.toLowerCase().includes(term) ||
      condition.toLowerCase().includes(term)
    );
  });

  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4500);
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'create':
        return {
          wrapperClass: 'border-2 border-emerald-400 text-emerald-950 bg-emerald-50 shadow-emerald-100',
          icon: <CheckCircle2 className="text-emerald-600 shrink-0" size={32} />,
          title: 'Success'
        };
      case 'delete':
        return {
          wrapperClass: 'border-2 border-rose-400 text-rose-950 bg-rose-50 shadow-rose-100',
          icon: <Trash2 className="text-rose-600 shrink-0" size={32} />,
          title: 'Successfully Deleted Profile'
        };
      case 'error':
      default:
        return {
          wrapperClass: 'border-2 border-red-400 text-red-950 bg-red-50 shadow-red-100',
          icon: <AlertCircle className="text-red-600 shrink-0" size={32} />,
          title: 'Action Encountered an Error'
        };
    }
  };

  const toastStyle = getToastStyles();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'age') {
      setFormData(prev => ({ ...prev, age: value.replace(/\D/g, '') }));
    } else if (name === 'contact') {
      setFormData(prev => ({ ...prev, contact: value.replace(/\D/g, '').slice(0, 11) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Sync back edited demographic data from <PatientsRecords />
  const handleUpdatePatientFromRecords = (updatedPatient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setSelectedPatient(updatedPatient);
  };

  // Append new diagnostic tracking parameters generated inside sub-view
  const handleAddHistoryFromRecords = (patientId, newRecord) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, history: [newRecord, ...(p.history || [])] };
      }
      return p;
    }));
    setSelectedPatient(prev => ({
      ...prev,
      history: [newRecord, ...(prev.history || [])]
    }));
  };

  const handleDeleteHistoryFromRecords = (patientId, recordId) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, history: (p.history || []).filter(record => record.id !== recordId) };
      }
      return p;
    }));

    setSelectedPatient(prev => prev && prev.id === patientId ? {
      ...prev,
      history: (prev.history || []).filter(record => record.id !== recordId)
    } : prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const maxIdNumber = patients.reduce((max, p) => {
          const num = parseInt(p.id.replace(/\D/g, ''), 10) || 100;
          return num > max ? num : max;
        }, 100);
        
        const newPatientId = `PT-${maxIdNumber + 1}`;

        const newPatient = {
          id: newPatientId,
          status: "Active",
          name: formData.name.trim(),
          age: parseInt(formData.age, 10) || 0,
          dob: "N/A",
          gender: formData.gender,
          civilStatus: "Single",
          contact: formData.contact,
          email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
          address: "Cityville",
          occupation: "N/A",
          philHealthNo: "N/A",
          avatar: null,
          overview: {
            lastVisited: "N/A",
            clinic: "General Consultation",
            dateLastVisited: "N/A",
            illnessCondition: "Initial Intake"
          },
          demographics: {
            height: "N/A",
            weight: "N/A",
            bloodType: "N/A",
            allergies: "NKA",
            contactPerson: "N/A",
            emergencyContact: "N/A"
          },
          currentCondition: {
            condition: "General Health Evaluation",
            notes: "Newly registered patient record."
          },
          appointments: [],
          history: []
        };

        setPatients(prev => [...prev, newPatient]);
        setIsModalOpen(false);
        setFormData({ name: '', age: '', gender: 'Male', contact: '' });
        triggerToast('create', `${newPatient.name} has been successfully registered under ${newPatientId}.`);
      } catch (err) {
        triggerToast('error', 'Failed to add patient to database registry.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const handleDeletePatient = (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to permanently remove patient profile: ${name} (${id})?`);
    if (confirmed) {
      setDeletingId(id);
      setTimeout(() => {
        try {
          setPatients(prev => prev.filter(p => p.id !== id));
          if (selectedPatient?.id === id) setSelectedPatient(null);
          triggerToast('delete', `The profile record of ${name} (${id}) was completely wiped from the registry.`);
        } catch (err) {
          triggerToast('error', 'Critical failure: Deletion stopped by server rules.');
        } finally {
          setDeletingId(null);
        }
      }, 1000);
    }
  };

  return (
    <div className="relative">

      {/* NOTIFICATION TOAST */}
      {toast.show && (
        <div className={`fixed top-8 right-8 z-50 flex items-center gap-5 px-6 py-5 rounded-3xl shadow-2xl border animate-in fade-in slide-in-from-top-6 duration-300 w-full max-w-lg backdrop-blur-lg ${toastStyle.wrapperClass}`}>
          {toastStyle.icon}
          <div className="flex-1">
            <h4 className="font-black text-xs uppercase tracking-widest opacity-85">{toastStyle.title}</h4>
            <p className="text-sm font-bold mt-1.5 leading-relaxed">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast({ show: false, type: '', message: '' })} 
            className="text-slate-500 hover:text-slate-900 transition ml-2 p-1 hover:bg-white/50 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* CONDITIONAL VIEWS: PATIENT DETAIL PROFILE VS REGISTRY LOG TABLE */}
      {selectedPatient ? (
        <PatientsRecords 
          patient={selectedPatient}
          appointments={appointments}
          onBack={() => setSelectedPatient(null)}
          onUpdatePatient={handleUpdatePatientFromRecords}
          onAddHistoryRecord={handleAddHistoryFromRecords}
          onDeleteHistoryRecord={handleDeleteHistoryFromRecords}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          triggerToast={triggerToast}
        />
      ) : (
        /* CORE REGISTRY LOG TABLE */
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="p-6 border-b border-blue-50 flex flex-col md:flex-row gap-4 justify-between items-center bg-blue-50/20">
            <div>
              <h3 className="text-base font-black text-blue-950">Patient Registry & Records</h3>
              <p className="text-xs text-blue-600/80 font-medium mt-0.5">Access resident medical profiles and historical checkup tracking</p>
            </div>

            <div className="flex gap-x-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search size={16} className="text-blue-600" />
                </span>
                <input
                  type="text"
                  placeholder="Search patients by name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-blue-100 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-blue-955"
                />
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-950 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus size={16} /> Add Patient
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-blue-50 bg-blue-50/10 text-[11px] font-bold text-blue-900 uppercase tracking-widest">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Full Name</th>
                  <th className="py-4 px-6">Age / Gender</th>
                  <th className="py-4 px-6">Contact Number</th>
                  <th className="py-4 px-6">Records File</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/60">
                {filtered.length > 0 ? (
                  filtered.map((patient) => (
                    <tr key={patient.id} className="hover:bg-blue-50/20 transition">
                      <td className="py-4 px-6 font-extrabold text-blue-900 text-sm">{patient.id}</td>
                      <td className="py-4 px-6 font-bold text-blue-955 text-sm">{patient.name}</td>
                      <td className="py-4 px-6 text-xs font-semibold text-blue-900/80">{patient.age} yrs / {patient.gender}</td>
                      <td className="py-4 px-6 text-xs font-semibold text-blue-955/80">{patient.contact || 'No Number'}</td>
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => setSelectedPatient(patient)}
                          className="text-blue-900 hover:text-blue-950 font-extrabold text-xs flex items-center gap-1 cursor-pointer border border-blue-100 bg-blue-50/40 hover:bg-blue-50 py-1 px-2.5 rounded-lg transition"
                        >
                          <UserCheck size={14} className="text-blue-700" /> View File ({patient.history?.length || 0})
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {deletingId === patient.id ? (
                          <div className="inline-flex items-center justify-center p-1.5">
                            <Loader2 size={15} className="text-rose-600 animate-spin" />
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleDeletePatient(patient.id, patient.name)}
                            disabled={deletingId !== null}
                            className="text-slate-400 hover:text-rose-600 transition p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer inline-flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-sm font-semibold text-blue-900/40">
                      No registry matches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REGISTRATION DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-blue-50 flex justify-between items-center bg-blue-50/20">
              <div className="flex items-center gap-x-2.5">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-900"><UserPlus size={20} /></div>
                <div>
                  <h3 className="font-black text-blue-955 text-base leading-none">Register Patient</h3>
                  <span className="text-[10px] text-blue-600 font-bold tracking-wide uppercase">New Profile Document Entry</span>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-900/60 hover:text-blue-955"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Resident Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maria Clara"
                  className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Age</label>
                  <input
                    type="text"
                    name="age"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 28"
                    className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Mobile Number (Max 11 Digits)</label>
                <input
                  type="text"
                  name="contact"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. 09171234567"
                  className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955"
                />
              </div>

              <div className="flex justify-end gap-x-3 pt-3 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-blue-100 hover:bg-blue-50/50 text-blue-900 font-bold text-xs px-5 py-3 rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 min-w-[150px]"
                >
                  {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}