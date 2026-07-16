import React, { useState } from 'react';
import { Search, UserCheck, Plus, X, UserPlus, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const INITIAL_PATIENTS = [
  { id: 'PT-101', name: 'Juan Dela Cruz', age: 34, gender: 'Male', contact: '09171234567', group: 'General Consultation' },
  { id: 'PT-102', name: 'Maria Santos', age: 28, gender: 'Female', contact: '09187654321', group: 'Prenatal Program' },
  { id: 'PT-103', name: 'Jose Rizal', age: 2, gender: 'Male', contact: '09192223334', group: 'Pediatric Immunization' },
  { id: 'PT-104', name: 'Ana Gomez', age: 67, gender: 'Female', contact: '09159998887', group: 'Senior NCD Program' },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [search, setSearch] = useState('');
  
  // Modal & Async UI states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Toast Feedback State ('create' | 'delete' | 'error')
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: '',
    group: 'General Consultation'
  });

  // Sort patients strictly by their numeric Patient ID
  const sortedPatients = [...patients].sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  // Filter sorted patients based on search term
  const filtered = sortedPatients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to trigger feedback toasts
  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4500);
  };

  // Large alert panel styling based on type
  const getToastStyles = () => {
    switch (toast.type) {
      case 'create':
        return {
          wrapperClass: 'border-2 border-emerald-400 text-emerald-950 bg-emerald-50 shadow-emerald-100',
          icon: <CheckCircle2 className="text-emerald-600 shrink-0" size={32} />,
          title: 'Successfully Created Profile'
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
          wrapperClass: 'border-2 border-red-400 text-red-955 bg-red-50 shadow-red-100',
          icon: <AlertCircle className="text-red-600 shrink-0" size={32} />,
          title: 'Action Encountered an Error'
        };
    }
  };

  const toastStyle = getToastStyles();

  // Unified change handler with strict numeric typing validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'age') {
      // Strip everything except numbers
      const numericAge = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, age: numericAge }));
    } else if (name === 'contact') {
      // Strip non-numbers & enforce a maximum limit of 11 digits
      const numericContact = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, contact: numericContact }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Submit and add new patient
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate server write delay (1.2s)
    setTimeout(() => {
      try {
        if (Math.random() < 0.05) {
          throw new Error("Local transmission interrupted. Could not save record to database.");
        }

        const maxIdNumber = patients.reduce((max, p) => {
          const num = parseInt(p.id.replace(/\D/g, ''), 10) || 100;
          return num > max ? num : max;
        }, 100);
        
        const newPatientId = `PT-${maxIdNumber + 1}`;

        const newPatient = {
          id: newPatientId,
          name: formData.name.trim(),
          age: parseInt(formData.age, 10) || 0,
          gender: formData.gender,
          contact: formData.contact,
          group: formData.group
        };

        setPatients(prev => [...prev, newPatient]);
        setIsModalOpen(false); // Close Modal
        
        // Reset Form
        setFormData({
          name: '',
          age: '',
          gender: 'Male',
          contact: '',
          group: 'General Consultation'
        });

        triggerToast('create', `${newPatient.name} has been successfully registered under ${newPatientId}.`);
      } catch (err) {
        triggerToast('error', err.message || 'Failed to add patient. Check network settings and try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1200);
  };

  // Delete a patient from state
  const handleDeletePatient = (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to permanently remove patient profile: ${name} (${id})?`);
    if (confirmed) {
      setDeletingId(id);

      // Simulate deletion processing delay (1.0s)
      setTimeout(() => {
        try {
          if (Math.random() < 0.02) {
            throw new Error("Security clearance denied. Target resource is locked.");
          }

          setPatients(prev => prev.filter(p => p.id !== id));
          triggerToast('delete', `The permanent record of ${name} (${id}) was completely wiped from the registry.`);
        } catch (err) {
          triggerToast('error', err.message || 'Critical failure: Deletion stopped by server.');
        } finally {
          setDeletingId(null);
        }
      }, 1000);
    }
  };

  return (
    <div className="relative">

      {/* --- LARGE COLOR-CODED NOTIFICATION PANEL --- */}
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
            onClick={() => setToast({ show: false, type: '', message: '' })} 
            className="text-slate-500 hover:text-slate-900 transition ml-2 p-1 hover:bg-white/50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      )}
      
      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-955">Patient Registry & Records</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Access resident medical profiles and demographic indicators</p>
          </div>

          <div className="flex gap-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold text-slate-900"
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
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Full Name</th>
                <th className="py-4 px-6">Age / Gender</th>
                <th className="py-4 px-6">Contact Number</th>
                <th className="py-4 px-6">Assigned Program</th>
                <th className="py-4 px-6">Records</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-extrabold text-blue-900 text-sm">{patient.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-955 text-sm">{patient.name}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-700">{patient.age} yrs / {patient.gender}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-slate-800">{patient.contact || 'No Number'}</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-800 border border-blue-100 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {patient.group}
                      </span>
                    </td>
                    {/* Records Column */}
                    <td className="py-4 px-6">
                      <button className="text-blue-900 hover:text-blue-955 font-extrabold text-xs flex items-center gap-1 cursor-pointer">
                        <UserCheck size={14} /> View File
                      </button>
                    </td>
                    {/* Actions Column */}
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
                          title="Delete Patient Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-sm font-semibold text-slate-400">
                    No registry matches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD PATIENT MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-x-2.5">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-900">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-955 text-base leading-none">Register Patient</h3>
                  <span className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">New Resident Health File</span>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-slate-955 transition p-1 hover:bg-slate-100 rounded-lg cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-2">
                  Resident Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maria Clara"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-slate-955 disabled:opacity-50"
                />
              </div>

              {/* Age & Gender Side-by-Side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-2">
                    Age (Numbers Only)
                  </label>
                  <input
                    type="text"
                    name="age"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    disabled={isSubmitting}
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 28"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-slate-955 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    disabled={isSubmitting}
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-slate-955 disabled:opacity-50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Contact Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-2">
                  Mobile Number (Strict Numbers Only, Max 11 Digits)
                </label>
                <input
                  type="text"
                  name="contact"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={isSubmitting}
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. 09171234567"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-slate-955 disabled:opacity-50"
                />
              </div>

              {/* Assigned Program Select */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-2">
                  Assigned Health Program
                </label>
                <select
                  name="group"
                  disabled={isSubmitting}
                  value={formData.group}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-slate-955 disabled:opacity-50"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Prenatal Program">Prenatal Program</option>
                  <option value="Pediatric Immunization">Pediatric Immunization</option>
                  <option value="Senior NCD Program">Senior NCD Program</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-5 py-3 rounded-2xl transition cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 min-w-[150px] disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Saving Record...
                    </>
                  ) : (
                    'Confirm Registration'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}