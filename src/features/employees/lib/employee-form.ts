import { formatSalary } from "@/lib/format";
import type { Employee, EmployeePayload } from "../types";

export const NAME_MAX_LENGTH = 100;
export const SALARY_MAX = 9_999_999_999.99;

/** Form state keeps salary as text so the user can type freely. */
export interface EmployeeFormValues {
  name: string;
  department: string;
  salary: string;
  joinDate: string;
  isActive: boolean;
}

export type EmployeeFormErrors = Partial<
  Record<keyof EmployeeFormValues, string>
>;

export const EMPTY_FORM_VALUES: EmployeeFormValues = {
  name: "",
  department: "",
  salary: "",
  joinDate: "",
  isActive: true,
};

export function toFormValues(employee: Employee): EmployeeFormValues {
  return {
    name: employee.name,
    department: employee.department,
    salary: formatSalary(employee.salary),
    joinDate: employee.joinDate,
    isActive: employee.isActive,
  };
}

/** Accepts "65000", "65,000" and "65,000.50"; returns null when invalid. */
export function parseSalary(value: string): number | null {
  const normalized = value.replace(/,/g, "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }
  return Number(normalized);
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/** Same rules as the API DTO, so most mistakes are caught before submitting. */
export function validateEmployeeForm(
  values: EmployeeFormValues,
  departments: string[],
): EmployeeFormErrors {
  const errors: EmployeeFormErrors = {};
  const name = values.name.trim();
  const salary = parseSalary(values.salary);

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Name must be at most ${NAME_MAX_LENGTH} characters.`;
  }

  if (!values.department) {
    errors.department = "Select a department.";
  } else if (departments.length > 0 && !departments.includes(values.department)) {
    errors.department = "Select a valid department.";
  }

  if (!values.salary.trim()) {
    errors.salary = "Salary is required.";
  } else if (salary === null) {
    errors.salary = "Enter a positive number with up to 2 decimal places.";
  } else if (salary > SALARY_MAX) {
    errors.salary = `Salary must not exceed ${formatSalary(SALARY_MAX)}.`;
  }

  if (!values.joinDate) {
    errors.joinDate = "Join date is required.";
  } else if (!isValidDate(values.joinDate)) {
    errors.joinDate = "Enter a valid date.";
  }

  return errors;
}

export function toPayload(values: EmployeeFormValues): EmployeePayload {
  return {
    name: values.name.trim(),
    department: values.department,
    salary: parseSalary(values.salary) ?? 0,
    joinDate: values.joinDate,
    isActive: values.isActive,
  };
}

/** Maps API validation messages (e.g. "salary must not be less than 0") to form fields. */
export function mapApiErrors(messages: string[]): {
  fieldErrors: EmployeeFormErrors;
  otherErrors: string[];
} {
  const fields: Array<keyof EmployeeFormValues> = [
    "name",
    "department",
    "salary",
    "joinDate",
    "isActive",
  ];
  const fieldErrors: EmployeeFormErrors = {};
  const otherErrors: string[] = [];

  messages.forEach((message) => {
    const field = fields.find((key) => message.startsWith(`${key} `));
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = message.charAt(0).toUpperCase() + message.slice(1);
    } else if (!field) {
      otherErrors.push(message);
    }
  });

  return { fieldErrors, otherErrors };
}
