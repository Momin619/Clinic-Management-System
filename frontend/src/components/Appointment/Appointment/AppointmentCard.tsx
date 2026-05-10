import type { AppointmentResult } from '../appointment'
import StatusBadge from './StatusBadge'
import { cn } from '../../../lib/utils'

interface AppointmentCardProps
{
  appointment: AppointmentResult;
  onUpdateClick: (a: AppointmentResult) => void;
}

const AppointmentCard = ({ appointment, onUpdateClick }: AppointmentCardProps) =>
{
  const formattedDate = new Date(appointment.date).toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 p-5 transition-shadow bg-white border shadow-sm dark:bg-zinc-950 border-neutral-200 dark:border-zinc-800 rounded-xl hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">{appointment.patient.name}</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{appointment.patient.phone}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <hr className="border-neutral-100 dark:border-zinc-800" />

      <div className="grid grid-cols-2 text-sm gap-y-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Doctor</p>
          <p className="mt-0.5 font-medium text-neutral-700 dark:text-neutral-300">{appointment.doctorName}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Date</p>
          <p className="mt-0.5 font-medium text-neutral-700 dark:text-neutral-300">{formattedDate}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Time</p>
          <p className="mt-0.5 font-medium text-neutral-700 dark:text-neutral-300">{appointment.time}</p>
        </div>
        {appointment.reason && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Reason</p>
            <p className="mt-0.5 font-medium text-neutral-700 dark:text-neutral-300 truncate" title={appointment.reason}>
              {appointment.reason}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => onUpdateClick(appointment)}
        className={cn(
          "mt-auto w-full h-9 rounded-lg text-sm font-medium transition",
          "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900",
          "hover:bg-neutral-700 dark:hover:bg-neutral-200",
        )}
      >
        Update Status
      </button>
    </div>
  );
};

export default AppointmentCard