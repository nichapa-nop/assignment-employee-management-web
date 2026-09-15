"use client";

import { useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { employeesApi } from "../api/employees.api";
import { toQueryString } from "../lib/filters";
import type { EmployeeFilters } from "../types";

const EMPLOYEES_KEY = "employees";

/** Fetches a page of employees; pass `enabled: false` to skip the request. */
export function useEmployees(filters: EmployeeFilters, enabled = true) {
  return useSWR(
    enabled ? [EMPLOYEES_KEY, toQueryString(filters)] : null,
    ([, query]) => employeesApi.list(query),
    { keepPreviousData: true },
  );
}

/** Revalidates every cached employee list (all filter combinations). */
export function useRefreshEmployees() {
  const { mutate } = useSWRConfig();

  return useCallback(
    () =>
      mutate((key) => Array.isArray(key) && key[0] === EMPLOYEES_KEY),
    [mutate],
  );
}

export function useDepartments() {
  return useSWR("departments", employeesApi.departments, {
    revalidateOnFocus: false,
  });
}
