import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../../api/axios";
import type { AppointmentResult } from "../appointment";
import CompletedAppointmentCard from "./CompletedAppointmentCard";
import SkeletonCard from "../../ui/SkeletonCard";

export default function CompletedAppointments()
{
  const [appointments, setAppointments] = useState<AppointmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() =>
  {
    const fetchCompleted = async () =>
    {
      try
      {
        const res = await api.get("/appointments/completed");
        setAppointments(res.data.result.appointments);
      } catch (err: any)
      {
        toast.error(
          err.response?.data?.message || "Failed to load completed appointments"
        );
      } finally
      {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, []);

  return (
    <div className="min-h-screen px-4 py-10 bg-neutral-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Completed Appointments
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            All finished appointments with billing details.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="mb-4 text-5xl">✅</span>
            <p className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
              No completed appointments
            </p>
            <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
              Completed records will appear here.
            </p>
          </div>
        )}

        {/* LIST */}
        {!loading && appointments.length > 0 && (
          <>
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
              {appointments.length} completed
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {appointments.map((appointment) => (
                <CompletedAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}