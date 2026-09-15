"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DEFAULT_FILTERS, parseFilters, toQueryString } from "../lib/filters";
import type { EmployeeFilters } from "../types";

/** Reads and updates the list filters stored in the URL query string. */
export function useEmployeeFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const replaceFilters = useCallback(
    (next: EmployeeFilters) => {
      const query = toQueryString(next);
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  /** Any change other than the page itself returns to the first page. */
  const updateFilters = useCallback(
    (changes: Partial<EmployeeFilters>) => {
      replaceFilters({
        ...filters,
        ...changes,
        page: changes.page ?? DEFAULT_FILTERS.page,
      });
    },
    [filters, replaceFilters],
  );

  /** Clears search and filters but keeps sorting and page size. */
  const resetFilters = useCallback(() => {
    replaceFilters({
      ...DEFAULT_FILTERS,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      limit: filters.limit,
    });
  }, [filters, replaceFilters]);

  return { filters, updateFilters, resetFilters };
}
