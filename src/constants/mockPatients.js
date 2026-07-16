export const MOCK_PATIENTS = {
  "PT-101": {
    name: "Juan Dela Cruz",
    activeAppointment: {
      date: "July 20, 2026",
      time: "9:00 AM",
      service: "General Consultation",
      status: "Approved"
    },
    history: [
      { id: 1, date: "June 15, 2026", service: "Dental Checkup", doctor: "Dr. Reyes" },
      { id: 2, date: "May 10, 2026", service: "Flu Vaccination", doctor: "Nurse Sarah" }
    ]
  },
  "PT-102": {
    name: "Maria Santos",
    activeAppointment: {
      date: "July 22, 2026",
      time: "2:30 PM",
      service: "Prenatal Checkup",
      status: "Pending"
    },
    history: [
      { id: 1, date: "April 05, 2026", service: "General Consultation", doctor: "Dr. Alcantara" }
    ]
  }
};