import { apiRequest } from "@/lib/api-client";
import type { Paginated } from "@/types/api";
import type { Employee, EmployeePayload } from "../types";

export const employeesApi = {
  /** `query` is a URL query string without the leading "?". */
  list: (query: string) =>
    apiRequest<Paginated<Employee>>(`/employees${query ? `?${query}` : ""}`),

  create: (payload: EmployeePayload) =>
    apiRequest<Employee>("/employees", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: Partial<EmployeePayload>) =>
    apiRequest<Employee>(`/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id: number) =>
    apiRequest<void>(`/employees/${id}`, { method: "DELETE" }),

  departments: () => apiRequest<string[]>("/departments"),
};
