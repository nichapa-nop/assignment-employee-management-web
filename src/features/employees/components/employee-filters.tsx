"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form-controls";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { hasActiveFilters } from "../lib/filters";
import type { EmployeeFilters, StatusFilter } from "../types";

const TYPING_DELAY_MS = 350;

type TextFilterKey = "search" | "salaryMin" | "salaryMax";

interface EmployeeFiltersProps {
  filters: EmployeeFilters;
  departments: string[];
  errors: string[];
  onChange: (changes: Partial<EmployeeFilters>) => void;
  onReset: () => void;
}

export function EmployeeFiltersPanel({
  filters,
  departments,
  errors,
  onChange,
  onReset,
}: EmployeeFiltersProps) {
  // Typed values are kept locally and pushed to the URL after a short pause.
  const [draft, setDraft] = useState<Record<TextFilterKey, string>>({
    search: filters.search,
    salaryMin: filters.salaryMin,
    salaryMax: filters.salaryMax,
  });

  // All typed fields are applied together, so switching fields within the
  // delay can't drop an edit that was still waiting to be applied.
  const applyDraft = useDebouncedCallback(
    (next: Record<TextFilterKey, string>) => onChange(next),
    TYPING_DELAY_MS,
  );

  const handleTextChange = (key: TextFilterKey, value: string) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    applyDraft.schedule(next);
  };

  const handleReset = () => {
    applyDraft.cancel();
    setDraft({ search: "", salaryMin: "", salaryMax: "" });
    onReset();
  };

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
              onChange={(event) => handleTextChange("search", event.target.value)}
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
              handleTextChange("salaryMin", event.target.value)
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
              handleTextChange("salaryMax", event.target.value)
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
          onClick={handleReset}
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
