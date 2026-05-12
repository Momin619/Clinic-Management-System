import { AppError } from "../errors/AppError.js";
export const toMinutes = (time: string): number => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) throw new AppError(400, "INVALID_TIME", "Invalid time format");

  let h = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") h += 12;

  return h * 60 + Number(match[2]);
};

export const fromMinutes = (mins: number): string => {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;

  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

export const formatDateForDisplay = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);

  return new Date(y, m - 1, d).toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
