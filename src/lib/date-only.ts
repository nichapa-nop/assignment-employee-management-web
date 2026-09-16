const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** True for a real calendar date in `YYYY-MM-DD` format (rejects 2024-02-30). */
export function isValidDateOnly(value: string): boolean {
  return parseDateOnly(value) !== undefined;
}

/**
 * Parses `YYYY-MM-DD` as a local date (so calendars never shift a day because
 * of the time zone). Returns undefined for empty or invalid values.
 */
export function parseDateOnly(value: string): Date | undefined {
  if (!DATE_ONLY_PATTERN.test(value)) {
    return undefined;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : undefined;
}

/** Formats a local date as `YYYY-MM-DD`; undefined becomes an empty string. */
export function toDateOnlyString(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
