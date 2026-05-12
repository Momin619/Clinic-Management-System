// src/components/appointment/AddAppointment.tsx

import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { api } from "../../../api/axios";
import { DatePicker, TimePicker } from "../../ui/CustomPickers";
import type { AppointmentFormData, AppointmentResult } from "../Appointment/appointment";
import LabelInputContainer from "../../ui/LabelInputContainer";
import { useAppNavigate } from '../../../hooks/useAppNavigate'
export default function AddAppointment()
{
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>();

  const { goTo } = useAppNavigate()

  const onSubmit = async (data: AppointmentFormData) =>
  {
    try
    {
      // TimePicker already outputs "H:MM AM/PM" — no conversion needed
      const res = await api.post("/appointments/new", data);
      console.log(res)
      const appointment: AppointmentResult = res.data.result.appointment;
      console.log(appointment.whatsappLink)
      window.open(appointment.whatsappLink, "_blank", "noopener,noreferrer");
      toast.success("Appointment Created Successfully");
      goTo('/appointments')
      reset();
    } catch (err: any)
    {
      console.log(err)
      toast.error(err.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <div className="w-full max-w-md px-8 py-10 mx-auto bg-white border shadow-lg rounded-2xl border-neutral-200 dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none">
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

        <div className="flex flex-col mb-4 space-y-4 md:flex-row md:space-x-3 md:space-y-0">
          <LabelInputContainer>
            <Label>Date</Label>
            <Controller
              name="date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick a date"
                  error={errors.date?.message}
                />
              )}
            />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label>Time</Label>
            <Controller
              name="time"
              control={control}
              rules={{ required: "Time is required" }}
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick a time"
                  error={errors.time?.message}
                />
              )}
            />
            {errors.time && <p className="text-xs text-red-500">{errors.time.message}</p>}
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="reason">
            Reason{" "}
            <span className="font-normal text-neutral-400 dark:text-neutral-500">(optional)</span>
          </Label>
          <Input
            id="reason"
            placeholder="e.g. Routine checkup"
            type="text"
            {...register("reason")}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="notes">
            Notes{" "}
            <span className="font-normal text-neutral-400 dark:text-neutral-500">(optional)</span>
          </Label>
          <Input
            id="notes"
            placeholder="Internal staff notes"
            type="text"
            {...register("notes")}
          />
        </LabelInputContainer>

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