import {
  SORT_FIELDS,
  type EmployeeFilters,
  type EmployeeSortField,
  type SortOrder,
  type StatusFilter,
} from "../types";

export const PAGE_SIZES = [10, 20, 50] as const;

export const DEFAULT_FILTERS: EmployeeFilters = {
  search: "",
  department: "",
  isActive: "",
  joinDateFrom: "",
  joinDateTo: "",
  salaryMin: "",
  salaryMax: "",
  sortBy: "id",
  sortOrder: "ASC",
  page: 1,
  limit: PAGE_SIZES[0],
};

type Params = Pick<URLSearchParams, "get">;

function readSortBy(value: string | null): EmployeeSortField {
  return SORT_FIELDS.includes(value as EmployeeSortField)
    ? (value as EmployeeSortField)
    : DEFAULT_FILTERS.sortBy;
}

function readSortOrder(value: string | null): SortOrder {
  return value === "DESC" ? "DESC" : "ASC";
}

function readStatus(value: string | null): StatusFilter {
  return value === "true" || value === "false" ? value : "";
}

function readPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function readPageSize(value: string | null): number {
  const size = Number(value);
  return PAGE_SIZES.some((option) => option === size)
    ? size
    : DEFAULT_FILTERS.limit;
}

/** Reads filters from the URL, falling back to defaults for invalid values. */
export function parseFilters(params: Params): EmployeeFilters {
  return {
    search: params.get("search") ?? "",
    department: params.get("department") ?? "",
    isActive: readStatus(params.get("isActive")),
    joinDateFrom: params.get("joinDateFrom") ?? "",
    joinDateTo: params.get("joinDateTo") ?? "",
    salaryMin: params.get("salaryMin") ?? "",
    salaryMax: params.get("salaryMax") ?? "",
    sortBy: readSortBy(params.get("sortBy")),
    sortOrder: readSortOrder(params.get("sortOrder")),
    page: readPositiveInt(params.get("page"), DEFAULT_FILTERS.page),
    limit: readPageSize(params.get("limit")),
  };
}

/** Serializes filters, omitting empty and default values to keep URLs short. */
export function toQueryString(filters: EmployeeFilters): string {
  const params = new URLSearchParams();

  (Object.keys(filters) as Array<keyof EmployeeFilters>).forEach((key) => {
    const value = String(filters[key]).trim();
    if (value !== "" && value !== String(DEFAULT_FILTERS[key])) {
      params.set(key, value);
    }
  });

  return params.toString();
}

export function hasActiveFilters(filters: EmployeeFilters): boolean {
  return (
    [
      "search",
      "department",
      "isActive",
      "joinDateFrom",
      "joinDateTo",
      "salaryMin",
      "salaryMax",
    ] as const
  ).some((key) => filters[key] !== "");
}

const SALARY_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Mirrors the API's query validation so invalid filters never hit the server. */
export function getFilterErrors(filters: EmployeeFilters): string[] {
  const errors: string[] = [];
  const { salaryMin, salaryMax, joinDateFrom, joinDateTo } = filters;

  if (salaryMin && !SALARY_PATTERN.test(salaryMin)) {
    errors.push("Minimum salary must be a positive number.");
  }
  if (salaryMax && !SALARY_PATTERN.test(salaryMax)) {
    errors.push("Maximum salary must be a positive number.");
  }
  if (
    errors.length === 0 &&
    salaryMin &&
    salaryMax &&
    Number(salaryMin) > Number(salaryMax)
  ) {
    errors.push("Minimum salary must not be greater than maximum salary.");
  }
  if (joinDateFrom && joinDateTo && joinDateFrom > joinDateTo) {
    errors.push("Join date 'from' must be on or before 'to'.");
  }

  return errors;
}
