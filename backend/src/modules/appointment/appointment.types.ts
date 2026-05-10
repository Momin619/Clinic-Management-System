// src/modules/appointment/appointment.types.ts

/**
 * INPUT: shape accepted by POST /appointments/new
 *
 * - notes is intentionally omitted — it was a pre-booking staff note field
 *   that is no longer collected at creation time.
 */
export interface IAppointmentInput {
  patientName: string;
  patientPhone: string;
  patientAge: number;
  doctorName: string;
  date: string;
  time: string; // e.g. "10:30 AM"
  reason?: string;
}

/**
 * INPUT: shape accepted by PATCH /appointments/:id/status
 *
 * - status is restricted to "completed" or "cancelled".
 *   "scheduled" is only ever set at creation — never via this route.
 * - cost is MANDATORY for "completed" (enforced by Zod schema + service layer).
 * - completionNotes are OPTIONAL — the doctor may leave notes or not.
 */
export interface IUpdateStatusInput {
  status: "completed" | "cancelled";
  completionNotes?: string;
  cost?: number; // required when status === "completed", validated in schema
}

/**
 * PUBLIC RESPONSE: shape returned to the client for any appointment response.
 *
 * - notes is omitted — it was removed from the creation flow.
 * - cost and completionNotes are optional here because they are only
 *   present after an appointment is marked "completed".
 */
export interface IAppointmentPublic {
  id: string;
  patient: {
    id: string;
    name: string;
    phone: string;
  };
  doctorName: string;
  date: string; // ISO string, e.g. "2025-08-15T00:00:00.000Z"
  time: string; // Human-readable, e.g. "10:30 AM"
  reason?: string;
  status: AppointmentStatus;
  cost?: number;
  completionNotes?: string;
  whatsappLink: string;
  createdAt: string; // ISO string
}

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";
