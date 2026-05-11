import { Request, Response, NextFunction } from "express";
import {
  createAppointmentService,
  updateAppointmentStatusService,
  getScheduledAppointmentsService,
  getCompletedAppointmentsService,
} from "./appointment.service.js";
import { sendSuccess } from "../../utils/response-helper.js";
import { IAppointmentPublic } from "./appointment.types.js";

// ─────────────────────────────────────────────
// CREATE APPOINTMENT
// ─────────────────────────────────────────────

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // ✅ no "!" needed if global typing is correct
    const appointment = await createAppointmentService(req.body, req.user.id);

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

// ─────────────────────────────────────────────
// UPDATE STATUS
// ─────────────────────────────────────────────

type Params = {
  id: string;
};

export const updateAppointmentStatus = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // safety check (extra protection)
    if (!id) {
      throw new Error("Invalid appointment id");
    }

    const appointment = await updateAppointmentStatusService(id, req.body);

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

// ─────────────────────────────────────────────
// GET APPOINTMENTS
// ─────────────────────────────────────────────

export const getScheduledAppointments = async (
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

export const getCompletedAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointments = await getCompletedAppointmentsService();

    return sendSuccess<{
      appointments: Omit<IAppointmentPublic, "whatsappLink">[];
    }>(
      res,
      { appointments },
      "Completed appointments fetched successfully",
      200,
    );
  } catch (err) {
    next(err);
  }
};
