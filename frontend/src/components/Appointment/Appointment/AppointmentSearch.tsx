// components/AppointmentSearch.tsx
import React from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export const AppointmentSearch: React.FC<Props> = ({ value, onChange }) =>
{
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search patient, doctor, phone..."
      className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-lg  md:w-80 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};