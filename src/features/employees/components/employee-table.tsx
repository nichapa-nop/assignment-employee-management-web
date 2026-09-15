"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatDate, formatSalary, formatTimestampDate } from "@/lib/format";
import type { Employee, EmployeeSortField, SortOrder } from "../types";

interface Column {
  field: EmployeeSortField;
  label: string;
  align?: "right";
}

const COLUMNS: Column[] = [
  { field: "id", label: "ID" },
  { field: "name", label: "Name" },
  { field: "department", label: "Department" },
  { field: "salary", label: "Salary", align: "right" },
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
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={cn("size-3", direction ? "text-slate-700" : "text-slate-300")}
    >
      <path
        d="M6 2 9 5H3z"
        fill="currentColor"
        opacity={direction === "DESC" ? 0.3 : 1}
      />
      <path
        d="M6 10 3 7h6z"
        fill="currentColor"
        opacity={direction === "ASC" ? 0.3 : 1}
      />
    </svg>
  );
}

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
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
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
                  className={cn(
                    "px-4 py-3 font-semibold whitespace-nowrap text-slate-600",
                    column.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.field)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600",
                      column.align === "right" && "flex-row-reverse",
                    )}
                  >
                    {column.label}
                    <SortIcon direction={active ? sortOrder : undefined} />
                  </button>
                </th>
              );
            })}
            <th scope="col" className="px-4 py-3 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody
          className={cn(
            "divide-y divide-slate-100 bg-white transition-opacity",
            isLoading && "opacity-60",
          )}
        >
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 whitespace-nowrap text-slate-500 tabular-nums">
                {employee.id}
              </td>
              <td className="px-4 py-3 font-medium whitespace-nowrap text-slate-900">
                {employee.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                {employee.department}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap text-slate-900 tabular-nums">
                {formatSalary(employee.salary)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-700 tabular-nums">
                {formatDate(employee.joinDate)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    employee.isActive
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                      : "bg-slate-100 text-slate-600 ring-1 ring-slate-500/20",
                  )}
                >
                  {employee.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-500 tabular-nums">
                {formatTimestampDate(employee.updatedAt)}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(employee)}
                    aria-label={`Edit ${employee.name}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(employee)}
                    aria-label={`Delete ${employee.name}`}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
