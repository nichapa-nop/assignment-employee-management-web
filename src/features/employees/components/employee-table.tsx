"use client";

import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDate, formatTimestampDate } from "@/lib/format";
import type { Employee, EmployeeSortField, SortOrder } from "../types";
import { DepartmentBadge, StatusBadge } from "./badges";

interface Column {
  field: EmployeeSortField;
  label: string;
}

const COLUMNS: Column[] = [
  { field: "id", label: "ID" },
  { field: "name", label: "Name" },
  { field: "department", label: "Department" },
  { field: "salary", label: "Salary" },
  { field: "joinDate", label: "Join Date" },
  { field: "isActive", label: "Status" },
  { field: "updatedAt", label: "Last Updated" },
];

interface EmployeeTableProps {
  employees: Employee[];
  sortBy: EmployeeSortField;
  sortOrder: SortOrder;
  isLoading: boolean;
  onSort: (field: EmployeeSortField) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

function SortIcon({ direction }: { direction?: SortOrder }) {
  return (
    <span aria-hidden="true" className="flex flex-col">
      <ChevronUp
        className={cn(
          "-mb-1 size-3",
          direction === "ASC" ? "text-slate-700" : "text-slate-300",
        )}
        strokeWidth={3}
      />
      <ChevronDown
        className={cn(
          "size-3",
          direction === "DESC" ? "text-slate-700" : "text-slate-300",
        )}
        strokeWidth={3}
      />
    </span>
  );
}

const CELL = "px-6 py-4 whitespace-nowrap";

export function EmployeeTable({
  employees,
  sortBy,
  sortOrder,
  isLoading,
  onSort,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-slate-100">
          <tr>
            {COLUMNS.map((column) => {
              const active = column.field === sortBy;
              return (
                <th
                  key={column.field}
                  scope="col"
                  aria-sort={
                    active
                      ? sortOrder === "ASC"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="px-6 py-4 text-left font-semibold whitespace-nowrap text-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.field)}
                    className="inline-flex items-center gap-2 rounded hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {column.label}
                    <SortIcon direction={active ? sortOrder : undefined} />
                  </button>
                </th>
              );
            })}
            <th scope="col" className="px-6 py-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody
          className={cn(
            "divide-y divide-slate-100 transition-opacity",
            isLoading && "opacity-60",
          )}
        >
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-slate-50/70">
              <td className={cn(CELL, "text-slate-600 tabular-nums")}>
                {employee.id}
              </td>
              <td className={cn(CELL, "font-semibold text-slate-900")}>
                {employee.name}
              </td>
              <td className={CELL}>
                <DepartmentBadge department={employee.department} />
              </td>
              <td className={cn(CELL, "font-medium text-slate-900")}>
                {formatCurrency(employee.salary)}
              </td>
              <td className={cn(CELL, "text-slate-600")}>
                {formatDate(employee.joinDate)}
              </td>
              <td className={CELL}>
                <StatusBadge isActive={employee.isActive} />
              </td>
              <td className={cn(CELL, "text-slate-600")}>
                {formatTimestampDate(employee.updatedAt)}
              </td>
              <td className={cn(CELL, "text-right")}>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(employee)}
                    aria-label={`Edit ${employee.name}`}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-slate-600 hover:bg-primary-light hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <Pencil aria-hidden="true" className="size-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(employee)}
                    aria-label={`Delete ${employee.name}`}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-slate-600 hover:bg-error-light hover:text-error focus-visible:outline-2 focus-visible:outline-error"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
