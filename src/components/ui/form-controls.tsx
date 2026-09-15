import { ChevronDown, type LucideIcon } from "lucide-react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

const CONTROL_BASE =
  "block h-11 w-full rounded-lg border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 disabled:bg-slate-100 disabled:text-slate-500";

function controlClass(invalid: boolean, className?: string): string {
  return cn(
    CONTROL_BASE,
    invalid
      ? "border-error focus:outline-error"
      : "border-slate-200 focus:outline-primary",
    className,
  );
}

interface FieldProps {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/** Label, control and error message wired together for accessibility. */
export function Field({
  id,
  label,
  icon: Icon,
  error,
  hint,
  required,
  children,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium text-slate-700"
      >
        {Icon && <Icon aria-hidden="true" className="size-5 text-neutral" />}
        <span>
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </span>
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-neutral">{hint}</p>
      )}
    </div>
  );
}

interface ControlProps {
  invalid?: boolean;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, ControlProps {
  /** Icon or short text shown inside the input, before the value. */
  leading?: ReactNode;
}

export function Input({
  invalid = false,
  leading,
  className,
  id,
  ...props
}: InputProps) {
  const input = (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && id ? `${id}-error` : undefined}
      className={controlClass(invalid, cn(leading ? "pl-10" : undefined, className))}
      {...props}
    />
  );

  if (!leading) {
    return input;
  }

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-slate-400"
      >
        {leading}
      </span>
      {input}
    </div>
  );
}

export function Select({
  invalid = false,
  className,
  id,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & ControlProps) {
  return (
    <div className="relative">
      <select
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid && id ? `${id}-error` : undefined}
        className={controlClass(invalid, cn("appearance-none pr-10", className))}
        {...props}
      />
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}
