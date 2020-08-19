import { DateTime } from "luxon";

export function formatDateTime(str: string): string {
  return DateTime.fromISO(str).toFormat("yyyy-MM-dd HH:mm 'UTC'Z");
}
