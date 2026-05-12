import { Request, Response, NextFunction } from "express";
import {
  createAppointmentService,
  getAppointmentsService,
  updateAppointmentStatusService,
} from "./appointment.service.js";
import { sendSuccess } from "../../utils/response-helper.js";
import { IAppointmentPublic, Params } from "./appointment.types.js";

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

export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status = "all", search = "", page = "1", limit = "10" } = req.query;

    const result = await getAppointmentsService({
      status: String(status),
      search: String(search).trim(),
      page: Number(page),
      limit: Number(limit),
    });

    return sendSuccess(res, result, "Appointments fetched successfully");
  } catch (err) {
    next(err);
  }
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
