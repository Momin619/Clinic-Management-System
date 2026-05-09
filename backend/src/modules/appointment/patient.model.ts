// src/modules/appointment/patient.model.ts
//
// ── DESIGN DECISION ──────────────────────────────────────────────────────────
// Option A (Separate Patient Collection) was chosen over Option B (embedded).
//
// Reasons:
//  1. A patient can have MANY appointments over time. Embedding patient data
//     inside every appointment duplicates name/phone/email on every document.
//  2. A clinic needs to look up, search, and update a patient independently
//     of appointments (e.g. update a phone number once → all appointments
//     automatically reflect the new value via the ref).
//  3. Normalization enables future features: patient history, medical records,
//     billing — without schema migrations on the Appointment collection.
//
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Schema } from "mongoose";

export interface IPatient extends mongoose.Document {
  name: string;
  phone: string; // primary contact — used for WhatsApp confirmation link
  age: number;
  email?: string;
  gender?: "male" | "female" | "other";
}

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      // Store in international format, e.g. "+923001234567"
      // The WhatsApp utility will strip non-digits before building the link.
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  { timestamps: true },
);

const Patient = mongoose.model<IPatient>("Patient", patientSchema);

export default Patient;
