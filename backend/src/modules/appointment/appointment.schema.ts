// src/modules/appointment/appointment.schema.ts

import { z } from "zod";

/**
 * Zod schema for POST /api/appointments
 *
 * Accepts patient details inline alongside appointment data.
 * The service layer creates the Patient document first, then the Appointment.
 */
export const createAppointmentSchema = z.object({
  // ── Patient info ─────────────────────────────────────────────────────────
  patientName: z
    .string()
    .min(2, "Patient name must be at least 2 characters")
    .max(100, "Patient name must not exceed 100 characters")
    .trim(),

  patientPhone: z
    .string()
    .min(7, "Phone number is required")
    .max(20, "Phone number is too long")
    .trim(),

  // z.coerce.number() handles the HTML input string → number conversion
  patientAge: z.coerce
    .number({ error: "Age is required" })
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Please enter a valid age"),

  // ── Appointment info ──────────────────────────────────────────────────────
  doctorName: z
    .string()
    .min(2, "Doctor name must be at least 2 characters")
    .max(100, "Doctor name must not exceed 100 characters")
    .trim(),

  date: z
    .string()
    .min(1, "Appointment date is required")
    .refine(
      (val) => !isNaN(new Date(val).getTime()),
      "Invalid date — must be a valid ISO-8601 date string",
    ),

  time: z
    .string()
    .min(1, "Appointment time is required")
    .regex(
      /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i,
      "Time must be in HH:MM AM/PM format (e.g. 10:30 AM)",
    ),

  reason: z
    .string()
    .max(500, "Reason must not exceed 500 characters")
    .trim()
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .trim()
    .optional(),
});
