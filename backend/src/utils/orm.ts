import { config } from "@/core/config";
import { IdentifiedReference, Reference } from "@mikro-orm/core";

export type EntityOrRef<T> = T | IdentifiedReference<T>;

export function toRef<T>(t: EntityOrRef<T>): IdentifiedReference<T> {
  if (t instanceof Reference) {
    return t;
  } else {
    return Reference.create(t);
  }
}

/**
 * This type saves datetime value in mysql with ms precision
 * aligning the value in DB with the value in JS.
 */
export const DATETIME_TYPE = "DATETIME(6)";

export const paginationProps = (page?: number) => ({
  offset: ((page ?? 1) - 1) * config.defaultPageSize,
  limit: config.defaultPageSize,
});
