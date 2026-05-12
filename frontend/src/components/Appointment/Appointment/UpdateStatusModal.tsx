
import type { UpdateStatusFormData, AppointmentResult } from './appointment'
import { api } from "../../../api/axios";
import { useForm } from 'react-hook-form'
import { toast } from "react-hot-toast";
import LabelInputContainer from "../../ui/LabelInputContainer";
import { cn } from '../../../lib/utils';
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import type { Status } from './appointment';
interface UpdateStatusModalProps
{
  appointment: AppointmentResult;
  onClose: () => void;
  onSuccess: (id: string, status: Status) => void;
}
export const UpdateStatusModal = ({
  appointment,
  onClose,
  onSuccess,
}: UpdateStatusModalProps) =>
{
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStatusFormData>({
    defaultValues: { status: "completed" },
  });

  // Watch the status field so we can conditionally show cost + notes fields
  const selectedStatus = watch("status");

  const onSubmit = async (data: UpdateStatusFormData) =>
  {
    try
    {
      await api.patch(`/appointments/${appointment.id}/status`, data);
      toast.success(`Appointment marked as ${data.status}`);
      reset();
      onSuccess(appointment.id, data.status);
      handleClose();
      // removes the card from the list
    } catch (err: any)
    {
      toast.error(
        err.response?.data?.message || "Failed to update appointment status",
      );
    }
  };

  const handleClose = () =>
  {
    reset();
    onClose();
  };

  return (
    // Backdrop — clicking it closes the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-md bg-white border shadow-xl dark:bg-zinc-950 rounded-2xl border-neutral-200 dark:border-zinc-800">

        {/* ── Modal Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-neutral-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
              Update Status
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {appointment.patient.name}
              <span className="mx-1.5 text-neutral-300 dark:text-zinc-600">·</span>
              {appointment.doctorName}
              <span className="mx-1.5 text-neutral-300 dark:text-zinc-600">·</span>
              {appointment.time}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition text-lg leading-none mt-0.5"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ── Modal Form ─────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-5">

          {/* Status selector — styled radio buttons */}
          <LabelInputContainer>
            <Label>New Status</Label>
            <div className="flex gap-3 mt-1">
              {(["completed", "cancelled"] as const).map((s) =>
              {
                const isActive = selectedStatus === s;
                return (
                  <label
                    key={s}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border cursor-pointer text-sm font-medium transition select-none",
                      isActive
                        ? s === "completed"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-400"
                          : "border-red-400 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400"
                        : "border-neutral-200 dark:border-zinc-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-zinc-900",
                    )}
                  >
                    {/* Hidden radio — the label acts as the clickable area */}
                    <input
                      type="radio"
                      value={s}
                      className="sr-only"
                      {...register("status", { required: "Please select a status" })}
                    />
                    <span>{s === "completed" ? "✓ Completed" : "✕ Cancelled"}</span>
                  </label>
                );
              })}
            </div>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </LabelInputContainer>

          {/* ── Completion-only fields — shown only when status is "completed" ── */}
          {selectedStatus === "completed" && (
            <>
              <LabelInputContainer>
                <Label htmlFor="cost">
                  Consultation Cost (PKR)
                  <span className="ml-1.5 text-xs font-normal text-red-400">
                    required
                  </span>
                </Label>
                <Input
                  id="cost"
                  type="number"
                  min={0}
                  placeholder="e.g. 1500"
                  {...register("cost", {
                    required: "Cost is required when completing an appointment",
                    valueAsNumber: true,
                    min: { value: 0, message: "Cost cannot be negative" },
                  })}
                />
                {errors.cost && (
                  <p className="text-xs text-red-500">{errors.cost.message}</p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="completionNotes">
                  Doctor's Notes{" "}
                  <span className="font-normal text-neutral-400 dark:text-neutral-500">
                    (optional)
                  </span>
                </Label>
                <textarea
                  id="completionNotes"
                  rows={3}
                  placeholder="Diagnosis, prescription, follow-up instructions..."
                  className={cn(
                    "w-full rounded-md border border-neutral-200 dark:border-zinc-700",
                    "bg-white dark:bg-zinc-900 px-3 py-2 text-sm",
                    "text-neutral-800 dark:text-neutral-200",
                    "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                    "focus:outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-neutral-300",
                    "resize-none transition",
                  )}
                  {...register("completionNotes")}
                />
              </LabelInputContainer>
            </>
          )}

          {/* ── Modal Action Buttons ──────────────────────────────────── */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "flex-1 h-10 rounded-md border border-neutral-200 dark:border-zinc-700",
                "text-sm font-medium text-neutral-600 dark:text-neutral-300",
                "hover:bg-neutral-50 dark:hover:bg-zinc-900 transition",
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-1 h-10 rounded-md text-sm font-medium transition",
                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900",
                "hover:bg-neutral-700 dark:hover:bg-neutral-200",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {isSubmitting ? "Updating..." : "Confirm Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

