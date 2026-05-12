// components/AppointmentSkeleton.tsx
import React from "react";

export const AppointmentSkeleton = () =>
{
  return (
    <div className="p-4 space-y-2 border rounded-lg animate-pulse">
      <div className="w-1/3 h-4 bg-gray-300 rounded dark:bg-zinc-700" />
      <div className="w-1/2 h-3 bg-gray-300 rounded dark:bg-zinc-700" />
      <div className="w-2/3 h-3 bg-gray-300 rounded dark:bg-zinc-700" />
    </div>
  );
};