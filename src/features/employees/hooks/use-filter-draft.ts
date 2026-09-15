"use client";

import { useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import type { EmployeeFilters } from "../types";

const TYPING_DELAY_MS = 350;

export type TextFilterKey = "search" | "salaryMin" | "salaryMax";
export type FilterDraft = Record<TextFilterKey, string>;

const EMPTY_DRAFT: FilterDraft = { search: "", salaryMin: "", salaryMax: "" };

/**
 * Keeps typed filter values responsive while the URL is updated after a short
 * pause. All typed fields are applied together, so switching fields within
 * the delay can't drop an edit that was still waiting to be applied.
 */
export function useFilterDraft(
  filters: EmployeeFilters,
  applyFilters: (changes: Partial<EmployeeFilters>) => void,
) {
  const [draft, setDraft] = useState<FilterDraft>({
    search: filters.search,
    salaryMin: filters.salaryMin,
    salaryMax: filters.salaryMax,
  });

  const applyDraft = useDebouncedCallback(applyFilters, TYPING_DELAY_MS);

  const setDraftValue = (key: TextFilterKey, value: string) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    applyDraft.schedule(next);
  };

  /** Clears typed values and drops any update still waiting to be applied. */
  const clearDraft = () => {
    applyDraft.cancel();
    setDraft(EMPTY_DRAFT);
  };

  return { draft, setDraftValue, clearDraft };
}
