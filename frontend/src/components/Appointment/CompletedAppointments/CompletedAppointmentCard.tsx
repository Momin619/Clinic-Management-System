import type { AppointmentResult } from "../appointment";
import StatusBadge from "../../ui/StatusBadge";

interface Props
{
  appointment: AppointmentResult;
}

const CompletedAppointmentCard = ({ appointment }: Props) =>
{
  const formattedDate = new Date(appointment.date).toLocaleDateString(
    "en-PK",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div className="flex flex-col gap-4 p-5 transition-shadow bg-white border shadow-sm dark:bg-zinc-950 border-neutral-200 dark:border-zinc-800 rounded-xl hover:shadow-md">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
            {appointment.patient.name}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {appointment.patient.phone}
          </p>
        </div>

        <StatusBadge status={appointment.status} />
      </div>

      <hr className="border-neutral-100 dark:border-zinc-800" />

      {/* DETAILS */}
      <div className="grid grid-cols-2 text-sm gap-y-3">
        <div>
          <p className="text-[11px] uppercase text-neutral-400">Doctor</p>
          <p className="font-medium">{appointment.doctorName}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase text-neutral-400">Date</p>
          <p className="font-medium">{formattedDate}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase text-neutral-400">Time</p>
          <p className="font-medium">{appointment.time}</p>
        </div>

        {appointment.cost !== undefined && (
          <div>
            <p className="text-[11px] uppercase text-neutral-400">Cost</p>
            <p className="font-medium text-emerald-600">
              PKR {appointment.cost}
            </p>
          </div>
        )}
      </div>

      {/* NOTES */}
      {appointment.completionNotes && (
        <div className="pt-2">
          <p className="text-[11px] uppercase text-neutral-400">
            Notes
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {appointment.completionNotes}
          </p>
        </div>
      )}
    </div>
  );
};

export default CompletedAppointmentCard;