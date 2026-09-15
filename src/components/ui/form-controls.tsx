import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

const CONTROL_BASE =
  "block h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 disabled:bg-slate-100 disabled:text-slate-500";

function controlClass(invalid: boolean, className?: string): string {
  return cn(
    CONTROL_BASE,
    invalid
      ? "border-red-400 focus:outline-red-500"
      : "border-slate-300 focus:outline-blue-600",
    className,
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/** Label, control and error message wired together for accessibility. */
export function Field({ id, label, error, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

interface ControlProps {
  invalid?: boolean;
}

export function Input({
  invalid = false,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & ControlProps) {
  return (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && id ? `${id}-error` : undefined}
      className={controlClass(invalid, className)}
      {...props}
    />
  );
}

export function Select({
  invalid = false,
  className,
  id,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & ControlProps) {
  return (
    <select
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && id ? `${id}-error` : undefined}
      className={controlClass(invalid, cn("pr-8", className))}
      {...props}
    />
  );
}
