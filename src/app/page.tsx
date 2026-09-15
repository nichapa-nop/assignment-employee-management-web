import { Suspense } from "react";
import { EmployeesPage } from "@/features/employees/components/employees-page";
import { TableSkeleton } from "@/features/employees/components/table-states";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-8 sm:px-8">
      {/* EmployeesPage reads the URL query, so it renders on the client inside Suspense. */}
      <Suspense fallback={<TableSkeleton />}>
        <EmployeesPage />
      </Suspense>
    </main>
  );
}
