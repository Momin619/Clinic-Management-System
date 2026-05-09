// src/modules/appointment/appointment.routes.ts
//
// ROUTES LAYER — defines endpoints, applies middleware, wires to controller.
// Middleware execution order: protect → validate → controller

import express from "express";
import { createAppointment } from "./appointment.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { createAppointmentSchema } from "./appointment.schema.js";

const appointmentRouter = express.Router();

/**
 * POST /api/appointments
 *
 * Middleware chain:
 *  1. `protect`  — verifies JWT access token; rejects unauthenticated requests
 *  2. `validate` — runs Zod schema; rejects malformed payloads before the
 *                  controller is ever reached (saves a DB round-trip on bad input)
 *  3. `createAppointment` — controller
 */
appointmentRouter.post(
  "/new",
  protect,
  validate(createAppointmentSchema),
  createAppointment,
);

export default appointmentRouter;
