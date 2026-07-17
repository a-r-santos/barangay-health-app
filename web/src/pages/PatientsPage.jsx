import React, { useState } from 'react';
import { Search, UserCheck, Plus, X, UserPlus, Trash2, Loader2, CheckCircle2, AlertCircle, ArrowLeft, ShieldAlert, Phone, Calendar, User, Edit, ClipboardList } from 'lucide-react';

// Import externalized mock registry data
import { INITIAL_PATIENTS } from '../components/mockPatients.js';

export default function PatientsPage() {
  const [patients, setPatients] = useState(() => {
    return INITIAL_PATIENTS.map(p => ({ ...p, history: p.history || [] }));
  });
  const [search, setSearch] = useState('');
  
  // Selected Profile Context
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Modal & Global Processing States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Demographic Edit Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: ''
  });

  // Checkup Records Form States
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyFormData, setHistoryFormData] = useState({
    date: '',
    appointmentType: 'General Consultation',
    findings: ''
  });

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

  const filtered = sortedPatients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

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
          wrapperClass: 'border-2 border-emerald-400 text-emerald-955 bg-emerald-50 shadow-emerald-100',
          icon: <CheckCircle2 className="text-emerald-600 shrink-0" size={32} />,
          title: 'Success'
        };
      case 'delete':
        return {
          wrapperClass: 'border-2 border-rose-400 text-rose-955 bg-rose-50 shadow-rose-100',
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'age') {
      setEditFormData(prev => ({ ...prev, age: value.replace(/\D/g, '') }));
    } else if (name === 'contact') {
      setEditFormData(prev => ({ ...prev, contact: value.replace(/\D/g, '').slice(0, 11) }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStartEdit = () => {
    setEditFormData({
      name: selectedPatient.name,
      age: selectedPatient.age.toString(),
      gender: selectedPatient.gender,
      contact: selectedPatient.contact
    });
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const updatedPatient = {
          ...selectedPatient,
          name: editFormData.name.trim(),
          age: parseInt(editFormData.age, 10) || 0,
          gender: editFormData.gender,
          contact: editFormData.contact
        };

        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? updatedPatient : p));
        setSelectedPatient(updatedPatient);
        setIsEditing(false);
        triggerToast('create', `The profile of ${updatedPatient.name} has been successfully updated.`);
      } catch (err) {
        triggerToast('error', 'Could not save modifications to registry.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  const handleAddHistory = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const newRecord = {
          id: `REC-${Date.now()}`,
          date: historyFormData.date,
          appointmentType: historyFormData.appointmentType,
          findings: historyFormData.findings.trim()
        };

        const updatedHistory = [newRecord, ...(selectedPatient.history || [])];
        const updatedPatient = { ...selectedPatient, history: updatedHistory };

        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? updatedPatient : p));
        setSelectedPatient(updatedPatient);
        setIsHistoryModalOpen(false);
        setHistoryFormData({ date: '', appointmentType: 'General Consultation', findings: '' });
        triggerToast('create', 'Checkup diagnostics entry successfully added to records.');
      } catch (err) {
        triggerToast('error', 'Failed to save medical history record.');
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
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
          name: formData.name.trim(),
          age: parseInt(formData.age, 10) || 0,
          gender: formData.gender,
          contact: formData.contact,
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

      {/* --- NOTIFICATION TOAST --- */}
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

      {/* --- CONDITIONAL VIEWS: PATIENT DETAIL PROFILE VS REGISTRY LOG TABLE --- */}
      {selectedPatient ? (
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
          
          {/* Detailed Sub-view Navigation Control Header */}
          <div className="p-6 border-b border-blue-50 bg-blue-50/20 flex items-center justify-between flex-wrap gap-4">
            <button 
              onClick={() => { setSelectedPatient(null); setIsEditing(false); }}
              className="flex items-center gap-2 text-blue-900 hover:text-blue-955 font-extrabold text-xs tracking-wide uppercase group border border-blue-100 bg-white py-2 px-4 rounded-xl shadow-sm transition cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition text-blue-700" /> Back to Registry
            </button>
            
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 text-blue-900 hover:text-blue-955 font-extrabold text-xs tracking-wide uppercase border border-blue-100 bg-white py-2 px-4 rounded-xl shadow-sm transition cursor-pointer"
                >
                  <Edit size={14} className="text-blue-700" /> Edit Profile
                </button>
              )}
              <span className="text-xs font-black text-blue-900 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Clinical Health File
              </span>
            </div>
          </div>

          {/* Demographic Structural Fields Editing Panel */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="p-8 space-y-6">
              <div className="border-b border-blue-50 pb-4">
                <h3 className="text-lg font-black text-blue-955">Modify Patient Demographics</h3>
                <p className="text-xs text-blue-600/80 font-medium">Update the demographic markers for registry key {selectedPatient.id}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  disabled={isSubmitting}
                  value={editFormData.name}
                  onChange={handleEditChange}
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
                    disabled={isSubmitting}
                    value={editFormData.age}
                    onChange={handleEditChange}
                    className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Gender</label>
                  <select
                    name="gender"
                    disabled={isSubmitting}
                    value={editFormData.gender}
                    onChange={handleEditChange}
                    className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Mobile Contact</label>
                <input
                  type="text"
                  name="contact"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={isSubmitting}
                  value={editFormData.contact}
                  onChange={handleEditChange}
                  className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955"
                />
              </div>

              <div className="flex justify-end gap-x-3 pt-4 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                  className="border border-blue-100 hover:bg-blue-50/50 text-blue-900 font-bold text-xs px-5 py-3 rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-1.5 min-w-[130px]"
                >
                  {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* Main Profile Details Visual View Block */
            <div className="p-8 space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-blue-50 pb-6">
                <div className="w-20 h-20 bg-blue-900 text-white rounded-3xl flex items-center justify-center font-black text-2xl shadow-md border border-blue-955 shrink-0">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-black text-blue-955">{selectedPatient.name}</h2>
                    <span className="text-[11px] font-black tracking-widest uppercase bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {selectedPatient.id}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600/70 font-bold uppercase tracking-wider">Registered Record Profile</p>
                </div>
              </div>

              {/* Core Demographic Parameter Displays */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50/30 border border-blue-100/70 p-5 rounded-2xl flex items-center gap-4">
                  <div className="p-2.5 bg-white border border-blue-100 rounded-xl text-blue-900"><User size={20} /></div>
                  <div>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Gender Orientation</p>
                    <p className="text-sm font-black text-blue-955 mt-0.5">{selectedPatient.gender}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50/30 border border-blue-100/70 p-5 rounded-2xl flex items-center gap-4">
                  <div className="p-2.5 bg-white border border-blue-100 rounded-xl text-blue-900"><Calendar size={20} /></div>
                  <div>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Current Age</p>
                    <p className="text-sm font-black text-blue-955 mt-0.5">{selectedPatient.age} Years Old</p>
                  </div>
                </div>

                <div className="bg-blue-50/30 border border-blue-100/70 p-5 rounded-2xl flex items-center gap-4">
                  <div className="p-2.5 bg-white border border-blue-100 rounded-xl text-blue-900"><Phone size={20} /></div>
                  <div>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Primary Contact</p>
                    <p className="text-sm font-black text-blue-955 mt-0.5">{selectedPatient.contact || 'None Listed'}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Medical Records History Timeline */}
              <div className="border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-blue-50/20 p-4 border-b border-blue-50 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-blue-700" />
                    <h4 className="text-xs font-black text-blue-955 uppercase tracking-widest">Medical History & Availed Checkups</h4>
                  </div>
                  <button
                    onClick={() => setIsHistoryModalOpen(true)}
                    className="bg-blue-900 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl hover:bg-blue-955 transition flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Plus size={13} /> Add Checkup Record
                  </button>
                </div>
                
                <div className="p-6 bg-white">
                  {selectedPatient.history && selectedPatient.history.length > 0 ? (
                    <div className="relative border-l-2 border-blue-100 pl-6 ml-3 space-y-6 my-2">
                      {selectedPatient.history.map((record) => (
                        <div key={record.id} className="relative group">
                          <div className="absolute -left-[31px] top-1 bg-white border-2 border-blue-955 rounded-full w-3 h-3 group-hover:bg-blue-900 transition" />
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[11px] font-black text-blue-900 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                                <Calendar size={11} /> {record.date}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-blue-900 bg-blue-100/60 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                Availed: {record.appointmentType}
                              </span>
                            </div>
                            
                            <div className="bg-blue-50/20 border border-blue-50 rounded-xl p-4">
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <ClipboardList size={12} /> Clinical Findings
                              </p>
                              <p className="text-sm font-bold text-blue-955 leading-relaxed whitespace-pre-wrap">
                                {record.findings}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-sm font-bold text-blue-900/70">No diagnostic checkup logs are linked to this primary account.</p>
                      <p className="text-xs text-blue-600/50 font-medium">Consultation entries sync dynamically following counter check-in confirmations.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* --- CORE CENTRAL REGISTRY LOG TABLE --- */
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="p-6 border-b border-blue-50 flex flex-col md:flex-row gap-4 justify-between items-center bg-blue-50/20">
            <div>
              <h3 className="text-base font-black text-blue-955">Patient Registry & Records</h3>
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
                className="bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-955 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
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
                          className="text-blue-900 hover:text-blue-955 font-extrabold text-xs flex items-center gap-1 cursor-pointer border border-blue-100 bg-blue-50/40 hover:bg-blue-50 py-1 px-2.5 rounded-lg transition"
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

      {/* --- REGISTRATION DIALOG --- */}
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
                  className="bg-blue-900 hover:bg-blue-955 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 min-w-[150px]"
                >
                  {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD CHECKUP HISTORY RECORD MODAL --- */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-blue-955/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-blue-50 flex justify-between items-center bg-blue-50/20">
              <div className="flex items-center gap-x-2.5">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-900"><ClipboardList size={20} /></div>
                <div>
                  <h3 className="font-black text-blue-955 text-base leading-none">Log Past Checkup</h3>
                  <span className="text-[10px] text-blue-600 font-bold tracking-wide uppercase">Append Diagnostics History</span>
                </div>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-blue-900/60 hover:text-blue-955"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddHistory} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Checkup Consultation Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={historyFormData.date}
                  onChange={(e) => setHistoryFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Availed Clinic Consultation Type</label>
                <select
                  name="appointmentType"
                  value={historyFormData.appointmentType}
                  onChange={(e) => setHistoryFormData(prev => ({ ...prev, appointmentType: e.target.value }))}
                  className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Prenatal & Maternal Clinic">Prenatal & Maternal Clinic</option>
                  <option value="Child Care & Immunization">Child Care & Immunization</option>
                  <option value="Maternal & Lab Works">Maternal & Lab Works</option>
                  <option value="NCD Care & Senior Wellness">NCD Care & Senior Wellness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest pl-1 mb-2">Clinical Findings & Notes</label>
                <textarea
                  name="findings"
                  required
                  rows={4}
                  value={historyFormData.findings}
                  onChange={(e) => setHistoryFormData(prev => ({ ...prev, findings: e.target.value }))}
                  placeholder="Enter medical findings, parameters, prescriptions, or diagnosis details..."
                  className="w-full bg-blue-50/30 border border-blue-100 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-blue-900 focus:bg-white font-semibold text-blue-955 resize-none placeholder:text-blue-900/30"
                />
              </div>

              <div className="flex justify-end gap-x-3 pt-3 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="border border-blue-100 hover:bg-blue-50/50 text-blue-900 font-bold text-xs px-5 py-3 rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-900 hover:bg-blue-955 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 min-w-[150px]"
                >
                  {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : 'Save Record Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}