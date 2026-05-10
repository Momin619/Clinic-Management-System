// src/components/ui/CustomPickers.tsx

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

// ─── Shared hook: close panel when clicking outside ───────────────────────────
function useClickOutside(ref: React.RefObject<HTMLElement>, cb: () => void)
{
  useEffect(() =>
  {
    const handler = (e: MouseEvent) =>
    {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE PICKER
// value / onChange contract: "YYYY-MM-DD" string
// ─────────────────────────────────────────────────────────────────────────────
interface DatePickerProps
{
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  error?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function DatePicker({ value, onChange, placeholder = "Select date", error }: DatePickerProps)
{
  const today = new Date();
  const parsed = value ? new Date(value + "T00:00:00") : null;

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth());
  const wrapRef = useRef<HTMLDivElement>(null!);
  useClickOutside(wrapRef, () => setOpen(false));

  const prevMonth = () =>
  {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () =>
  {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const select = (day: number) =>
  {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange?.(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const isSelected = (day: number) =>
    parsed &&
    parsed.getFullYear() === viewYear &&
    parsed.getMonth() === viewMonth &&
    parsed.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const displayValue = parsed
    ? parsed.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div ref={wrapRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md border transition-all duration-150",
          "bg-white dark:bg-zinc-900 text-neutral-800 dark:text-neutral-100",
          open
            ? "border-neutral-900 ring-2 ring-neutral-900/10 dark:border-white dark:ring-white/10"
            : "border-neutral-200 dark:border-zinc-700 hover:border-neutral-400 dark:hover:border-zinc-500",
          error && "border-red-400 dark:border-red-500",
        )}
      >
        <Calendar className="w-4 h-4 shrink-0 text-neutral-400" />
        <span className={cn("flex-1 text-left truncate", !displayValue && "text-neutral-400")}>
          {displayValue || placeholder}
        </span>
        <ChevronRight className={cn(
          "w-3.5 h-3.5 shrink-0 text-neutral-400 transition-transform duration-200",
          open && "rotate-90"
        )} />
      </button>

      {open && (
        <div className={cn(
          "absolute z-50 top-full mt-2 left-0 right-0 sm:right-auto sm:w-72",
          "p-4 rounded-xl border shadow-xl",
          "bg-white dark:bg-zinc-900 border-neutral-200 dark:border-zinc-700",
        )}>
          {/* Month / year header */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth}
              className="p-1 transition-colors rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-800">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth}
              className="p-1 transition-colors rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-800">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="pb-2 text-center text-[11px] font-medium text-neutral-400">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => (
              <div key={i} className="flex items-center justify-center">
                {day === null ? <span /> : (
                  <button
                    type="button"
                    onClick={() => select(day)}
                    className={cn(
                      "w-8 h-8 text-sm rounded-full transition-all duration-100 font-medium",
                      isSelected(day)
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : isToday(day)
                          ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white ring-1 ring-neutral-300 dark:ring-zinc-600"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800",
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TIME PICKER
// value / onChange contract: "H:MM AM/PM" string (e.g. "2:30 PM")
// ─────────────────────────────────────────────────────────────────────────────
interface TimePickerProps
{
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  error?: string;
}

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export function TimePicker({ value, onChange, placeholder = "Select time", error }: TimePickerProps)
{
  const [open, setOpen] = useState(false);
  const [selHour, setSelHour] = useState<number | null>(null);
  const [selMin, setSelMin] = useState<number | null>(null);
  const [selPeriod, setSelPeriod] = useState<"AM" | "PM">("AM");
  const wrapRef = useRef<HTMLDivElement>(null!);
  useClickOutside(wrapRef, () => setOpen(false));

  // Sync from controlled value — expects "H:MM AM/PM"
  useEffect(() =>
  {
    if (!value) return;
    const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return;
    setSelHour(Number(match[1]));
    setSelMin(Number(match[2]));
    setSelPeriod(match[3].toUpperCase() as "AM" | "PM");
  }, [value]);

  // Emit 12-hour string directly — no 24h roundtrip needed
  const emit = (h: number | null, m: number | null, p: "AM" | "PM") =>
  {
    if (h === null || m === null) return;
    onChange?.(`${h}:${String(m).padStart(2, "0")} ${p}`);
  };

  const pickHour = (h: number) => { setSelHour(h); emit(h, selMin, selPeriod); };
  const pickMin = (m: number) => { setSelMin(m); emit(selHour, m, selPeriod); };
  const pickPeriod = (p: "AM" | "PM") => { setSelPeriod(p); emit(selHour, selMin, p); };

  const displayValue = selHour !== null && selMin !== null
    ? `${selHour}:${String(selMin).padStart(2, "0")} ${selPeriod}`
    : "";

  return (
    <div ref={wrapRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md border transition-all duration-150",
          "bg-white dark:bg-zinc-900 text-neutral-800 dark:text-neutral-100",
          open
            ? "border-neutral-900 ring-2 ring-neutral-900/10 dark:border-white dark:ring-white/10"
            : "border-neutral-200 dark:border-zinc-700 hover:border-neutral-400 dark:hover:border-zinc-500",
          error && "border-red-400 dark:border-red-500",
        )}
      >
        <Clock className="w-4 h-4 shrink-0 text-neutral-400" />
        <span className={cn("flex-1 text-left", !displayValue && "text-neutral-400")}>
          {displayValue || placeholder}
        </span>
        <ChevronRight className={cn(
          "w-3.5 h-3.5 shrink-0 text-neutral-400 transition-transform duration-200",
          open && "rotate-90"
        )} />
      </button>

      {open && (
        <div className={cn(
          "absolute z-50 top-full mt-2 left-0 right-0 sm:right-auto sm:w-72",
          "p-4 rounded-xl border shadow-xl",
          "bg-white dark:bg-zinc-900 border-neutral-200 dark:border-zinc-700",
        )}>
          {/* AM / PM toggle */}
          <div className="flex gap-2 mb-4">
            {(["AM", "PM"] as const).map(p => (
              <button key={p} type="button" onClick={() => pickPeriod(p)}
                className={cn(
                  "flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-150",
                  selPeriod === p
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-zinc-700",
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {/* Hours */}
            <div className="flex-1">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-400">Hour</p>
              <div className="grid grid-cols-3 gap-1">
                {HOURS.map(h => (
                  <button key={h} type="button" onClick={() => pickHour(h)}
                    className={cn(
                      "py-1.5 text-sm rounded-md font-medium transition-all duration-100",
                      selHour === h
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800",
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="self-stretch w-px bg-neutral-100 dark:bg-zinc-800" />

            {/* Minutes */}
            <div className="flex-1">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-400">Min</p>
              <div className="grid grid-cols-3 gap-1">
                {MINUTES.map(m => (
                  <button key={m} type="button" onClick={() => pickMin(m)}
                    className={cn(
                      "py-1.5 text-sm rounded-md font-medium transition-all duration-100",
                      selMin === m
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800",
                    )}
                  >
                    {String(m).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live preview */}
          {displayValue && (
            <div className="flex items-center justify-between pt-3 mt-4 border-t border-neutral-100 dark:border-zinc-800">
              <span className="text-xs text-neutral-400">Selected</span>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{displayValue}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}