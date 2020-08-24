type QueryValue = string | string[] | undefined;

export function queryToString(input: QueryValue): string {
  return Array.isArray(input) ? input[input.length-1] : (input ?? "");
}

export function queryToIntOrDefault(input: QueryValue, defaultValue = 0): number {
  const i = queryToString(input);
  const n = Number.parseInt(i);
  return (!Number.isNaN(n) && n > 0) ? n : defaultValue;
}

export function queryToArray(input: QueryValue): string[] {
  return Array.isArray(input) ? input : typeof input === "undefined" ? [] : [input];
}
