// components/AppointmentCard.tsx
import React from "react";
import type { Appointment } from "./appointment";

import { FiPhone, FiCalendar, FiClock, FiUser } from "react-icons/fi";

type Props = {
  data: Appointment;
  onUpdate: () => void
};

const statusStyles: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export const AppointmentCard: React.FC<Props> = ({ data, onUpdate }) =>
{
  return (
    <div
      className="relative p-5 transition-all duration-300 bg-white border border-gray-200 shadow-sm group rounded-2xl dark:bg-zinc-900 dark:border-zinc-800 hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/30"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FiUser className="text-gray-500 dark:text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {data.patient.name}
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {data.doctorName}
          </p>
        </div>

        {/* STATUS BADGE */}
        <span
          className={`
            px-3 py-1 text-xs font-medium rounded-full border
            ${statusStyles[data.status] || "bg-gray-500/10 text-gray-500"}
          `}
        >
          {data.status}
        </span>
      </div>

      {/* DIVIDER */}
      <div className="my-4 border-t border-gray-100 dark:border-zinc-800" />

      {/* DETAILS */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <FiCalendar className="text-gray-400" />
          <span>{data.date}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <FiClock className="text-gray-400" />
          <span>{data.time}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <FiPhone className="text-gray-400" />
          <span>{data.patient.phone}</span>
        </div>
      </div>
      <button
        onClick={onUpdate}
        className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Update Status
      </button>
      {/* HOVER GLOW EFFECT */}
      <div
        className="absolute inset-0 transition opacity-0 pointer-events-none rounded-2xl group-hover:opacity-100 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
      />
    </div>
  );
};