import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { api } from "../../api/axios";
import type { AppointmentFormData, AppointmentResult } from "./appointment";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);

/** Converts native <input type="time"> 24h value ("14:30") → "2:30 PM" */
const to12Hour = (time24: string): string =>
{
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
};

export default function AddAppointment()
{
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>();

  const onSubmit = async (data: AppointmentFormData) =>
  {
    try
    {
      const res = await api.post("/appointments/new", {
        ...data,
        time: to12Hour(data.time),
      });

      const appointment: AppointmentResult = res.data.result.appointment;

      toast(
        (t) => (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-neutral-800">
              Appointment booked!
            </p>
            <a
              href={appointment.whatsappLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => toast.dismiss(t.id)}
              className="text-xs font-medium text-green-600 underline hover:text-green-700 underline-offset-2"
            >
              Send WhatsApp confirmation →
            </a>
          </div>
        ),
        { duration: 8000, icon: "✅" },
      );

      reset();
    } catch (err: any)
    {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <div
      className="w-full max-w-md px-8 py-10 mx-auto bg-white border shadow-lg rounded-2xl border-neutral-200 dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none"
    >
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        New Appointment
      </h2>
      <p className="max-w-sm mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        Enter patient details and appointment information to book
      </p>

      <form className="mt-6 mb-0" onSubmit={handleSubmit(onSubmit)}>

        {/* ── Patient Information ─────────────────────────────────────── */}
        <p className="mb-3 text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
          Patient Information
        </p>

        {/* Patient Name */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="patientName">Full Name</Label>
          <Input
            id="patientName"
            placeholder="Ali Raza"
            type="text"
            {...register("patientName", {
              required: "Patient name is required",
              minLength: { value: 2, message: "At least 2 characters" },
            })}
          />
          {errors.patientName && (
            <p className="text-xs text-red-500">{errors.patientName.message}</p>
          )}
        </LabelInputContainer>

        {/* Phone + Age — side by side */}
        <div className="flex flex-col mb-6 space-y-4 md:flex-row md:space-x-3 md:space-y-0">
          <LabelInputContainer>
            <Label htmlFor="patientPhone">Phone Number</Label>
            <Input
              id="patientPhone"
              placeholder="+92 300 1234567"
              type="tel"
              {...register("patientPhone", {
                required: "Phone number is required",
                minLength: { value: 7, message: "Enter a valid number" },
              })}
            />
            {errors.patientPhone && (
              <p className="text-xs text-red-500">{errors.patientPhone.message}</p>
            )}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="patientAge">Age</Label>
            <Input
              id="patientAge"
              placeholder="35"
              type="number"
              min={1}
              max={120}
              {...register("patientAge", {
                required: "Age is required",
                valueAsNumber: true,
                min: { value: 1, message: "Age must be at least 1" },
                max: { value: 120, message: "Enter a valid age" },
              })}
            />
            {errors.patientAge && (
              <p className="text-xs text-red-500">{errors.patientAge.message}</p>
            )}
          </LabelInputContainer>
        </div>

        {/* ── Appointment Details ─────────────────────────────────────── */}
        <p className="mb-3 text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
          Appointment Details
        </p>

        {/* Doctor Name */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Input
            id="doctorName"
            placeholder="Dr. Sara Ahmed"
            type="text"
            {...register("doctorName", {
              required: "Doctor name is required",
              minLength: { value: 2, message: "At least 2 characters" },
            })}
          />
          {errors.doctorName && (
            <p className="text-xs text-red-500">{errors.doctorName.message}</p>
          )}
        </LabelInputContainer>

        {/* Date + Time — side by side */}
        <div className="flex flex-col mb-4 space-y-4 md:flex-row md:space-x-3 md:space-y-0">
          <LabelInputContainer>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date", {
                required: "Date is required",
              })}
            />
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date.message}</p>
            )}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              {...register("time", {
                required: "Time is required",
              })}
            />
            {errors.time && (
              <p className="text-xs text-red-500">{errors.time.message}</p>
            )}
          </LabelInputContainer>
        </div>

        {/* Reason (optional) */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="reason">
            Reason{" "}
            <span className="font-normal text-neutral-400 dark:text-neutral-500">
              (optional)
            </span>
          </Label>
          <Input
            id="reason"
            placeholder="e.g. Routine checkup"
            type="text"
            {...register("reason")}
          />
        </LabelInputContainer>

        {/* Notes (optional) */}
        <LabelInputContainer className="mb-8">
          <Label htmlFor="notes">
            Notes{" "}
            <span className="font-normal text-neutral-400 dark:text-neutral-500">
              (optional)
            </span>
          </Label>
          <Input
            id="notes"
            placeholder="Internal staff notes"
            type="text"
            {...register("notes")}
          />
        </LabelInputContainer>

        {/* Submit */}
        <button
          disabled={isSubmitting}
          type="submit"
          className="relative block w-full h-10 font-medium text-white transition duration-300 rounded-md cursor-pointer bg-neutral-900 hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Booking..." : "Book Appointment →"}
        </button>

      </form>
    </div>
  );
}