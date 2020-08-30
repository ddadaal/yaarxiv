export interface Endpoint {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
}

export interface Schema<
  TPath = Record<string, string | number | undefined>,
  TQuerystring = Record<string, string | number | string[] | undefined>,
  TBody = Record<string | number, unknown>,
  TResponses = Record<string | number, unknown>,
> {
  path ?: TPath;
  querystring?: TQuerystring;
  body?: TBody;
  responses: Record<number, TResponses>;
}

export interface SchemaObject {
  description: string;
  properties: {
    path ?: any;
    querystring?: any;
    body?: any;
    responses:  { properties?: any };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValueOf<T> = T[keyof T];
type MapStatic<T> = T extends any ? T : never;
export type Responses<T> = MapStatic<ValueOf<T>>;

export function replacePathArgs(url: string, args: {}): string {
  return url
    .split("/")
    .reduce((prev, curr) => {
      prev.push(curr.startsWith(":") ? (args as any)[curr.slice(1)] : curr);
      return prev;
    }, [] as string[])
    .join("/");
}
