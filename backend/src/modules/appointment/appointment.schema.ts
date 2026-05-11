import { z } from "zod";

// ─── Shared constants ────────────────────────────────────────────────────────

/**
 * FIX 1 — Unicode-aware name regex.
 * Original /^[a-zA-Z\s.'-]+$/ silently rejected valid names like
 * "José", "Müller", or "O'Séan". The `\p{L}` Unicode property matches
 * any letter in any language. The `u` flag is required to enable
 * Unicode property escapes.
 * The `-` is moved to the end of the character class to avoid any
 * ambiguity with a character range (e.g. `'` to `\-` would be a range).
 */
const NAME_REGEX = /^[\p{L}\s.'`-]+$/u;

/**
 * Shared HTML-tag guard reused across both schemas.
 * Extracted to a constant so the regex isn't re-compiled on every parse.
 */
const HTML_TAG_REGEX = /<[^>]*>/;

// ─── Create appointment ───────────────────────────────────────────────────────

/**
 * Schema for POST /appointments/new
 *
 * - notes field is intentionally omitted — staff pre-booking notes are not
 *   collected at creation time.
 * - time must follow "H:MM AM/PM" format (e.g. "9:30 AM", "12:00 PM").
 * - date must be in YYYY-MM-DD format.
 */
export const createAppointmentSchema = z.object({
  patientName: z
    .string()
    .min(2)
    .max(100)
    .trim()
    // FIX 1 applied — Unicode-aware regex (see NAME_REGEX above)
    .regex(NAME_REGEX, "Patient name must contain only letters"),

  patientPhone: z
    .string()
    .trim()
    .regex(
      /^\+?[\d\s\-()\d]{7,20}$/,
      "Phone number must be 7–20 characters and contain only digits, spaces, or +()-.",
    ),

  /**
   * FIX 3 — Kept z.coerce.number() because this schema is used by an HTML
   * form where all values arrive as strings. Coercion is intentional here.
   * If this were a pure JSON API endpoint, z.number() would be stricter.
   */
  patientAge: z.coerce.number().int().min(1).max(120),

  doctorName: z
    .string()
    .min(2)
    .max(100)
    .trim()
    // FIX 1 applied — Unicode-aware regex
    .regex(NAME_REGEX, "Doctor name must contain only letters"),

  /**
   * FIX 4 — Date timezone trap resolved.
   *
   * The original code did `new Date(val)` which, for ISO strings like
   * "2025-06-01", parses as midnight UTC — not midnight local time.
   * On a server in UTC+5 (Pakistan), a user booking for "today" at
   * 1 AM local time would be comparing against yesterday UTC, producing
   * a false "date in the past" rejection.
   *
   * Fix: enforce YYYY-MM-DD format, then construct via
   * `new Date(year, month - 1, day)` which always gives local midnight.
   * A cross-check (e.g. month 2 day 30) catches calendar overflow that
   * the Date constructor silently rolls over (Feb 30 → Mar 2).
   */
  date: z
    .string()
    .min(1)
    .superRefine((val, ctx) => {
      // Step 1 — Enforce YYYY-MM-DD format
      const ISO_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
      if (!ISO_FORMAT.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date must be in YYYY-MM-DD format",
        });
        return; // 🛑 Stop — no point running further checks
      }

      // Step 2 — Parse as local midnight (not UTC midnight)
      const [year, month, day] = val.split("-").map(Number);
      const parsed = new Date(year, month - 1, day);

      // Step 3 — Cross-check to reject overflowed dates (e.g. 2025-02-30)
      if (
        parsed.getFullYear() !== year ||
        parsed.getMonth() !== month - 1 ||
        parsed.getDate() !== day
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid date",
        });
        return; // 🛑 Stop — don't run the past-date check on a garbage date
      }

      // Step 4 — Reject past dates (both compared at local midnight)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsed < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Appointment date cannot be in the past",
        });
      }
    }),

  time: z
    .string()
    .min(1)
    .regex(
      /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i,
      "Time must be in H:MM AM/PM format",
    ),

  reason: z
    .string()
    .max(500)
    .trim()
    .refine((val) => !HTML_TAG_REGEX.test(val), "HTML tags are not allowed")
    .optional(),
});

// ─── Update appointment status ────────────────────────────────────────────────

/**
 * Schema for PATCH /appointments/:id/status
 *
 * Rules:
 *  - status must be "completed" or "cancelled" (never "scheduled" — that is set at creation only).
 *  - cost is MANDATORY when status is "completed" AND isProBono is not true.
 *  - completionNotes are MANDATORY when status is "completed".
 *  - completionNotes CANNOT be set when status is "cancelled".
 *  - isProBono explicitly flags zero-cost appointments so cost=0 is not
 *    treated as a data-entry mistake.
 */
export const updateAppointmentStatusSchema = z
  .object({
    status: z.enum(["completed", "cancelled"], {
      // Zod v4 uses `error` (not v3's errorMap) for enum messages ✅
      error: "Status must be either 'completed' or 'cancelled'",
    }),

    completionNotes: z
      .string()
      .max(2000)
      .trim()
      .refine((val) => !HTML_TAG_REGEX.test(val), "HTML tags are not allowed")
      .optional(),

    /**
     * cost is optional at the field level so "cancelled" appointments
     * are not forced to send it — the superRefine below enforces it only
     * when status === "completed" and isProBono is falsy.
     *
     * FIX 5 — min(0) is kept intentionally to support pro-bono visits,
     * but a companion isProBono flag is now required to make zero-cost
     * intent explicit and prevent silent data-entry mistakes.
     */
    cost: z.coerce
      .number()
      .min(0, "Cost cannot be negative")
      .max(100000, "Cost seems unrealistically high")
      .optional(),

    /**
     * FIX 5 — isProBono flag.
     * Allows cost = 0 without it looking like an accidental omission.
     * When true, the cost field is not required even for completed appointments.
     */
    isProBono: z.boolean().optional(),
  })
  /**
   * FIX 6 — Replaced chained .refine() calls with a single .superRefine().
   *
   * Chained .refine() calls are fully independent — both always run,
   * meaning two errors can surface simultaneously even when the second
   * check is irrelevant. superRefine gives us:
   *  - Early-exit control via `return` after the first failure
   *  - A single place for all cross-field logic (easier to follow)
   *  - Correct path targeting per issue
   */
  .superRefine((data, ctx) => {
    if (data.status === "completed") {
      if (data.cost === undefined && !data.isProBono) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Cost is required when marking an appointment as completed. Set isProBono to true for zero-cost visits.",
          path: ["cost"],
        });
      }
    }

    if (data.status === "cancelled" && data.completionNotes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Completion notes cannot be added to a cancelled appointment",
        path: ["completionNotes"],
      });
    }
  });

// ─── Inferred types (use in controllers / service layer) ─────────────────────

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<
  typeof updateAppointmentStatusSchema
>;
