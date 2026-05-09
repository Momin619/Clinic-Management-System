export type AppointmentFormData = {
  // Patient info — submitted inline, backend creates Patient + Appointment together
  patientName: string;
  patientPhone: string;
  patientAge: number;

  // Appointment info
  doctorName: string;
  date: string;
  time: string; // native <input type="time"> value — converted to AM/PM before submit
  reason?: string;
  notes?: string;
};

export type AppointmentResult = {
  id: string;
  patient: {
    id: string;
    name: string;
    phone: string;
  };
  doctorName: string;
  date: string;
  time: string;
  reason?: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  whatsappLink: string;
  createdAt: string;
};
