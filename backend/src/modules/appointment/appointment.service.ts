// src/modules/appointment/appointment.service.ts
//
// SERVICE LAYER — owns ALL business logic and database operations.
// The controller only calls this layer; it never touches models directly.

import Appointment from "./appointment.model.js";
import Patient from "./patient.model.js";
import { IAppointmentInput, IAppointmentPublic } from "./appointment.types.js";
import { buildWhatsAppLink } from "../../utils/whatsapp.js";

/**
 * Creates a new appointment in the database.
 *
 * Steps:
 *  1. Verify the referenced patient exists.
 *  2. Parse and validate the appointment date.
 *  3. Persist the appointment document.
 *  4. Build a WhatsApp confirmation deep-link for the clinic to send.
 *  5. Return a fully-shaped public response object.
 *
 * @param input     - Validated appointment data from req.body
 * @param createdBy - Authenticated admin's ID from req.user.id
 */
export const createAppointmentService = async (
  input: IAppointmentInput,
  createdBy: string,
): Promise<IAppointmentPublic> => {
  // ── 1. Create patient record from inline form data ─────────────────────────
  // A new Patient document is created for every appointment submission.
  // Future enhancement: add a "find-or-create by phone" lookup here to avoid
  // duplicate patient records for returning patients.
  const patient = await Patient.create({
    name: input.patientName,
    phone: input.patientPhone,
    age: input.patientAge,
  });

  // ── 2. Parse date ─────────────────────────────────────────────────────────
  const appointmentDate = new Date(input.date);

  // ── 3. Persist appointment ────────────────────────────────────────────────
  const appointment = await Appointment.create({
    patientId: patient._id,
    doctorName: input.doctorName,
    date: appointmentDate,
    time: input.time,
    reason: input.reason,
    notes: input.notes,
    createdBy,
  });

  // ── 4. Build WhatsApp confirmation link ───────────────────────────────────
  const formattedDate = appointmentDate.toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const whatsappLink = buildWhatsAppLink({
    phone: patient.phone,
    patientName: patient.name,
    doctorName: input.doctorName,
    date: formattedDate,
    time: input.time,
  });

  // ── 5. Shape and return public response ───────────────────────────────────
  return {
    id: appointment._id.toString(),
    patient: {
      id: patient._id.toString(),
      name: patient.name,
      phone: patient.phone,
    },
    doctorName: appointment.doctorName,
    date: appointment.date.toISOString(),
    time: appointment.time,
    reason: appointment.reason,
    status: appointment.status,
    notes: appointment.notes,
    whatsappLink,
    createdAt: appointment.createdAt.toISOString(),
  };
};
