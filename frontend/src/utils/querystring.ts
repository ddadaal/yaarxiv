export function queryToString(input: string | string[]): string {
  return Array.isArray(input) ? input[input.length-1] : input;
}

export function queryToIntOrDefault(input: string | string[], defaultValue = 0): number {
  const i = queryToString(input);
  const n = Number.parseInt(i);
  return (!Number.isNaN(n) && n > 0) ? n : defaultValue;
}
