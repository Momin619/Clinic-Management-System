import React from "react";

import type { Status } from './appointment'

type Props = {
  status: Status;
  onChange: (val: Status) => void;
};

export const AppointmentFilters: React.FC<Props> = ({ status, onChange }) =>
{
  const options: Status[] = ["all", "scheduled", "completed", "cancelled"];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`
            px-3 py-1 rounded-full text-sm border
            ${status === opt
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-zinc-900 text-black dark:text-white"
            }
          `}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};