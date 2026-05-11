import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../../api/axios";
import type { AppointmentResult } from "../appointment";
import ScheduledAppointmentCard from "./ScheduledAppointmentCard";
import UpdateStatusModal from "./UpdateStatusModal";
import SkeletonCard from "../../ui/SkeletonCard";

export default function ScheduledAppointments()
{
  const [appointments, setAppointments] = useState<AppointmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AppointmentResult | null>(null);

  useEffect(() =>
  {
    const fetchAppointments = async () =>
    {
      try
      {
        const res = await api.get("/appointments/scheduled");
        setAppointments(res.data.result.appointments);
      } catch (err: any)
      {
        toast.error(err.response?.data?.message || "Failed to load appointments");
      } finally
      {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateSuccess = (updatedId: string) =>
  {
    setAppointments((prev) => prev.filter((a) => a.id !== updatedId));
    setSelected(null);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-neutral-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            All scheduled appointments. Completed and cancelled records appear in History.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="mb-4 text-5xl select-none">🗓️</span>
            <p className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
              No scheduled appointments
            </p>
            <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
              New bookings will appear here automatically.
            </p>
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <>
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
              {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} scheduled
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {appointments.map((appointment) => (
                <ScheduledAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onUpdateClick={setSelected}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selected && (
        <UpdateStatusModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}