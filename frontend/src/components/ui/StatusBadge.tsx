import type { AppointmentResult } from '../Appointment/Appointment/appointment'
import { cn } from '../../lib/utils';
const StatusBadge = ({ status }: { status: AppointmentResult["status"] }) =>
{
  const styles: Record<AppointmentResult["status"], string> = {
    scheduled:
      "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    completed:
      "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    cancelled:
      "bg-red-50 text-red-500 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  };

  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
        styles[status],
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge