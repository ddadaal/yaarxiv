import { IdentifiedReference, Reference } from "@mikro-orm/core";

export type EntityOrRef<T> = T | IdentifiedReference<T>;

export function toRef<T>(t: EntityOrRef<T>): IdentifiedReference<T> {
  if (t instanceof Reference) {
    return t;
  } else {
    return Reference.create(t);
  }
}

export const dateColumnType = "DATETIME(6)";
