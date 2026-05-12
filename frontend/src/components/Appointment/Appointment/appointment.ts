// src/components/appointment/appointment.ts

// ── Create Appointment ────────────────────────────────────────────────────────

export type AppointmentFormData = {
  patientName: string;
  patientPhone: string;
  patientAge: number;
  doctorName: string;
  date: string;
  time: string; // "H:MM AM/PM" format — TimePicker outputs this directly
  reason?: string;
  // notes removed — no longer collected at creation time
};

// ── Update Status ─────────────────────────────────────────────────────────────

export type UpdateStatusFormData = {
  status: "completed" | "cancelled";
  cost?: number; // mandatory when status === "completed" (enforced in form)
  completionNotes?: string; // optional — doctor's notes after visit
};

// ── API Response Shape ────────────────────────────────────────────────────────

export type AppointmentResult = {
  id: string;
  patient: {
    id: string;
    name: string;
    phone: string;
  };
  doctorName: string;
  date: string; // ISO string — format before display
  time: string; // "H:MM AM/PM"
  reason?: string;
  status: "scheduled" | "completed" | "cancelled";
  cost?: number; // present only on completed appointments
  completionNotes?: string; // present only on completed appointments
  whatsappLink: string;
  createdAt: string; // ISO string
};

export type Appointment = {
  id: string;
  patient: {
    name: string;
    phone: string;
  };
  doctorName: string;
  date: string;
  time: string;
  status: string;
};

export type Status = "all" | "scheduled" | "completed" | "cancelled";
