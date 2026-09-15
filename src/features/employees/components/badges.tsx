import {
  Building2,
  ChartColumnIncreasing,
  Megaphone,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface DepartmentStyle {
  icon: LucideIcon;
  className: string;
}

const DEPARTMENT_STYLES: Record<string, DepartmentStyle> = {
  Engineering: { icon: Building2, className: "bg-primary-light text-primary" },
  Marketing: { icon: Megaphone, className: "bg-violet-50 text-violet-600" },
  Sales: {
    icon: ChartColumnIncreasing,
    className: "bg-success-light/60 text-emerald-700",
  },
  HR: { icon: UserRound, className: "bg-fuchsia-50 text-fuchsia-700" },
};

const FALLBACK_STYLE: DepartmentStyle = {
  icon: Building2,
  className: "bg-slate-100 text-slate-600",
};

export function DepartmentBadge({ department }: { department: string }) {
  const { icon: Icon, className } =
    DEPARTMENT_STYLES[department] ?? FALLBACK_STYLE;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {department}
    </span>
  );
}

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium",
        isActive
          ? "bg-success-light text-emerald-700"
          : "bg-slate-100 text-slate-600",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-success" : "bg-neutral",
        )}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
