// src/modules/appointment/appointment.controller.ts
//
// CONTROLLER LAYER — handles HTTP requests and responses ONLY.
// No business logic, no DB queries. Everything is delegated to the service.

import { Request, Response, NextFunction } from "express";
import { createAppointmentService } from "./appointment.service.js";
import { sendSuccess } from "../../utils/response-helper.js";
import { IAppointmentPublic } from "./appointment.types.js";

/**
 * POST /api/appointments
 *
 * Protected — requires a valid access token (enforced at the route level).
 * Validated — req.body is already validated and stripped by Zod middleware.
 *
 * On success: returns 201 with the created appointment + WhatsApp link.
 * On failure: forwards error to the global error handler via next(err).
 */
export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointment = await createAppointmentService(
      req.body,
      req.user!.id, // guaranteed by the `protect` middleware
    );

    return sendSuccess<{ appointment: IAppointmentPublic }>(
      res,
      { appointment },
      "Appointment created successfully",
      201,
    );
  } catch (err) {
    next(err);
  }
};
