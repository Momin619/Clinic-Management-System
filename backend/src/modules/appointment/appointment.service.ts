// src/modules/appointment/appointment.service.ts

import Appointment from "./appointment.model.js";
import Patient from "./patient.model.js";
import {
  IAppointmentInput,
  IAppointmentPublic,
  IUpdateStatusInput,
} from "./appointment.types.js";
import { buildWhatsAppLink } from "../../utils/whatsapp.js";
import { AppError } from "../../errors/AppError.js";
import { IPatient } from "./patient.model.js";
// ─── Time helpers ─────────────────────────────────────────────────────────────

/**
 * Converts a human-readable time string to minutes since midnight.
 * Example: "10:30 AM" → 630
 *
 * Why minutes? Storing a plain number makes conflict-checking simple —
 * we just compare two integers instead of parsing strings every time.
 */
const toMinutes = (time: string): number => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) throw new AppError(400, "INVALID_TIME", "Invalid time format");
  let h = Number(match[1]) % 12; // converts 12 → 0 so 12:xx AM works correctly
  if (match[3].toUpperCase() === "PM") h += 12;
  return h * 60 + Number(match[2]);
};

/**
 * Converts minutes since midnight back to a human-readable time string.
 * Example: 630 → "10:30 AM"
 *
 * Used when building the public response so the client always sees a
 * readable string, never a raw number.
 */
const fromMinutes = (mins: number): string => {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12; // 0 → 12 for 12:xx AM
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

// ─────────────────────────────────────────────────────────────────────────────

export const createAppointmentService = async (
  input: IAppointmentInput,
  createdBy: string,
): Promise<IAppointmentPublic> => {
  // ── Step 1: Create the patient record ─────────────────────────────────────
  //
  // We create the patient FIRST so we have their ID ready to attach to the
  // appointment. If anything fails after this, we clean up the patient record.
  const patient = await Patient.create({
    name: input.patientName,
    phone: input.patientPhone,
    age: input.patientAge,
  });

  // ── Step 2: Parse the date and convert time to minutes ────────────────────
  const appointmentDate = new Date(input.date);
  const timeMinutes = toMinutes(input.time);

  // ── Step 3: Check for scheduling conflict ─────────────────────────────────
  //
  // A conflict means: the SAME doctor already has a NON-cancelled appointment
  // on the EXACT same date at the EXACT same time (in minutes).
  //
  // Why exclude "cancelled"? A cancelled slot is free again — it should be
  // bookable by a new patient.
  const conflict = await Appointment.findOne({
    doctorName: input.doctorName,
    date: appointmentDate,
    time: timeMinutes,
    status: { $ne: "cancelled" }, // "$ne" means "not equal to"
  });

  if (conflict) {
    // Clean up the patient we just created so we don't leave orphan records.
    await Patient.findByIdAndDelete(patient._id);

    const conflictTime = fromMinutes(conflict.time);
    throw new AppError(
      409, // 409 Conflict — the resource state conflicts with the request
      "APPOINTMENT_CONFLICT",
      `${input.doctorName} already has an appointment at ${conflictTime} on this date. Please choose a different time.`,
    );
  }

  // ── Step 4: Persist the appointment ───────────────────────────────────────
  //
  // Note: `notes` (pre-booking staff notes) is intentionally NOT saved here.
  // That field has been removed from the creation flow.
  const appointment = await Appointment.create({
    patientId: patient._id,
    doctorName: input.doctorName,
    date: appointmentDate,
    time: timeMinutes,
    reason: input.reason,
    createdBy,
  });

  // ── Step 5: Build the WhatsApp confirmation link ──────────────────────────
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

  // ── Step 6: Return the public-safe response shape ─────────────────────────
  return {
    id: appointment._id.toString(),
    patient: {
      id: patient._id.toString(),
      name: patient.name,
      phone: patient.phone,
    },
    doctorName: appointment.doctorName,
    date: appointment.date.toISOString(),
    time: fromMinutes(appointment.time),
    reason: appointment.reason,
    status: appointment.status,
    whatsappLink,
    createdAt: appointment.createdAt.toISOString(),
  };
};

// ─────────────────────────────────────────────────────────────────────────────

export const updateAppointmentStatusService = async (
  appointmentId: string,
  input: IUpdateStatusInput,
): Promise<IAppointmentPublic> => {
  // ── Step 1: Find the appointment ──────────────────────────────────────────
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new AppError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found");
  }

  // ── Step 2: Guard against updating a closed appointment ───────────────────
  //
  // Once an appointment is "completed" or "cancelled", it cannot be changed.
  // Only "scheduled" appointments are open for status updates.
  if (appointment.status !== "scheduled") {
    throw new AppError(
      400,
      "INVALID_STATUS_TRANSITION",
      `Appointment is already ${appointment.status} and cannot be updated`,
    );
  }

  // ── Step 3: Apply the status update ───────────────────────────────────────
  //
  // If completing: attach cost (mandatory) and completionNotes (optional).
  // If cancelling: no extra fields needed.
  appointment.status = input.status;

  if (input.status === "completed") {
    appointment.cost = input.cost; // mandatory — validated by schema
    appointment.completionNotes = input.completionNotes; // optional — may be undefined
  }

  await appointment.save();

  // ── Step 4: Fetch the linked patient for the response ────────────────────
  const patient = await Patient.findById(appointment.patientId);

  if (!patient) {
    throw new AppError(
      404,
      "PATIENT_NOT_FOUND",
      "Patient record linked to this appointment was not found",
    );
  }

  // ── Step 5: Build WhatsApp link and return updated response ───────────────
  const whatsappLink = buildWhatsAppLink({
    phone: patient.phone,
    patientName: patient.name,
    doctorName: appointment.doctorName,
    date: appointment.date.toLocaleDateString("en-PK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: fromMinutes(appointment.time),
  });

  return {
    id: appointment._id.toString(),
    patient: {
      id: patient._id.toString(),
      name: patient.name,
      phone: patient.phone,
    },
    doctorName: appointment.doctorName,
    date: appointment.date.toISOString(),
    time: fromMinutes(appointment.time),
    reason: appointment.reason,
    status: appointment.status,
    cost: appointment.cost,
    completionNotes: appointment.completionNotes,
    whatsappLink,
    createdAt: appointment.createdAt.toISOString(),
  };
};

export const getScheduledAppointmentsService = async (): Promise<
  IAppointmentPublic[]
> => {
  // populate("patientId") replaces the raw ObjectId with the full patient document
  const appointments = await Appointment.find({ status: "scheduled" })
    .populate<{ patientId: IPatient }>("patientId")
    .sort({ date: 1, time: 1 }); // nearest date first

  return appointments.map((appointment) => {
    const patient = appointment.patientId; // now a full IPatient, not just an ID

    return {
      id: appointment._id.toString(),
      patient: {
        id: patient._id.toString(),
        name: patient.name,
        phone: patient.phone,
      },
      doctorName: appointment.doctorName,
      date: appointment.date.toISOString(),
      time: fromMinutes(appointment.time),
      reason: appointment.reason,
      status: appointment.status,
      whatsappLink: buildWhatsAppLink({
        phone: patient.phone,
        patientName: patient.name,
        doctorName: appointment.doctorName,
        date: appointment.date.toLocaleDateString("en-PK", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: fromMinutes(appointment.time),
      }),
      createdAt: appointment.createdAt.toISOString(),
    };
  });
};
