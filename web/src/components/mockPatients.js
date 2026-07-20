// mockPatients.js

export const INITIAL_PATIENTS = [
  {
    id: "PT-100",
    status: "Active",
    name: "Maria Angelica D. Santos",
    age: 28,
    dob: "May 12, 1996",
    gender: "Female",
    civilStatus: "Married",
    contact: "0912 345 6789",
    email: "maria.santos@email.com",
    address: "Purok 3, San Isidro, Cityville",
    occupation: "Housewife",
    philHealthNo: "12-345678901-2",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    overview: {
      lastVisited: "July 10, 2025",
      clinic: "Prenatal Clinic",
      dateLastVisited: "July 10, 2025",
      illnessCondition: "Prenatal Check-up"
    },
    demographics: {
      height: "160 cm",
      weight: "58 kg",
      bloodType: "O+",
      allergies: "NKA",
      contactPerson: "Juan D. Santos (0912 987 6543)",
      emergencyContact: "Juan D. Santos (0912 987 6543)"
    },
    currentCondition: {
      condition: "Prenatal",
      notes: "Patient is currently on her second trimester. Regular prenatal check-up and vitamins advised."
    },
    appointments: [
      {
        id: "APT-100-1",
        patientId: "PT-100",
        name: "Maria Angelica D. Santos",
        service: "Prenatal & Maternal Clinic",
        clinic: "Prenatal Clinic",
        date: "2026-07-25",
        time: "08:30 AM",
        status: "Approved"
      },
      {
        id: "APT-100-2",
        patientId: "PT-100",
        name: "Maria Angelica D. Santos",
        service: "Tetanus Toxoid Immunization",
        clinic: "Immunization Clinic",
        date: "2026-08-10",
        time: "10:00 AM",
        status: "Approved"
      },
      {
        id: "APT-100-3",
        patientId: "PT-100",
        name: "Maria Angelica D. Santos",
        service: "Routine Obstetric Ultrasound",
        clinic: "Prenatal Clinic",
        date: "2026-08-28",
        time: "01:30 PM",
        status: "Pending"
      },
      {
        id: "APT-100-4",
        patientId: "PT-100",
        name: "Maria Angelica D. Santos",
        service: "3rd Trimester Follow-up Checkup",
        clinic: "Prenatal Clinic",
        date: "2026-09-15",
        time: "09:00 AM",
        status: "Pending"
      }
    ],
    history: [
      {
        id: "REC-15100",
        date: "July 10, 2025",
        appointmentType: "Prenatal Clinic",
        findings: "Prenatal Check-up",
        remarks: "Regular check-up"
      }
    ]
  },
  {
    id: "PT-101",
    status: "Active",
    name: "Juan Dela Cruz",
    age: 45,
    dob: "January 15, 1981",
    gender: "Male",
    civilStatus: "Married",
    contact: "09171234567",
    email: "juan.delacruz@email.com",
    address: "Purok 1, Poblacion, Cityville",
    occupation: "Driver",
    philHealthNo: "12-987654321-0",
    avatar: null,
    overview: {
      lastVisited: "June 15, 2026",
      clinic: "NCD Clinic",
      dateLastVisited: "June 15, 2026",
      illnessCondition: "Hypertension Monitoring"
    },
    demographics: {
      height: "170 cm",
      weight: "72 kg",
      bloodType: "A+",
      allergies: "Penicillin",
      contactPerson: "Maria Dela Cruz (0917 000 1111)",
      emergencyContact: "Maria Dela Cruz (0917 000 1111)"
    },
    currentCondition: {
      condition: "Hypertension Stage 1",
      notes: "Blood pressure monitored regularly. Advised maintenance lifestyle changes and medication adherence."
    },
    appointments: [
      {
        id: "APT-101-1",
        patientId: "PT-101",
        name: "Juan Dela Cruz",
        service: "General Medical Consultation",
        clinic: "NCD Clinic",
        date: "2026-07-17",
        time: "09:00 AM",
        status: "Pending"
      }
    ],
    history: [
      {
        id: "REC-15101",
        date: "2026-03-12",
        appointmentType: "Senior NCD Program",
        findings: "Blood pressure monitored at 130/80. Advised to maintain low-sodium diet and continue maintenance medication.",
        remarks: "BP monitored"
      }
    ]
  },
  {
    id: "PT-102",
    status: "Active",
    name: "Maria Clara",
    age: 28,
    dob: "October 24, 1997",
    gender: "Female",
    civilStatus: "Single",
    contact: "09187654321",
    email: "maria.clara@email.com",
    address: "Purok 2, San Miguel, Cityville",
    occupation: "Teacher",
    philHealthNo: "12-555666777-1",
    avatar: null,
    overview: {
      lastVisited: "May 20, 2026",
      clinic: "Prenatal Clinic",
      dateLastVisited: "May 20, 2026",
      illnessCondition: "Prenatal Check-up"
    },
    demographics: {
      height: "162 cm",
      weight: "55 kg",
      bloodType: "B+",
      allergies: "NKA",
      contactPerson: "Lina Clara (0918 000 2222)",
      emergencyContact: "Lina Clara (0918 000 2222)"
    },
    currentCondition: {
      condition: "Prenatal Care",
      notes: "Second trimester routine progression looks healthy. Continue iron supplementation."
    },
    appointments: [
      {
        id: "APT-102-1",
        patientId: "PT-102",
        name: "Maria Clara",
        service: "Prenatal & Maternal Clinic",
        clinic: "Prenatal Clinic",
        date: "2026-07-17",
        time: "10:30 AM",
        status: "Approved"
      }
    ],
    history: [
      {
        id: "REC-15103",
        date: "2026-05-20",
        appointmentType: "Prenatal Program",
        findings: "Second trimester routine checkup. Fetal heart rate normal at 145 bpm. Prescribed prenatal iron supplements.",
        remarks: "Fetal heart rate normal"
      }
    ]
  },
  {
    id: "PT-103",
    status: "Active",
    name: "Jose Rizal",
    age: 8,
    dob: "August 20, 2017",
    gender: "Male",
    civilStatus: "Single",
    contact: "09192223333",
    email: "guardiansantos@email.com",
    address: "Purok 4, San Jose, Cityville",
    occupation: "Student",
    philHealthNo: "N/A (Dependent)",
    avatar: null,
    overview: {
      lastVisited: "July 10, 2026",
      clinic: "Pediatric Clinic",
      dateLastVisited: "July 10, 2026",
      illnessCondition: "Child Care & Immunization"
    },
    demographics: {
      height: "125 cm",
      weight: "24 kg",
      bloodType: "O+",
      allergies: "None",
      contactPerson: "Teodora Rizal (0919 222 3333)",
      emergencyContact: "Teodora Rizal (0919 222 3333)"
    },
    currentCondition: {
      condition: "Pediatric Wellness",
      notes: "Child is up to date with core immunizations. Normal growth metrics."
    },
    appointments: [
      {
        id: "APT-103-1",
        patientId: "PT-103",
        name: "Jose Rizal",
        service: "Child Care & Immunization",
        clinic: "Pediatric Clinic",
        date: "2026-07-18",
        time: "11:15 AM",
        status: "Pending"
      }
    ],
    history: [
      {
        id: "REC-15104",
        date: "2026-07-10",
        appointmentType: "Pediatric Immunization",
        findings: "Administered booster shots according to standard childhood immunization schedule. No adverse immediate reaction.",
        remarks: "Booster shots completed"
      }
    ]
  },
  {
    id: "PT-104",
    status: "Active",
    name: "Ana Gomez",
    age: 62,
    dob: "March 18, 1964",
    gender: "Female",
    civilStatus: "Widowed",
    contact: "09204445555",
    email: "ana.gomez@email.com",
    address: "Purok 5, Santa Clara, Cityville",
    occupation: "Retired",
    philHealthNo: "12-888999000-3",
    avatar: null,
    overview: {
      lastVisited: "June 28, 2026",
      clinic: "Senior Wellness Program",
      dateLastVisited: "June 28, 2026",
      illnessCondition: "NCD Care & Senior Wellness"
    },
    demographics: {
      height: "155 cm",
      weight: "60 kg",
      bloodType: "AB+",
      allergies: "Aspirin",
      contactPerson: "Carlos Gomez (0920 111 2222)",
      emergencyContact: "Carlos Gomez (0920 111 2222)"
    },
    currentCondition: {
      condition: "Type 2 Diabetes / Senior Care",
      notes: "Fasting blood sugar within targeted range. Maintenance medication refilled."
    },
    appointments: [
      {
        id: "APT-104-1",
        patientId: "PT-104",
        name: "Ana Gomez",
        service: "NCD Care & Senior Wellness",
        clinic: "Senior Wellness Program",
        date: "2026-07-19",
        time: "02:00 PM",
        status: "Approved"
      }
    ],
    history: [
      {
        id: "REC-15105",
        date: "2026-06-28",
        appointmentType: "Senior NCD Program",
        findings: "Routine glucose screening and BP check. Overall stability noted.",
        remarks: "Routine checkup stable"
      }
    ]
  }
];

// Automatically extract all appointments across all patients into one flat array
export const INITIAL_APPOINTMENTS = INITIAL_PATIENTS.flatMap(
  patient => patient.appointments || []
);