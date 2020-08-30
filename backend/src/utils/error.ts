export function make500Error(code: number, error: string, message?: string) {
  return { code, error, message };
}

export function makeError(statusCode: number, message?: string) {
  return { statusCode, message };
}
