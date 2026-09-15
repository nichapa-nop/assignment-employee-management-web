import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const SKELETON_ROWS = 5;

export function TableSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading employees" className="p-4">
      <div className="mb-3 h-8 animate-pulse rounded bg-slate-100" />
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div
          key={index}
          className="mb-2 h-10 animate-pulse rounded bg-slate-50 last:mb-0"
        />
      ))}
    </div>
  );
}

interface StatePanelProps {
  title: string;
  message?: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
}

/** Centered message used for empty, error and invalid-filter states. */
export function StatePanel({
  title,
  message,
  action,
  tone = "neutral",
}: StatePanelProps) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center"
    >
      <p
        className={cn(
          "text-base font-semibold",
          tone === "error" ? "text-error" : "text-slate-900",
        )}
      >
        {title}
      </p>
      {message && <p className="max-w-md text-sm text-neutral">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
