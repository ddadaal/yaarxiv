export function range(start = 1, end = 0): number[] {
  const r = [] as number[];
  for (let i =start;i<end;i++) {
    r.push(i);
  }
  return r;
}

export function flatten<T>(nestedArray: T[][]) {
  return nestedArray.reduce((prev, curr) => [...prev, ...curr], []);
}

export function arrayContainsElement<T>(array: T[] | null | undefined): array is T[] {
  return !!array && array.length > 0;
}

export function removeFalsy<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((x) => !!x) as T[];
}

export function removeNullOrUndefinedKey<T extends object>(object: T): T {
  for (const key in object) {
    if (object[key] === undefined || object[key] === null) {
      delete object[key];
    }
  }
  return object;
}
