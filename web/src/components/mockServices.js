// mockServices.js
export const INITIAL_SERVICES = [
  { 
    id: 'srv-1', 
    title: 'General Medical Consultations', 
    shift: '8:00 AM - 4:00 PM', 
    allowedDays: [1, 2, 3, 4, 5], 
    dateSlots: {},
    defaultCapacity: 25 
  },
  { 
    id: 'srv-2', 
    title: 'Prenatal & Maternal Clinic', 
    shift: '9:00 AM - 12:00 PM', 
    allowedDays: [5], 
    dateSlots: {},
    defaultCapacity: 15 
  },
  { 
    id: 'srv-3', 
    title: 'Child Care & Immunization', 
    shift: '8:00 AM - 2:00 PM', 
    allowedDays: [3], 
    dateSlots: {},
    defaultCapacity: 30 
  },
  { 
    id: 'srv-4', 
    title: 'Maternal & Lab Works', 
    shift: '8:00 AM - 4:00 PM', 
    allowedDays: [4], 
    dateSlots: {},
    defaultCapacity: 10 
  },
  { 
    id: 'srv-5', 
    title: 'NCD Care & Senior Wellness', 
    shift: '1:00 PM - 4:00 PM', 
    allowedDays: [5], 
    dateSlots: {},
    defaultCapacity: 20 
  },
];