import React, { useState } from 'react';
import { ArrowLeft, Edit, User, Calendar, Phone, ShieldAlert, Plus, ClipboardList, Loader2, X } from 'lucide-react';

export default function PatientRecords({
  patient,
  onBack,
  onUpdatePatient,
  onAddHistoryRecord,
  isSubmitting,
  setIsSubmitting,
  triggerToast
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Demographic Edit Form States
  const [editFormData, setEditFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: ''
  });

  // Checkup Records Form States
  const [historyFormData, setHistoryFormData] = useState({
    date: '',
    appointmentType: 'General Consultation',
    findings: ''
  });

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
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      contact: patient.contact
    });
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const updatedPatient = {
          ...patient,
          name: editFormData.name.trim(),
          age: parseInt(editFormData.age, 10) || 0,
          gender: editFormData.gender,
          contact: editFormData.contact
        };

        onUpdatePatient(updatedPatient);
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

        onAddHistoryRecord(patient.id, newRecord);
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

  return (
    <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
      
      {/* Detailed Sub-view Navigation Control Header */}
      <div className="p-6 border-b border-blue-50 bg-blue-50/20 flex items-center justify-between flex-wrap gap-4">
        <button 
          onClick={() => { onBack(); setIsEditing(false); }}
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
            <p className="text-xs text-blue-600/80 font-medium">Update the demographic markers for registry key {patient.id}</p>
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
              className="bg-blue-900 hover:bg-blue-955 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-1.5 min-w-[130px]"
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
              {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-black text-blue-955">{patient.name}</h2>
                <span className="text-[11px] font-black tracking-widest uppercase bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {patient.id}
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
                <p className="text-sm font-black text-blue-955 mt-0.5">{patient.gender}</p>
              </div>
            </div>
            
            <div className="bg-blue-50/30 border border-blue-100/70 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-2.5 bg-white border border-blue-100 rounded-xl text-blue-900"><Calendar size={20} /></div>
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Current Age</p>
                <p className="text-sm font-black text-blue-955 mt-0.5">{patient.age} Years Old</p>
              </div>
            </div>

            <div className="bg-blue-50/30 border border-blue-100/70 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-2.5 bg-white border border-blue-100 rounded-xl text-blue-900"><Phone size={20} /></div>
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Primary Contact</p>
                <p className="text-sm font-black text-blue-955 mt-0.5">{patient.contact || 'None Listed'}</p>
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
              {patient.history && patient.history.length > 0 ? (
                <div className="relative border-l-2 border-blue-100 pl-6 ml-3 space-y-6 my-2">
                  {patient.history.map((record) => (
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