import { DateTime } from "luxon";

export function formatDateTime(str: string, includeTimezone = false): string {
  return DateTime.fromISO(str)
    .toFormat(`yyyy-MM-dd HH:mm${includeTimezone ? " 'UTC'Z" : ""}`);
}
