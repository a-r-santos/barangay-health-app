export const CLINIC_SERVICES = [
  {
    id: 'general-consult',
    name: 'General Medical Consultations',
    icon: 'stethoscope',
    color: '#1e3a8a',
    bgColor: 'bg-blue-50',
    schedule: 'Mondays (AM / PM)',
    timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    availableDays: [1], // Monday
    maxSlotsPerDay: 10,
    attendedBy: 'Municipal Doctor & Nurses',
    bookings: {
      2026: {
        6: { 6: 10, 13: 8, 20: 10, 27: 4 },
        7: { 3: 5, 10: 9 }
      }
    }
  },
  {
    id: 'prenatal-care',
    name: 'Prenatal & Maternal Clinic',
    icon: 'mother-heart',
    color: '#db2777',
    bgColor: 'bg-pink-50',
    schedule: 'Tuesdays (AM / PM)',
    timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    availableDays: [2], // Tuesday
    maxSlotsPerDay: 10,
    attendedBy: 'Barangay Midwife',
    bookings: {
      2026: {
        6: { 7: 6, 14: 10, 21: 3, 28: 9 },
        7: { 4: 2, 11: 10 }
      }
    }
  },
  {
    id: 'child-care',
    name: 'Child Care & Immunization',
    icon: 'baby-face-outline',
    color: '#0284c7',
    bgColor: 'bg-sky-50',
    schedule: 'Wednesdays (AM Only)',
    timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'], // AM Only
    availableDays: [3], // Wednesday
    maxSlotsPerDay: 10,
    attendedBy: 'Barangay Health Workers (BHW)',
    bookings: {
      2026: {
        6: { 1: 8, 8: 10, 15: 10, 22: 4, 29: 7 },
        7: { 5: 3, 12: 10 }
      }
    }
  },
  {
    id: 'maternal-lab',
    name: 'Maternal & Lab Works',
    icon: 'clipboard-text-play-outline',
    color: '#059669',
    bgColor: 'bg-emerald-50',
    schedule: 'Thursdays (AM / PM)',
    timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    availableDays: [4], // Thursday
    maxSlotsPerDay: 10,
    attendedBy: 'Midwife & Lab Tech',
    bookings: {
      2026: {
        6: { 2: 9, 9: 10, 16: 6, 23: 10, 30: 2 },
        7: { 6: 5, 13: 10 }
      }
    }
  },
  {
    id: 'ncd-senior',
    name: 'NCD Care & Senior Wellness',
    icon: 'heart-pulse',
    color: '#4f46e5',
    bgColor: 'bg-indigo-50',
    schedule: 'Fridays (AM Only)',
    timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'], // AM Only
    availableDays: [5], // Friday
    maxSlotsPerDay: 10,
    attendedBy: 'Nurse Coordinator',
    bookings: {
      2026: {
        6: { 3: 10, 10: 10, 17: 9, 24: 10, 31: 5 },
        7: { 7: 2, 14: 10 }
      }
    }
  }
];