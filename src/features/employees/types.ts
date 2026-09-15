export interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
  /** Calendar date, `YYYY-MM-DD`. */
  joinDate: string;
  isActive: boolean;
  createdAt: string;
  /** "Last Updated Date", stamped by the API. */
  updatedAt: string;
}

/** Fields the user can set; ID and Last Updated Date are system-generated. */
export interface EmployeePayload {
  name: string;
  department: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
}

export const SORT_FIELDS = [
  "id",
  "name",
  "department",
  "salary",
  "joinDate",
  "isActive",
  "updatedAt",
] as const;

export type EmployeeSortField = (typeof SORT_FIELDS)[number];

export type SortOrder = "ASC" | "DESC";

export type StatusFilter = "" | "true" | "false";

/** List state kept in the URL so it survives refreshes and can be shared. */
export interface EmployeeFilters {
  search: string;
  department: string;
  isActive: StatusFilter;
  joinDateFrom: string;
  joinDateTo: string;
  salaryMin: string;
  salaryMax: string;
  sortBy: EmployeeSortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}
