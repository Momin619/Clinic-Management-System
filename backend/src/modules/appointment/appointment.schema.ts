// src/modules/appointment/appointment.schema.ts

import { z } from "zod";

/**
 * Schema for POST /appointments/new
 *
 * - notes field is intentionally omitted — staff pre-booking notes are not
 *   collected at creation time.
 * - time must follow "H:MM AM/PM" format (e.g. "9:30 AM", "12:00 PM").
 * - date must be a parseable date string.
 */
export const createAppointmentSchema = z.object({
  patientName: z.string().min(2).max(100).trim(),
  patientPhone: z.string().min(7).max(20).trim(),
  patientAge: z.coerce.number().int().min(1).max(120),
  doctorName: z.string().min(2).max(100).trim(),
  date: z
    .string()
    .min(1)
    .refine((val) => !isNaN(new Date(val).getTime()), "Invalid date"),
  time: z
    .string()
    .min(1)
    .regex(
      /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i,
      "Time must be in H:MM AM/PM format",
    ),
  reason: z.string().max(500).trim().optional(),
});

/**
 * Schema for PATCH /appointments/:id/status
 *
 * Rules:
 *  - status must be "completed" or "cancelled" (never "scheduled" — that is set at creation only).
 *  - cost is MANDATORY when status is "completed" — the clinic must record the fee.
 *  - completionNotes are OPTIONAL — the doctor may or may not leave notes.
 */
export const updateAppointmentStatusSchema = z
  .object({
    status: z.enum(["completed", "cancelled"], {
      error: "Status must be either 'completed' or 'cancelled'",
    }),
    completionNotes: z.string().max(2000).trim().optional(),
    // cost is optional at the field level so "cancelled" appointments
    // are not forced to send it — the .refine() below enforces it only
    // when status === "completed".
    cost: z.coerce.number().min(0, "Cost cannot be negative").optional(),
  })
  .refine(
    (data) => {
      // If the appointment is being marked completed, cost MUST be provided.
      if (data.status === "completed" && data.cost === undefined) return false;
      return true;
    },
    {
      message: "Cost is required when marking an appointment as completed",
      path: ["cost"],
    },
  );
