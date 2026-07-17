// mockPatients.js
export const INITIAL_PATIENTS = [
  {
    id: "PT-101",
    name: "Juan Dela Cruz",
    age: 45,
    gender: "Male",
    contact: "09171234567",
    history: [
      {
        id: "REC-15101",
        date: "2026-03-12",
        appointmentType: "Senior NCD Program", 
        findings: "Blood pressure monitored at 130/80. Advised to maintain low-sodium diet and continue maintenance medication."
      },
      {
        id: "REC-15102",
        date: "2026-06-15",
        appointmentType: "General Consultation",
        findings: "Routine physical examination. Patient reports occasional fatigue. Prescribed basic multivitamin routine."
      }
    ]
  },
  {
    id: "PT-102",
    name: "Maria Clara",
    age: 28,
    gender: "Female",
    contact: "09187654321",
    history: [
      {
        id: "REC-15103",
        date: "2026-05-20",
        appointmentType: "Prenatal Program",
        findings: "Second trimester routine checkup. Fetal heart rate normal at 145 bpm. Prescribed prenatal iron supplements."
      }
    ]
  },
  {
    id: "PT-103",
    name: "Mark Santos",
    age: 8,
    gender: "Male",
    contact: "09192223333",
    history: [
      {
        id: "REC-15104",
        date: "2026-07-10",
        appointmentType: "Pediatric Immunization",
        findings: "Administered booster shots according to the standard childhood immunization schedule. No adverse immediate reaction."
      }
    ]
  }
];