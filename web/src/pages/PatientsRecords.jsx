import React, { useState } from 'react';
import { 
  ArrowLeft, Edit, User, Calendar, Phone, ShieldAlert, Plus, ClipboardList, 
  Loader2, X, Mail, MapPin, Briefcase, CreditCard, Heart, FileText, Clock, AlertCircle,
  ExternalLink, Search
} from 'lucide-react';

export default function PatientRecords({
  patient,
  appointments = [], // Dynamically passed global appointments
  onBack,
  onUpdatePatient,
  onAddHistoryRecord,
  isSubmitting,
  setIsSubmitting,
  triggerToast
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConditionEditing, setIsConditionEditing] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Modal state for View All
  const [activeViewAllModal, setActiveViewAllModal] = useState(null); // 'appointments' | 'history' | null
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  // Prefer the live shared appointments state, and only fall back to the patient record's local copy when needed
  const rawAppointments = (() => {
    const matchingGlobalAppointments = (appointments || []).filter(
      (apt) => String(apt.patientId) === String(patient?.id)
    );

    if (matchingGlobalAppointments.length > 0) {
      return matchingGlobalAppointments;
    }

    return Array.isArray(patient?.appointments) ? patient.appointments : [];
  })();

  // Map into standardized appointment records
  const patientAppointments = rawAppointments.map(apt => ({
    id: apt.id,
    dateTime: `${apt.date} ${apt.time}`,
    clinic: apt.clinic || apt.service,
    purpose: apt.service,
    status: apt.status
  }));

  // Helper function to calculate age
  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return '';
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age.toString() : '';
  };

  const formatDateToReadable = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateToISO = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const [editFormData, setEditFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male',
    contact: '',
    email: '',
    civilStatus: 'Single',
    address: '',
    occupation: '',
    philHealthNo: '',
    height: '',
    weight: '',
    bloodType: 'O+',
    allergies: '',
    contactPerson: '',
    emergencyContact: ''
  });

  const [historyFormData, setHistoryFormData] = useState({
    date: '',
    appointmentType: 'General Consultation',
    findings: '',
    remarks: ''
  });

  const [conditionFormData, setConditionFormData] = useState({
    condition: '',
    notes: ''
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dob') {
      const computedAge = calculateAge(value);
      setEditFormData(prev => ({
        ...prev,
        dob: value,
        age: computedAge
      }));
    } else if (name === 'contact') {
      setEditFormData(prev => ({ ...prev, contact: value.replace(/\D/g, '').slice(0, 11) }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStartEdit = () => {
    const isoDob = formatDateToISO(patient.dob);
    const initialAge = isoDob ? calculateAge(isoDob) : (patient.age ? patient.age.toString() : '');

    setEditFormData({
      name: patient.name || '',
      dob: isoDob,
      age: initialAge,
      gender: patient.gender || 'Male',
      contact: patient.contact || '',
      email: patient.email || '',
      civilStatus: patient.civilStatus || 'Single',
      address: patient.address || '',
      occupation: patient.occupation || '',
      philHealthNo: patient.philHealthNo || '',
      height: patient.demographics?.height || '',
      weight: patient.demographics?.weight || '',
      bloodType: patient.demographics?.bloodType || 'O+',
      allergies: patient.demographics?.allergies || 'NKA',
      contactPerson: patient.demographics?.contactPerson || '',
      emergencyContact: patient.demographics?.emergencyContact || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const readableDob = formatDateToReadable(editFormData.dob);
        const updatedPatient = {
          ...patient,
          name: editFormData.name.trim(),
          dob: readableDob || patient.dob,
          age: parseInt(editFormData.age, 10) || 0,
          gender: editFormData.gender,
          contact: editFormData.contact,
          email: editFormData.email,
          civilStatus: editFormData.civilStatus,
          address: editFormData.address,
          occupation: editFormData.occupation,
          philHealthNo: editFormData.philHealthNo,
          demographics: {
            ...patient.demographics,
            height: editFormData.height,
            weight: editFormData.weight,
            bloodType: editFormData.bloodType,
            allergies: editFormData.allergies,
            contactPerson: editFormData.contactPerson,
            emergencyContact: editFormData.emergencyContact
          }
        };

        onUpdatePatient(updatedPatient);
        setIsEditing(false);
        triggerToast('create', `The profile of ${updatedPatient.name} has been successfully updated.`);
      } catch (err) {
        triggerToast('error', 'Could not save modifications to registry.');
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleStartConditionEdit = () => {
    setConditionFormData({
      condition: patient.currentCondition?.condition || '',
      notes: patient.currentCondition?.notes || ''
    });
    setIsConditionEditing(true);
  };

  const handleSaveConditionEdit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const updatedPatient = {
          ...patient,
          currentCondition: {
            ...patient.currentCondition,
            condition: conditionFormData.condition.trim(),
            notes: conditionFormData.notes.trim()
          }
        };

        onUpdatePatient(updatedPatient);
        setIsConditionEditing(false);
        triggerToast('create', 'Current condition information has been updated.');
      } catch (err) {
        triggerToast('error', 'Could not save current condition update.');
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
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
          findings: historyFormData.findings.trim(),
          remarks: historyFormData.remarks.trim() || 'Routine Consultation'
        };

        onAddHistoryRecord(patient.id, newRecord);
        setIsHistoryModalOpen(false);
        setHistoryFormData({ date: '', appointmentType: 'General Consultation', findings: '', remarks: '' });
        triggerToast('create', 'Checkup diagnostics entry successfully added to records.');
      } catch (err) {
        triggerToast('error', 'Failed to save medical history record.');
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'rejected':
      case 'reject':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-blue-50 text-blue-800 border border-blue-100';
    }
  };

  // Search filter handlers for View All modals
  const filteredAppointments = patientAppointments.filter(apt => 
    apt.dateTime?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    apt.clinic?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    apt.purpose?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    apt.status?.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  const filteredHistory = (patient.history || []).filter(rec => 
    rec.date?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    rec.appointmentType?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    rec.findings?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    rec.remarks?.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
      
      {/* TOP BAR */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-base font-extrabold text-blue-950">Patient Profile</h1>
          <p className="text-xs text-blue-600/80 font-medium mt-0.5">Review resident details, appointments, and medical history</p>
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button 
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition"
            >
              <Edit size={14} /> Edit Profile
            </button>
          )}

          <button 
            onClick={() => { onBack(); setIsEditing(false); }}
            className="flex items-center gap-1.5 border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 font-medium text-xs py-2 px-3.5 rounded-xl shadow-sm transition"
          >
            <ArrowLeft size={14} /> Back to Patients
          </button>
        </div>
      </div>

      {isEditing ? (
        /* EDIT FORM */
        <form onSubmit={handleSaveEdit} className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Edit Patient Profile</h2>
              <p className="text-xs text-slate-500">Updating demographics & personal information for {patient.id}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-700">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" name="name" required disabled={isSubmitting} value={editFormData.name} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob" 
                  required
                  disabled={isSubmitting} 
                  value={editFormData.dob} 
                  onChange={handleEditChange} 
                  className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Auto-calculated)</label>
                <input 
                  type="text" 
                  name="age" 
                  readOnly 
                  disabled 
                  value={editFormData.age ? `${editFormData.age} yrs` : ''} 
                  className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs bg-slate-50 text-slate-500 font-semibold cursor-not-allowed outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select name="gender" disabled={isSubmitting} value={editFormData.gender} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Civil Status</label>
                <select name="civilStatus" disabled={isSubmitting} value={editFormData.civilStatus} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input type="text" name="contact" disabled={isSubmitting} value={editFormData.contact} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" name="email" disabled={isSubmitting} value={editFormData.email} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
                <input type="text" name="occupation" disabled={isSubmitting} value={editFormData.occupation} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PhilHealth No.</label>
                <input type="text" name="philHealthNo" disabled={isSubmitting} value={editFormData.philHealthNo} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                <input type="text" name="address" disabled={isSubmitting} value={editFormData.address} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-700">Profile Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Height</label>
                <input type="text" name="height" placeholder="e.g. 160 cm" disabled={isSubmitting} value={editFormData.height} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight</label>
                <input type="text" name="weight" placeholder="e.g. 58 kg" disabled={isSubmitting} value={editFormData.weight} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Type</label>
                <select name="bloodType" disabled={isSubmitting} value={editFormData.bloodType} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Allergies</label>
                <input type="text" name="allergies" placeholder="e.g. NKA or Penicillin" disabled={isSubmitting} value={editFormData.allergies} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                <input type="text" name="contactPerson" placeholder="Name & Contact Number" disabled={isSubmitting} value={editFormData.contactPerson} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
                <input type="text" name="emergencyContact" placeholder="Name & Contact Number" disabled={isSubmitting} value={editFormData.emergencyContact} onChange={handleEditChange} className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsEditing(false)} disabled={isSubmitting} className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs px-4 py-2 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* PATIENT HEADER CARD */}
          <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-5 flex items-start gap-4 pr-0 lg:pr-6 lg:border-r border-slate-100">
                {patient.avatar ? (
                  <img src={patient.avatar} alt={patient.name} className="w-20 h-20 rounded-full object-cover border border-slate-200 shrink-0" />
                ) : (
                  <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                    {patient.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-900 truncate">{patient.name}</h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                      {patient.status || 'Active'}
                    </span>
                  </div>

                  <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-2.5 py-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900">Registration No.</p>
                    <p className="text-sm font-extrabold text-blue-700 tracking-tight">{patient.id}</p>
                  </div>

                  <div className="space-y-1 pt-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2"><Phone size={13} className="text-blue-500 shrink-0" /> <span className="font-extrabold text-slate-800">{patient.contact || 'N/A'}</span></div>
                    <div className="flex items-center gap-2"><Mail size={13} className="text-blue-600 shrink-0" /> <span className="truncate font-semibold text-blue-700">{patient.email || 'N/A'}</span></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 text-xs space-y-2 lg:border-r border-slate-100 lg:pr-6">
                <div className="grid grid-cols-[110px_1fr] items-center gap-1 rounded-lg bg-blue-50/50 px-2 py-1.5">
                  <span className="text-blue-900 font-extrabold flex items-center gap-1.5"><Calendar size={13} className="text-blue-600" /> Date of Birth:</span>
                  <span className="font-bold text-slate-800">{patient.dob ? `${patient.dob} (${patient.age} yrs)` : `${patient.age} yrs old`}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-1 rounded-lg bg-blue-50/50 px-2 py-1.5">
                  <span className="text-blue-900 font-extrabold flex items-center gap-1.5"><User size={13} className="text-blue-600" /> Gender:</span>
                  <span className="font-bold text-slate-800">{patient.gender}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-1 rounded-lg bg-blue-50/50 px-2 py-1.5">
                  <span className="text-blue-900 font-extrabold flex items-center gap-1.5"><Heart size={13} className="text-blue-600" /> Civil Status:</span>
                  <span className="font-bold text-slate-800">{patient.civilStatus || 'Single'}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-1 rounded-lg bg-blue-50/50 px-2 py-1.5">
                  <span className="text-blue-900 font-extrabold flex items-center gap-1.5"><MapPin size={13} className="text-blue-600" /> Address:</span>
                  <span className="font-bold text-slate-800 truncate">{patient.address || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-1 rounded-lg bg-blue-50/50 px-2 py-1.5">
                  <span className="text-blue-900 font-extrabold flex items-center gap-1.5"><Briefcase size={13} className="text-blue-600" /> Occupation:</span>
                  <span className="font-bold text-slate-800">{patient.occupation || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-1 rounded-lg bg-blue-50/50 px-2 py-1.5">
                  <span className="text-blue-900 font-extrabold flex items-center gap-1.5"><CreditCard size={13} className="text-blue-600" /> PhilHealth No.:</span>
                  <span className="font-bold text-slate-800">{patient.philHealthNo || 'N/A'}</span>
                </div>
              </div>

              <div className="lg:col-span-3 bg-slate-50/80 p-4 rounded-xl border border-slate-100 space-y-2.5">
                <div className="border-b border-blue-100 pb-2">
                  <h3 className="text-xs font-extrabold text-blue-900">Overview</h3>
                </div>
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between rounded-md bg-blue-50/50 px-2 py-1"><span className="text-blue-900 font-extrabold">Last Visited:</span> <span className="font-bold text-slate-800">{patient.overview?.lastVisited || 'N/A'}</span></div>
                  <div className="flex justify-between rounded-md bg-blue-50/50 px-2 py-1"><span className="text-blue-900 font-extrabold">Clinic:</span> <span className="font-bold text-slate-800">{patient.overview?.clinic || 'N/A'}</span></div>
                  <div className="flex justify-between rounded-md bg-blue-50/50 px-2 py-1"><span className="text-blue-900 font-extrabold">Date Last Visited:</span> <span className="font-bold text-slate-800">{patient.overview?.dateLastVisited || 'N/A'}</span></div>
                  <div className="flex justify-between rounded-md bg-blue-50/50 px-2 py-1"><span className="text-blue-900 font-extrabold">Illness/Condition:</span> <span className="font-extrabold text-blue-700">{patient.overview?.illnessCondition || 'N/A'}</span></div>
                </div>
              </div>

            </div>
          </div>

          {/* DASHBOARD GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              
              {/* SCHEDULED APPOINTMENTS */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" /> Scheduled Appointments
                  </h3>
                  <button 
                    onClick={() => { setModalSearchTerm(''); setActiveViewAllModal('appointments'); }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition"
                  >
                    View All <ExternalLink size={12} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-blue-900 font-extrabold">
                        <th className="pb-2">Date & Time</th>
                        <th className="pb-2">Clinic</th>
                        <th className="pb-2">Purpose / Service</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {patientAppointments.length > 0 ? (
                        patientAppointments.slice(0, 3).map((apt) => (
                          <tr key={apt.id} className="text-slate-700">
                            <td className="py-3 font-bold text-slate-800">{apt.dateTime}</td>
                            <td className="py-3 font-semibold text-slate-700">{apt.clinic}</td>
                            <td className="py-3 font-semibold text-slate-700">{apt.purpose}</td>
                            <td className="py-3 text-right">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${getStatusBadge(apt.status)}`}>
                                {apt.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400 italic">No scheduled appointments found for this patient.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DEMOGRAPHICS CARD */}
              <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-blue-950 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" /> Profile Demographics
                </h3>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 px-2 py-1.5">
                    <span className="text-blue-900 font-extrabold w-24">Height:</span>
                    <span className="font-bold text-slate-800">{patient.demographics?.height || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 px-2 py-1.5">
                    <span className="text-blue-900 font-extrabold w-24">Blood Type:</span>
                    <span className="font-bold text-slate-800">{patient.demographics?.bloodType || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 px-2 py-1.5">
                    <span className="text-blue-900 font-extrabold w-24">Weight:</span>
                    <span className="font-bold text-slate-800">{patient.demographics?.weight || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 px-2 py-1.5">
                    <span className="text-blue-900 font-extrabold w-24">Allergies:</span>
                    <span className="font-bold text-slate-800">{patient.demographics?.allergies || 'NKA'}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-slate-100 rounded-lg bg-blue-50/40 px-2 py-1.5">
                    <span className="text-blue-900 font-extrabold w-32">Contact Person:</span>
                    <span className="font-bold text-slate-800">{patient.demographics?.contactPerson || 'N/A'}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 rounded-lg bg-blue-50/40 px-2 py-1.5">
                    <span className="text-blue-900 font-extrabold w-32">Emergency Contact:</span>
                    <span className="font-bold text-slate-800">{patient.demographics?.emergencyContact || 'N/A'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              {/* VISIT HISTORY CARD */}
              <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-blue-950 flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" /> Visit History
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setModalSearchTerm(''); setActiveViewAllModal('history'); }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition"
                    >
                      View All <ExternalLink size={12} />
                    </button>
                    <button 
                      onClick={() => setIsHistoryModalOpen(true)}
                      className="text-xs font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition"
                    >
                      <Plus size={13} /> Add Record
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-blue-900 font-extrabold">
                        <th className="pb-2">Date Visited</th>
                        <th className="pb-2">Clinic</th>
                        <th className="pb-2">Illness / Condition</th>
                        <th className="pb-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {patient.history && patient.history.length > 0 ? (
                        patient.history.slice(0, 4).map((record) => (
                          <tr key={record.id} className="text-slate-700">
                            <td className="py-3 font-bold text-slate-800 whitespace-nowrap">{record.date}</td>
                            <td className="py-3 font-semibold text-slate-700">{record.appointmentType}</td>
                            <td className="py-3 font-semibold text-slate-700">{record.findings}</td>
                            <td className="py-3 font-semibold text-slate-700">{record.remarks || 'Regular check-up'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400 italic">No visit history recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CURRENT CONDITION CARD */}
              <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-blue-950 flex items-center gap-2">
                    <AlertCircle size={16} className="text-blue-600" /> Current Condition / Illness
                  </h3>
                  {!isConditionEditing && (
                    <button
                      type="button"
                      onClick={handleStartConditionEdit}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition"
                    >
                      <Edit size={12} /> Edit
                    </button>
                  )}
                </div>

                {isConditionEditing ? (
                  <form onSubmit={handleSaveConditionEdit} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Condition / Illness</label>
                      <input
                        type="text"
                        value={conditionFormData.condition}
                        onChange={(e) => setConditionFormData(prev => ({ ...prev, condition: e.target.value }))}
                        placeholder="e.g. Hypertension"
                        disabled={isSubmitting}
                        className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                      <input
                        type="text"
                        value={conditionFormData.notes}
                        onChange={(e) => setConditionFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="e.g. Under monitoring"
                        disabled={isSubmitting}
                        className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsConditionEditing(false)}
                        disabled={isSubmitting}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-xs space-y-2 pt-1">
                    <div className="flex items-baseline gap-2 rounded-lg bg-blue-50/50 px-2 py-1.5">
                      <span className="text-blue-900 font-extrabold w-20">Condition:</span>
                      <span className="font-bold text-blue-700">{patient.currentCondition?.condition || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-blue-50/50 px-2 py-1.5">
                      <span className="text-blue-900 font-extrabold w-20 shrink-0">Notes:</span>
                      <p className="text-slate-800 leading-relaxed font-bold">
                        {patient.currentCondition?.notes || 'No notes currently attached to this patient.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </>
      )}

      {/* MODAL: VIEW ALL APPOINTMENTS */}
      {activeViewAllModal === 'appointments' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">All Scheduled Appointments</h3>
                  <p className="text-[11px] text-slate-500">Patient: {patient.name} ({patient.id})</p>
                </div>
              </div>
              <button onClick={() => setActiveViewAllModal(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"><X size={18} /></button>
            </div>

            <div className="p-4 border-b border-blue-50 bg-white">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search date, clinic, or service..."
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className="w-full border border-slate-200 pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Date & Time</th>
                    <th className="pb-2">Clinic</th>
                    <th className="pb-2">Purpose / Service</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-medium text-slate-800">{apt.dateTime}</td>
                        <td className="py-3 text-slate-600">{apt.clinic}</td>
                        <td className="py-3 text-slate-600">{apt.purpose}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold ${getStatusBadge(apt.status)}`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 italic">No matching appointments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setActiveViewAllModal(null)} className="border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs px-4 py-1.5 rounded-lg transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW ALL VISIT HISTORY */}
      {activeViewAllModal === 'history' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-blue-50 flex justify-between items-center bg-blue-50/20">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Full Visit History</h3>
                  <p className="text-[11px] text-slate-500">Patient: {patient.name} ({patient.id})</p>
                </div>
              </div>
              <button onClick={() => setActiveViewAllModal(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"><X size={18} /></button>
            </div>

            <div className="p-4 border-b border-blue-50 bg-white flex justify-between gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search date, clinic, findings, or remarks..."
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className="w-full border border-slate-200 pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={() => { setActiveViewAllModal(null); setIsHistoryModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0"
              >
                <Plus size={14} /> Add Record
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Date Visited</th>
                    <th className="pb-2">Clinic</th>
                    <th className="pb-2">Illness / Condition</th>
                    <th className="pb-2">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-medium text-slate-800 whitespace-nowrap">{record.date}</td>
                        <td className="py-3 text-slate-600">{record.appointmentType}</td>
                        <td className="py-3 text-slate-600">{record.findings}</td>
                        <td className="py-3 text-slate-500">{record.remarks || 'Regular check-up'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 italic">No matching visit history records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setActiveViewAllModal(null)} className="border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs px-4 py-1.5 rounded-lg transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD HISTORY ENTRY */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add Visit History Entry</h3>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddHistory} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visit Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={historyFormData.date}
                  onChange={(e) => setHistoryFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-slate-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinic / Service</label>
                <select
                  name="appointmentType"
                  value={historyFormData.appointmentType}
                  onChange={(e) => setHistoryFormData(prev => ({ ...prev, appointmentType: e.target.value }))}
                  className="w-full border border-slate-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Prenatal Clinic">Prenatal Clinic</option>
                  <option value="Pediatric Clinic">Pediatric Clinic</option>
                  <option value="Senior NCD Program">Senior NCD Program</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Illness / Condition</label>
                <input
                  type="text"
                  name="findings"
                  required
                  value={historyFormData.findings}
                  onChange={(e) => setHistoryFormData(prev => ({ ...prev, findings: e.target.value }))}
                  placeholder="e.g., Prenatal Check-up, Routine Exam"
                  className="w-full border border-slate-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  name="remarks"
                  value={historyFormData.remarks}
                  onChange={(e) => setHistoryFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="e.g., Regular check-up, BP normal"
                  className="w-full border border-slate-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}