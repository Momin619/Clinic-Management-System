import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
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

appointmentRouter.patch(
  "/:id/status",
  protect,
  validate(updateAppointmentStatusSchema),
  updateAppointmentStatus,
);

// ⭐ NEW MAIN ROUTE (REPLACES ALL LIST ROUTES)
appointmentRouter.get("/", protect, getAppointments);
export default appointmentRouter;
