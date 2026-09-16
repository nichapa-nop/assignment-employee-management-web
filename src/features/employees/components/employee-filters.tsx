"use client";

import {
  Building2,
  CalendarDays,
  Database,
  RotateCcw,
  Search,
  UserCheck,
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Field, Input, Select } from "@/components/ui/form-controls";
import type { FilterDraft, TextFilterKey } from "../hooks/use-filter-draft";
import { hasActiveFilters } from "../lib/filters";
import type { EmployeeFilters, StatusFilter } from "../types";

interface EmployeeFiltersProps {
  filters: EmployeeFilters;
  /** Typed values (search, salary range) that are applied after a short pause. */
  draft: FilterDraft;
  departments: string[];
  errors: string[];
  onChange: (changes: Partial<EmployeeFilters>) => void;
  onDraftChange: (key: TextFilterKey, value: string) => void;
  onReset: () => void;
}

export function EmployeeFiltersPanel({
  filters,
  draft,
  departments,
  errors,
  onChange,
  onDraftChange,
  onReset,
}: EmployeeFiltersProps) {
  return (
    <section
      aria-label="Search and filters"
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 sm:p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="sm:col-span-2">
          <Field id="filter-search" label="Search" icon={Search}>
            <Input
              id="filter-search"
              type="search"
              leading={<Search className="size-4" />}
              placeholder="Name or ID"
              value={draft.search}
              onChange={(event) => onDraftChange("search", event.target.value)}
            />
          </Field>
        </div>

        <Field id="filter-department" label="Department" icon={Building2}>
          <Select
            id="filter-department"
            value={filters.department}
            onChange={(event) => onChange({ department: event.target.value })}
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="filter-status" label="Status" icon={UserCheck}>
          <Select
            id="filter-status"
            value={filters.isActive}
            onChange={(event) =>
              onChange({ isActive: event.target.value as StatusFilter })
            }
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </Field>

        <div className="sm:col-span-2">
          <Field id="filter-join-date" label="Join date" icon={CalendarDays}>
            <DateRangePicker
              id="filter-join-date"
              value={{ from: filters.joinDateFrom, to: filters.joinDateTo }}
              onChange={({ from, to }) =>
                onChange({ joinDateFrom: from, joinDateTo: to })
              }
            />
          </Field>
        </div>

        <Field id="filter-salary-min" label="Min salary" icon={Database}>
          <Input
            id="filter-salary-min"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={draft.salaryMin}
            onChange={(event) => onDraftChange("salaryMin", event.target.value)}
          />
        </Field>

        <Field id="filter-salary-max" label="Max salary" icon={Database}>
          <Input
            id="filter-salary-max"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="Any"
            value={draft.salaryMax}
            onChange={(event) => onDraftChange("salaryMax", event.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="alert" className="text-sm text-red-600">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={
            !hasActiveFilters(filters) && !Object.values(draft).some(Boolean)
          }
          className="inline-flex items-center gap-1.5 self-end rounded-md px-2 py-1 text-sm text-neutral hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Clear filters
        </button>
      </div>
    </section>
  );
}
