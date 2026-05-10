// src/modules/appointment/appointment.model.ts

import mongoose, { Schema, Types } from "mongoose";
import { AppointmentStatus } from "./appointment.types.js";

export interface IAppointment extends mongoose.Document {
  patientId: Types.ObjectId;
  doctorName: string;
  date: Date;
  time: number; // minutes since midnight — e.g. 10:30 AM → 630
  reason?: string;
  status: AppointmentStatus;
  cost?: number; // consultation fee — filled when marking "completed"
  completionNotes?: string; // doctor's notes — filled when marking "completed"
  createdBy: Types.ObjectId;
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
      type: Number,
      required: true,
      min: 0,
      max: 1439, // 23:59 in minutes = 1439
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
    cost: {
      type: Number,
      min: 0,
    },
    completionNotes: {
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
