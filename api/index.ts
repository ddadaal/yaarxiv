export interface Api {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
}

export interface Schema<
  TPath = Record<string, string | number>,
  TQuerystring = Record<string, string | number | string[]>,
  TBody = Record<string | number, unknown>,
  TResponses = Record<string | number, unknown>,
> {
  path ?: TPath;
  querystring?: TQuerystring;
  body?: TBody;
  responses: Record<number, TResponses>;
}

export interface SchemaObject {
  Schema: {
    description: string;
    properties: {
      path ?: any;
      querystring?: any;
      body?: any;
      responses:  { properties?: any };
    }
  };
  [otherKey: string]: object;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValueOf<T> = T[keyof T];
type MapStatic<T> = T extends any ? T : never;
export type Responses<T> = MapStatic<ValueOf<T>>;
