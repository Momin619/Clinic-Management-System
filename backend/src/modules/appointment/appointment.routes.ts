import express from "express";
import {
  createAppointment,
  updateAppointmentStatus,
  getScheduledAppointments,
  getCompletedAppointments,
} from "./appointment.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "./appointment.schema.js";

const appointmentRouter = express.Router();

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────
appointmentRouter.post(
  "/new",
  protect,
  validate(createAppointmentSchema),
  createAppointment,
);

// ─────────────────────────────────────────────
// UPDATE STATUS
// ─────────────────────────────────────────────
appointmentRouter.patch(
  "/:id/status",
  protect,
  validate(updateAppointmentStatusSchema),
  updateAppointmentStatus,
);

// ─────────────────────────────────────────────
// GET SCHEDULED
// ─────────────────────────────────────────────
appointmentRouter.get("/scheduled", protect, getScheduledAppointments);

// ─────────────────────────────────────────────
// GET COMPLETED
// ─────────────────────────────────────────────
appointmentRouter.get("/completed", protect, getCompletedAppointments);

export default appointmentRouter;
