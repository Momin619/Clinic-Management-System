// src/modules/appointment/appointment.model.ts

import mongoose, { Schema, Types } from "mongoose";
import { AppointmentStatus } from "./appointment.types.js";

export interface IAppointment extends mongoose.Document {
  patientId: Types.ObjectId; // ref → Patient collection
  doctorName: string;
  date: Date;
  time: string; // stored as "HH:MM AM/PM" string (timezone-safe)
  reason?: string;
  status: AppointmentStatus;
  notes?: string;
  createdBy: Types.ObjectId; // ref → Admin — audit trail: who booked it
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema,
);

export default Appointment;
