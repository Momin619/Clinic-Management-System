// src/modules/appointment/appointment.types.ts

/**
 * INPUT: shape of data accepted from the HTTP request body.
 * Patient data is accepted inline — the service creates the Patient document
 * first, then creates the Appointment referencing it. This way the clinic
 * admin fills one form instead of managing patient IDs manually.
 */
export interface IAppointmentInput {
  // ── Patient info (created on the fly) ──────────────────────────────────────
  patientName: string;
  patientPhone: string;
  patientAge: number;

  // ── Appointment info ────────────────────────────────────────────────────────
  doctorName: string;
  date: string; // ISO-8601 date string, e.g. "2025-06-15"
  time: string; // 12-hour format, e.g. "10:30 AM"
  reason?: string;
  notes?: string;
}

/**
 * PUBLIC: shape returned to the client in the API response.
 * Includes the generated WhatsApp confirmation link.
 */
export interface IAppointmentPublic {
  id: string;
  patient: {
    id: string;
    name: string;
    phone: string;
  };
  doctorName: string;
  date: string; // ISO-8601, always UTC
  time: string;
  reason?: string;
  status: AppointmentStatus;
  notes?: string;
  whatsappLink: string; // pre-filled wa.me deep-link for confirmation
  createdAt: string;
}

/** Lifecycle states of an appointment */
export type AppointmentStatus = "scheduled" | "completed" | "cancelled";
