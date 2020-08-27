export function range(start = 1, end = 0): number[] {
  const r = [] as number[];
  for (let i = start; i < end; i++) {
    r.push(i);
  }
  return r;
}
