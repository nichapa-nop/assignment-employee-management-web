"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form-controls";
import { Modal } from "@/components/ui/modal";
import { ApiError } from "@/lib/api-client";
import {
  CURRENCY_SYMBOL,
  formatSalary,
  formatTimestampDate,
} from "@/lib/format";
import { employeesApi } from "../api/employees.api";
import {
  EMPTY_FORM_VALUES,
  NAME_MAX_LENGTH,
  mapApiErrors,
  parseSalary,
  toFormValues,
  toPayload,
  validateEmployeeForm,
  type EmployeeFormErrors,
  type EmployeeFormValues,
} from "../lib/employee-form";
import type { Employee } from "../types";

interface EmployeeFormModalProps {
  /** The employee to edit, or undefined to create a new one. */
  employee?: Employee;
  departments: string[];
  onClose: () => void;
  onSaved: (employee: Employee, mode: "created" | "updated") => void;
}

export function EmployeeFormModal({
  employee,
  departments,
  onClose,
  onSaved,
}: EmployeeFormModalProps) {
  const isEdit = employee !== undefined;
  const [values, setValues] = useState<EmployeeFormValues>(() =>
    employee ? toFormValues(employee) : EMPTY_FORM_VALUES,
  );
  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = <K extends keyof EmployeeFormValues>(
    key: K,
    value: EmployeeFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSalaryBlur = () => {
    const salary = parseSalary(values.salary);
    if (salary !== null) {
      setValue("salary", formatSalary(salary));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validateEmployeeForm(values, departments);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = toPayload(values);
      const saved = isEdit
        ? await employeesApi.update(employee.id, payload)
        : await employeesApi.create(payload);
      onSaved(saved, isEdit ? "updated" : "created");
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const { fieldErrors, otherErrors } = mapApiErrors(error.messages);
        setErrors(fieldErrors);
        setFormError(otherErrors.join(" ") || null);
      } else {
        setFormError(
          error instanceof ApiError
            ? error.messages.join(" ")
            : "Something went wrong. Please try again.",
        );
      }
      setIsSubmitting(false);
    }
  };

  const close = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit employee" : "Add employee"}
      description={
        isEdit
          ? `ID ${employee.id} · Last updated ${formatTimestampDate(employee.updatedAt)}`
          : "ID and Last Updated Date are generated automatically."
      }
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="employee-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add employee"}
          </Button>
        </>
      }
    >
      <form
        id="employee-form"
        noValidate
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {formError && (
          <p
            role="alert"
            className="rounded-lg bg-error-light px-3 py-2 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        <Field id="employee-name" label="Name" error={errors.name} required>
          <Input
            id="employee-name"
            data-autofocus
            maxLength={NAME_MAX_LENGTH}
            value={values.name}
            invalid={Boolean(errors.name)}
            onChange={(event) => setValue("name", event.target.value)}
          />
        </Field>

        <Field
          id="employee-department"
          label="Department"
          error={errors.department}
          required
        >
          <Select
            id="employee-department"
            value={values.department}
            invalid={Boolean(errors.department)}
            onChange={(event) => setValue("department", event.target.value)}
          >
            <option value="" disabled>
              Select a department
            </option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="employee-salary"
            label="Salary"
            error={errors.salary}
            hint="Format: #,##0.00"
            required
          >
            <Input
              id="employee-salary"
              inputMode="decimal"
              placeholder="0.00"
              leading={CURRENCY_SYMBOL}
              value={values.salary}
              invalid={Boolean(errors.salary)}
              onChange={(event) => setValue("salary", event.target.value)}
              onBlur={handleSalaryBlur}
              className="text-right tabular-nums"
            />
          </Field>

          <Field
            id="employee-join-date"
            label="Join Date"
            error={errors.joinDate}
            required
          >
            <Input
              id="employee-join-date"
              type="date"
              value={values.joinDate}
              invalid={Boolean(errors.joinDate)}
              onChange={(event) => setValue("joinDate", event.target.value)}
            />
          </Field>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(event) => setValue("isActive", event.target.checked)}
            className="size-4 rounded border-slate-300 accent-primary"
          />
          <span className="text-sm">
            <span className="font-medium text-slate-900">Active</span>
            <span className="block text-neutral">
              Uncheck to mark the employee as inactive.
            </span>
          </span>
        </label>
      </form>
    </Modal>
  );
}
