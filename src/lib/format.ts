const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const salaryFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats a number as `#,##0.00`, e.g. 65000 → "65,000.00". */
export function formatSalary(value: number): string {
  return salaryFormatter.format(value);
}

export const CURRENCY_SYMBOL = "฿";

/** Formats a salary with the Thai baht symbol, e.g. 65000 → "฿65,000.00". */
export function formatCurrency(value: number): string {
  return `${CURRENCY_SYMBOL}${formatSalary(value)}`;
}

function toDayMonthYear(day: number, monthIndex: number, year: number): string {
  return `${day}-${MONTHS[monthIndex]}-${String(year % 100).padStart(2, "0")}`;
}

/**
 * Formats a calendar date string (`YYYY-MM-DD`) as `d-MMM-yy`, e.g. "15-Jan-23".
 * The string is split rather than parsed with Date so it never shifts a day
 * because of the viewer's time zone.
 */
export function formatDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return toDayMonthYear(day, month - 1, year);
}

/** Formats an ISO timestamp as `d-MMM-yy` in the viewer's local time zone. */
export function formatTimestampDate(value: string): string {
  const date = new Date(value);
  return toDayMonthYear(date.getDate(), date.getMonth(), date.getFullYear());
}
