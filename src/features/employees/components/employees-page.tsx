"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  useDepartments,
  useEmployees,
  useRefreshEmployees,
} from "../hooks/use-employees";
import { useEmployeeFilters } from "../hooks/use-employee-filters";
import { getFilterErrors, hasActiveFilters } from "../lib/filters";
import type { Employee, EmployeeSortField } from "../types";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";
import { EmployeeFiltersPanel } from "./employee-filters";
import { EmployeeFormModal } from "./employee-form-modal";
import { EmployeeTable } from "./employee-table";
import { Pagination } from "./pagination";
import { StatePanel, TableSkeleton } from "./table-states";

type FormState = { mode: "create" } | { mode: "edit"; employee: Employee };

export function EmployeesPage() {
  const { filters, updateFilters, resetFilters } = useEmployeeFilters();
  const filterErrors = getFilterErrors(filters);
  const employeesQuery = useEmployees(filters, filterErrors.length === 0);
  const departmentsQuery = useDepartments();
  const refreshEmployees = useRefreshEmployees();
  const toast = useToast();

  const [formState, setFormState] = useState<FormState | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );

  const departments = departmentsQuery.data ?? [];
  const { data, error, isValidating } = employeesQuery;

  const handleRetry = () => {
    void refreshEmployees();
    // Departments may have failed in the same outage; they don't revalidate on focus.
    if (departmentsQuery.error) {
      void departmentsQuery.mutate();
    }
  };

  const handleSort = (field: EmployeeSortField) => {
    const sortOrder =
      filters.sortBy === field && filters.sortOrder === "ASC" ? "DESC" : "ASC";
    updateFilters({ sortBy: field, sortOrder });
  };

  const handleSaved = (employee: Employee, mode: "created" | "updated") => {
    setFormState(null);
    void refreshEmployees();
    toast.success(
      mode === "created"
        ? `${employee.name} was added.`
        : `${employee.name} was updated.`,
    );
  };

  const handleDeleted = (employee: Employee) => {
    setEmployeeToDelete(null);
    // Step back a page when the last row on the current page was removed.
    if (data?.data.length === 1 && filters.page > 1) {
      updateFilters({ page: filters.page - 1 });
    }
    void refreshEmployees();
    toast.success(`${employee.name} was deleted.`);
  };

  const renderResults = () => {
    if (filterErrors.length > 0) {
      return (
        <StatePanel
          title="Check your filters"
          message="Fix the filter values above to see results."
        />
      );
    }

    if (error && !data) {
      return (
        <StatePanel
          tone="error"
          title="Could not load employees"
          message={error instanceof Error ? error.message : undefined}
          action={
            <Button variant="secondary" onClick={handleRetry}>
              Try again
            </Button>
          }
        />
      );
    }

    // With keepPreviousData, isLoading is true for a new filter combination even
    // though the previous page is still shown, so only show the skeleton when
    // there is nothing to display yet.
    if (!data) {
      return <TableSkeleton />;
    }

    if (data.data.length === 0) {
      const beyondLastPage = data.meta.total > 0;
      return (
        <StatePanel
          title={
            beyondLastPage
              ? "This page is empty"
              : hasActiveFilters(filters)
                ? "No employees match your filters"
                : "No employees yet"
          }
          message={
            beyondLastPage
              ? "There are fewer results than this page number."
              : hasActiveFilters(filters)
                ? "Try a different search or clear the filters."
                : "Add the first employee to get started."
          }
          action={
            beyondLastPage ? (
              <Button variant="secondary" onClick={() => updateFilters({ page: 1 })}>
                Go to first page
              </Button>
            ) : hasActiveFilters(filters) ? (
              <Button variant="secondary" onClick={resetFilters}>
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => setFormState({ mode: "create" })}>
                Add employee
              </Button>
            )
          }
        />
      );
    }

    return (
      <>
        <EmployeeTable
          employees={data.data}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          isLoading={isValidating}
          onSort={handleSort}
          onEdit={(employee) => setFormState({ mode: "edit", employee })}
          onDelete={setEmployeeToDelete}
        />
        <Pagination
          meta={data.meta}
          onPageChange={(page) => updateFilters({ page })}
          onLimitChange={(limit) => updateFilters({ limit })}
        />
      </>
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Employees
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter and manage employee records.
          </p>
        </div>
        <Button onClick={() => setFormState({ mode: "create" })}>
          <span aria-hidden="true" className="text-base leading-none">
            +
          </span>
          Add employee
        </Button>
      </header>

      <EmployeeFiltersPanel
        filters={filters}
        departments={departments}
        errors={filterErrors}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      <section
        aria-label="Employee list"
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        {renderResults()}
      </section>

      {formState && (
        <EmployeeFormModal
          employee={formState.mode === "edit" ? formState.employee : undefined}
          departments={departments}
          onClose={() => setFormState(null)}
          onSaved={handleSaved}
        />
      )}

      {employeeToDelete && (
        <DeleteEmployeeDialog
          employee={employeeToDelete}
          onClose={() => setEmployeeToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
