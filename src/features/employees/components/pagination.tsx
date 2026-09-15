"use client";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";
import { PAGE_SIZES } from "../lib/filters";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({
  meta,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const { page, limit, total, totalPages } = meta;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>
        Showing <span className="font-medium text-slate-900">{from}</span>–
        <span className="font-medium text-slate-900">{to}</span> of{" "}
        <span className="font-medium text-slate-900">{total}</span>
      </p>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <span>Rows</span>
          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm focus:outline-2 focus:outline-blue-600"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <span className="tabular-nums">
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </span>

        <div className="flex gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </nav>
  );
}
