// src/modules/appointment/appointment.routes.ts

import express from "express";
import {
  createAppointment,
  updateAppointmentStatus,
  getAppointments,
} from "./appointment.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "./appointment.schema.js";

const appointmentRouter = express.Router();

// POST /api/appointments/new
appointmentRouter.post(
  "/new",
  protect,
  validate(createAppointmentSchema),
  createAppointment,
);

// PATCH /api/appointments/:id/status
appointmentRouter.patch(
  "/:id/status",
  protect,
  validate(updateAppointmentStatusSchema),
  updateAppointmentStatus,
);

appointmentRouter.get("/", protect, getAppointments);
export default appointmentRouter;
