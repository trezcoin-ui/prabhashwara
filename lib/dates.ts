import { format, parseISO, subDays, addDays } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { PRACTICE_TIMEZONE } from "./constants";

/**
 * Get the current practice date in Europe/London timezone
 * @returns YYYY-MM-DD string
 */
export function getCurrentPracticeDate(): string {
  const now = new Date();
  const londonTime = toZonedTime(now, PRACTICE_TIMEZONE);
  return format(londonTime, "yyyy-MM-dd");
}

/**
 * Get yesterday's practice date in Europe/London timezone
 * @returns YYYY-MM-DD string
 */
export function getYesterdayPracticeDate(): string {
  const now = new Date();
  const londonTime = toZonedTime(now, PRACTICE_TIMEZONE);
  const yesterday = subDays(londonTime, 1);
  return format(yesterday, "yyyy-MM-dd");
}

/**
 * Check if a date string is today or yesterday (editable)
 */
export function isEditable(dateString: string): boolean {
  const today = getCurrentPracticeDate();
  const yesterday = getYesterdayPracticeDate();
  return dateString === today || dateString === yesterday;
}

/**
 * Format a date string for display
 */
export function formatPracticeDate(dateString: string): string {
  const date = parseISO(dateString);
  const today = getCurrentPracticeDate();
  const yesterday = getYesterdayPracticeDate();

  if (dateString === today) return "Today";
  if (dateString === yesterday) return "Yesterday";

  return format(date, "EEEE, MMM d, yyyy");
}

/**
 * Get the previous day's date string
 */
export function getPreviousDay(dateString: string): string {
  const date = parseISO(dateString);
  const previous = subDays(date, 1);
  return format(previous, "yyyy-MM-dd");
}

/**
 * Get the next day's date string
 */
export function getNextDay(dateString: string): string {
  const date = parseISO(dateString);
  const next = addDays(date, 1);
  return format(next, "yyyy-MM-dd");
}

/**
 * Check if a date is in the future (cannot navigate to future dates)
 */
export function isFutureDate(dateString: string): boolean {
  const today = getCurrentPracticeDate();
  return dateString > today;
}
