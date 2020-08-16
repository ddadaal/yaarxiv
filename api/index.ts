export interface Api {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
}

export interface Schema<
  TQuerystring = Record<string, string>,
  TBody = Record<string | number, unknown>,
  TResponses = Record<string | number, unknown>,
> {
  querystring?: TQuerystring;
  body?: TBody;
  responses: Record<number, TResponses>;
}

export interface SchemaObject {
  description: string;
  properties: {
    querystring?: any;
    body?: any;
    responses:  { properties?: any };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValueOf<T> = T[keyof T];
type MapStatic<T> = T extends any ? T : never;
export type Responses<T> = MapStatic<ValueOf<T>>;
