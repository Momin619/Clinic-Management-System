// src/modules/appointment/appointment.controller.ts

import { Request, Response, NextFunction } from "express";
import {
  createAppointmentService,
  updateAppointmentStatusService,
  getScheduledAppointmentsService,
} from "./appointment.service.js";
import { sendSuccess } from "../../utils/response-helper.js";
import { IAppointmentPublic } from "./appointment.types.js";

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointment = await createAppointmentService(req.body, req.user!.id);

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

export const updateAppointmentStatus = async (
  req: Request<{ id: string }>, // ← fix: tell TypeScript the shape of params
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointment = await updateAppointmentStatusService(
      req.params.id, // now TypeScript knows this is always string ✓
      req.body,
    );

    return sendSuccess<{ appointment: IAppointmentPublic }>(
      res,
      { appointment },
      `Appointment marked as ${req.body.status}`,
      200,
    );
  } catch (err) {
    next(err);
  }
};

export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointments = await getScheduledAppointmentsService();
    return sendSuccess<{ appointments: IAppointmentPublic[] }>(
      res,
      { appointments },
      "Scheduled appointments fetched successfully",
      200,
    );
  } catch (err) {
    next(err);
  }
};
