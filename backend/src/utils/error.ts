export function makeError(code: number, error: string, message?: string) {
  return { code, error, message };
}
