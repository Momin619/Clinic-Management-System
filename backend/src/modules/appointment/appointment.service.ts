import Appointment from "./appointment.model.js";
import Patient from "./patient.model.js";
import {
  IAppointmentInput,
  IAppointmentPublic,
  IUpdateStatusInput,
} from "./appointment.types.js";
import { buildWhatsAppLink } from "../../utils/whatsapp.js";
import { AppError } from "../../errors/AppError.js";
import {
  toMinutes,
  formatDateForDisplay,
  fromMinutes,
} from "../../utils/time.js";
// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

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

export const getAppointmentsService = async ({
  status,
  search,
  page,
  limit,
}: {
  status: string;
  search: string;
  page: number;
  limit: number;
}) => {
  // ─────────────────────────────────────────────
  // 0. SAFETY (pagination protection)
  // ─────────────────────────────────────────────
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 50); // max 50 per page
  const skip = (safePage - 1) * safeLimit;

  // ─────────────────────────────────────────────
  // 1. BASE PIPELINE
  // ─────────────────────────────────────────────
  const pipeline: any[] = [];

  // ─────────────────────────────────────────────
  // 2. STATUS FILTER
  // ─────────────────────────────────────────────
  if (status && status !== "all") {
    pipeline.push({
      $match: {
        status,
      },
    });
  }

  // ─────────────────────────────────────────────
  // 3. JOIN PATIENT COLLECTION
  // ─────────────────────────────────────────────
  pipeline.push({
    $lookup: {
      from: "patients",
      localField: "patientId",
      foreignField: "_id",
      as: "patient",
    },
  });

  // convert array → object (safe)
  pipeline.push({
    $unwind: {
      path: "$patient",
      preserveNullAndEmptyArrays: false,
    },
  });

  // ─────────────────────────────────────────────
  // 4. SEARCH FILTER
  // ─────────────────────────────────────────────
  if (search && search.trim() !== "") {
    const isNumber = !isNaN(Number(search));

    pipeline.push({
      $match: {
        $or: [
          {
            doctorName: {
              $regex: search,
              $options: "i",
            },
          },
          {
            "patient.name": {
              $regex: search,
              $options: "i",
            },
          },
          {
            "patient.phone": {
              $regex: search,
              $options: "i",
            },
          },
          ...(isNumber
            ? [
                {
                  "patient.age": Number(search),
                },
              ]
            : []),
        ],
      },
    });
  }

  // ─────────────────────────────────────────────
  // 5. SORTING (latest first)
  // ─────────────────────────────────────────────
  pipeline.push({
    $sort: {
      createdAt: -1,
    },
  });

  // ─────────────────────────────────────────────
  // 6. PAGINATION + COUNT
  // ─────────────────────────────────────────────
  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: safeLimit }],
      totalCount: [{ $count: "count" }],
    },
  });

  // ─────────────────────────────────────────────
  // 7. EXECUTE
  // ─────────────────────────────────────────────
  const result = await Appointment.aggregate(pipeline);

  const appointments = result?.[0]?.data || [];
  const total = result?.[0]?.totalCount?.[0]?.count || 0;

  // ─────────────────────────────────────────────
  // 8. FORMAT RESPONSE
  // ─────────────────────────────────────────────
  return {
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },

    appointments: appointments.map((a: any) => ({
      id: a._id.toString(),

      patient: {
        id: a.patient._id.toString(),
        name: a.patient.name,
        phone: a.patient.phone,
        age: a.patient.age,
      },

      doctorName: a.doctorName,
      date: a.date,

      // ✅ FIX: convert minutes → readable time
      time: fromMinutes(a.time),

      status: a.status,
      cost: a.cost,
      completionNotes: a.completionNotes,
      createdAt: a.createdAt.toISOString(),
    })),
  };
};
