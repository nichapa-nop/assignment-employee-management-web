"use client";

import { Button } from "@/components/ui/button";
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
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Field id="filter-search" label="Search">
            <Input
              id="filter-search"
              type="search"
              placeholder="Name or ID"
              value={draft.search}
              onChange={(event) => onDraftChange("search", event.target.value)}
            />
          </Field>
        </div>

        <Field id="filter-department" label="Department">
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

        <Field id="filter-status" label="Status">
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

        <Field id="filter-join-from" label="Joined from">
          <Input
            id="filter-join-from"
            type="date"
            value={filters.joinDateFrom}
            max={filters.joinDateTo || undefined}
            onChange={(event) => onChange({ joinDateFrom: event.target.value })}
          />
        </Field>

        <Field id="filter-join-to" label="Joined to">
          <Input
            id="filter-join-to"
            type="date"
            value={filters.joinDateTo}
            min={filters.joinDateFrom || undefined}
            onChange={(event) => onChange({ joinDateTo: event.target.value })}
          />
        </Field>

        <Field id="filter-salary-min" label="Min salary">
          <Input
            id="filter-salary-min"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={draft.salaryMin}
            onChange={(event) =>
              onDraftChange("salaryMin", event.target.value)
            }
          />
        </Field>

        <Field id="filter-salary-max" label="Max salary">
          <Input
            id="filter-salary-max"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="Any"
            value={draft.salaryMax}
            onChange={(event) =>
              onDraftChange("salaryMax", event.target.value)
            }
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="alert" className="text-sm text-red-600">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={
            !hasActiveFilters(filters) && !Object.values(draft).some(Boolean)
          }
          className="self-end"
        >
          Clear filters
        </Button>
      </div>
    </section>
  );
}
