import Appointment from "./appointment.model.js";
import Patient from "./patient.model.js";
import {
  IAppointmentInput,
  IAppointmentPublic,
  IUpdateStatusInput,
} from "./appointment.types.js";
import { buildWhatsAppLink } from "../../utils/whatsapp.js";
import { AppError } from "../../errors/AppError.js";
import { IPatient } from "./patient.model.js";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const toMinutes = (time: string): number => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) throw new AppError(400, "INVALID_TIME", "Invalid time format");

  let h = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") h += 12;

  return h * 60 + Number(match[2]);
};

const fromMinutes = (mins: number): string => {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;

  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

const formatDateForDisplay = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);

  return new Date(y, m - 1, d).toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ─────────────────────────────────────────────
// CREATE APPOINTMENT
// ─────────────────────────────────────────────

export const createAppointmentService = async (
  input: IAppointmentInput,
  createdBy: string,
): Promise<IAppointmentPublic> => {
  const patient = await Patient.create({
    name: input.patientName,
    phone: input.patientPhone,
    age: input.patientAge,
  });

  const appointmentDate = input.date;
  const timeMinutes = toMinutes(input.time);

  const conflict = await Appointment.findOne({
    doctorName: input.doctorName,
    date: appointmentDate,
    time: timeMinutes,
    status: { $in: ["scheduled", "completed"] },
  });

  if (conflict) {
    await Patient.findByIdAndDelete(patient._id);

    throw new AppError(
      409,
      "APPOINTMENT_CONFLICT",
      "Doctor already has an appointment at this time",
    );
  }

  const appointment = await Appointment.create({
    patientId: patient._id,
    doctorName: input.doctorName,
    date: appointmentDate,
    time: timeMinutes,
    reason: input.reason,
    createdBy,
  });

  return {
    id: appointment._id.toString(),
    patient: {
      id: patient._id.toString(),
      name: patient.name,
      phone: patient.phone,
    },
    doctorName: appointment.doctorName,
    date: appointment.date,
    time: fromMinutes(appointment.time),
    reason: appointment.reason,
    status: appointment.status,
    whatsappLink: buildWhatsAppLink({
      phone: patient.phone,
      patientName: patient.name,
      doctorName: input.doctorName,
      date: formatDateForDisplay(appointmentDate),
      time: input.time,
    }),
    createdAt: appointment.createdAt.toISOString(),
  };
};

// ─────────────────────────────────────────────
// UPDATE STATUS
// ─────────────────────────────────────────────

export const updateAppointmentStatusService = async (
  appointmentId: string,
  input: IUpdateStatusInput,
): Promise<IAppointmentPublic> => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new AppError(404, "NOT_FOUND", "Appointment not found");
  }

  if (appointment.status !== "scheduled") {
    throw new AppError(400, "INVALID_STATUS", "Appointment already finalized");
  }

  appointment.status = input.status;

  if (input.status === "completed") {
    appointment.cost = input.cost;

    appointment.completionNotes = input.completionNotes?.trim()
      ? input.completionNotes
      : undefined;
  }

  await appointment.save();

  const patient = await Patient.findById(appointment.patientId);

  if (!patient) {
    throw new AppError(404, "PATIENT_NOT_FOUND", "Patient missing");
  }

  return {
    id: appointment._id.toString(),
    patient: {
      id: patient._id.toString(),
      name: patient.name,
      phone: patient.phone,
    },
    doctorName: appointment.doctorName,
    date: appointment.date,
    time: fromMinutes(appointment.time),
    reason: appointment.reason,
    status: appointment.status,
    cost: appointment.cost,
    completionNotes: appointment.completionNotes,
    whatsappLink: buildWhatsAppLink({
      phone: patient.phone,
      patientName: patient.name,
      doctorName: appointment.doctorName,
      date: formatDateForDisplay(appointment.date),
      time: fromMinutes(appointment.time),
    }),
    createdAt: appointment.createdAt.toISOString(),
  };
};

// ─────────────────────────────────────────────
// GET SCHEDULED APPOINTMENTS
// ─────────────────────────────────────────────

export const getScheduledAppointmentsService = async (): Promise<
  IAppointmentPublic[]
> => {
  const appointments = await Appointment.find({ status: "scheduled" })
    .populate("patientId")
    .sort({ date: 1, time: 1 });

  return appointments.map((appointment: any) => {
    const patient = appointment.patientId as IPatient;

    return {
      id: appointment._id.toString(),
      patient: {
        id: patient._id.toString(),
        name: patient.name,
        phone: patient.phone,
      },
      doctorName: appointment.doctorName,
      date: appointment.date,
      time: fromMinutes(appointment.time),
      reason: appointment.reason,
      status: appointment.status,
      whatsappLink: buildWhatsAppLink({
        phone: patient.phone,
        patientName: patient.name,
        doctorName: appointment.doctorName,
        date: formatDateForDisplay(appointment.date),
        time: fromMinutes(appointment.time),
      }),
      createdAt: appointment.createdAt.toISOString(),
    };
  });
};

export const getCompletedAppointmentsService = async () => {
  const appointments = await Appointment.find({ status: "completed" })
    .populate<{ patientId: IPatient }>("patientId")
    .sort({ updatedAt: -1 });

  return appointments.map((appointment) => {
    const patient = appointment.patientId;

    return {
      id: appointment._id.toString(),
      patient: {
        id: patient._id.toString(),
        name: patient.name,
        phone: patient.phone,
      },
      doctorName: appointment.doctorName,
      date: appointment.date,
      time: fromMinutes(appointment.time),
      reason: appointment.reason,
      status: appointment.status,
      cost: appointment.cost,
      completionNotes: appointment.completionNotes,
      createdAt: appointment.createdAt.toISOString(),
    };
  });
};
