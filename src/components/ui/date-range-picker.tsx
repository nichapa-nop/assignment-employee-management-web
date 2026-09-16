"use client";

import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker, type ChevronProps, type DateRange } from "react-day-picker";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

/** Calendar dates as `YYYY-MM-DD`; an empty string means "not set". */
export interface DateRangeValue {
  from: string;
  to: string;
}

interface DateRangePickerProps {
  id: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  placeholder?: string;
}

/** Parses `YYYY-MM-DD` as a local date so the calendar never shifts a day. */
function toDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateString(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

function CalendarChevron({ orientation, className }: ChevronProps) {
  const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
  return <Icon aria-hidden="true" className={cn("size-5", className)} />;
}

// Range band: middle days get a full-width tint, the ends get half a tint on
// the inner side, and the end days themselves are filled circles.
const CALENDAR_CLASS_NAMES = {
  root: "relative w-fit",
  months: "flex",
  month: "space-y-2",
  month_caption: "flex h-10 items-center justify-center",
  caption_label: "text-sm font-semibold text-slate-900",
  nav: "absolute inset-x-0 top-0 flex h-10 items-center justify-between",
  button_previous:
    "inline-flex size-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40",
  button_next:
    "inline-flex size-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40",
  month_grid: "border-collapse",
  weekdays: "",
  weekday: "size-10 text-xs font-semibold text-slate-500",
  week: "",
  day: "size-10 p-0 text-center",
  day_button:
    "mx-auto flex size-10 items-center justify-center rounded-full text-sm text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  today:
    "[&>button]:font-semibold [&>button]:ring-1 [&>button]:ring-primary/50",
  selected:
    "[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary-hover",
  range_middle:
    "bg-primary-light [&>button]:bg-transparent! [&>button]:text-primary! [&>button]:ring-0! [&>button]:hover:bg-primary/10!",
  range_start:
    "bg-linear-to-r from-transparent from-50% to-primary-light to-50%",
  range_end: "bg-linear-to-l from-transparent from-50% to-primary-light to-50%",
};

export function DateRangePicker({
  id,
  value,
  onChange,
  placeholder = "Select date range",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected: DateRange | undefined = value.from
    ? { from: toDate(value.from), to: toDate(value.to) }
    : undefined;
  const hasValue = Boolean(value.from || value.to);
  const isSingleDayRange = Boolean(
    selected?.from && selected.to && isSameDay(selected.from, selected.to),
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleSelect = (range: DateRange | undefined) => {
    const next = {
      from: toDateString(range?.from),
      to: toDateString(range?.to),
    };
    onChange(next);
    if (next.from && next.to) {
      close();
    }
  };

  const label =
    value.from && value.to
      ? `${formatDate(value.from)} – ${formatDate(value.to)}`
      : value.from
        ? `${formatDate(value.from)} – …`
        : "";

  return (
    <div
      ref={containerRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
        }
      }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-left text-sm focus:outline-2 focus:outline-offset-0 focus:outline-primary",
          hasValue ? "pr-10 text-slate-900" : "text-slate-400",
        )}
      >
        <CalendarDays
          aria-hidden="true"
          className="size-4 shrink-0 text-slate-500"
        />
        <span className="truncate">{label || placeholder}</span>
      </button>

      {hasValue && (
        <button
          type="button"
          onClick={() => onChange({ from: "", to: "" })}
          aria-label="Clear date range"
          className="absolute top-1/2 right-2.5 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Choose a date range"
          className="absolute left-0 z-30 mt-2 rounded-xl bg-white p-4 shadow-lg ring-1 ring-slate-200"
        >
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            resetOnSelect
            autoFocus
            weekStartsOn={1}
            defaultMonth={selected?.from}
            modifiers={{
              single_day_range: isSingleDayRange ? selected?.from : false,
            }}
            modifiersClassNames={{ single_day_range: "bg-none!" }}
            classNames={CALENDAR_CLASS_NAMES}
            components={{ Chevron: CalendarChevron }}
          />
          <p className="mt-2 text-center text-xs text-slate-500">
            {value.from && !value.to
              ? "Select an end date"
              : "Select a start date"}
          </p>
        </div>
      )}
    </div>
  );
}
