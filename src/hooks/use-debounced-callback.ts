"use client";

import { useEffect, useMemo, useRef } from "react";

interface DebouncedCallback<Args extends unknown[]> {
  /** Schedules the callback, restarting the delay on every call. */
  schedule: (...args: Args) => void;
  /** Drops a scheduled call that has not run yet. */
  cancel: () => void;
}

/** Calls the latest `callback` after `delay` ms without further `schedule` calls. */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): DebouncedCallback<Args> {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useMemo(
    () => ({
      schedule: (...args: Args) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
      },
      cancel: () => clearTimeout(timerRef.current),
    }),
    [delay],
  );
}
