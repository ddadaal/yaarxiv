export function replacePathArgs(url: string, args: {}): string {
  return url
    .split("/")
    .reduce((prev, curr) => {
      prev.push(curr.startsWith(":") ? (args as any)[curr.slice(1)] : curr);
      return prev;
    }, [] as string[])
    .join("/");
}
