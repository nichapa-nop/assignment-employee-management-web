"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ApiError } from "@/lib/api-client";
import { employeesApi } from "../api/employees.api";
import type { Employee } from "../types";

interface DeleteEmployeeDialogProps {
  employee: Employee;
  onClose: () => void;
  onDeleted: (employee: Employee) => void;
}

export function DeleteEmployeeDialog({
  employee,
  onClose,
  onDeleted,
}: DeleteEmployeeDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await employeesApi.remove(employee.id);
      onDeleted(employee);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.messages.join(" ")
          : "Something went wrong. Please try again.",
      );
      setIsDeleting(false);
    }
  };

  const close = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Modal
      title="Delete employee"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">
        Are you sure you want to delete{" "}
        <span className="font-medium text-slate-900">{employee.name}</span> (ID{" "}
        {employee.id})? The employee will no longer appear in the list.
      </p>
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-error-light px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </Modal>
  );
}
