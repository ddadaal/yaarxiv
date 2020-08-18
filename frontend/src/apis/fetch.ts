import { Api, Schema } from "yaarxiv-api";

const baseUrl = "http://127.0.0.1:3000";

export type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

let token = "";

export type Querystring =Record<string, string | string[] | number>;

export function fullFetch(
  path: string,
  query?: Querystring,
  init?: RequestInit
): Promise<Response> {
  const headers = token
    ? { ...init?.headers, "authorization": `Bearer ${token}` }
    : init?.headers;

  let url = baseUrl + path;
  if (query) {
    url += "?";
    // TODO use a better URLSearchParam strategy
    url += new URLSearchParams(query as any).toString();
  }

  return fetch(url,
    {
      ...init,
      headers,
      mode: "cors",
    });
}

export type FullFetch = typeof fullFetch;

export interface FetchInfo {
  path: string;
  method?: HttpMethod;
  query?: Querystring;
  body?: unknown;
  headers?: Headers;
}

export type JsonFetchResult<TResp> = TResp;

export type HttpError<T = object> = {
  data: T;
  status: number;
}

export function makeHttpError<T>(data: T, status: number) {
  return { data, status };
}

/**
 * Fetch and returns as json.
 * @param info the fetch info
 * @throws {JsonFetchError} If the statusCode is not [200, 300), a error will be thrown
 */
export async function jsonFetch<T>(info: FetchInfo): Promise<JsonFetchResult<T>> {
  const resp = await fullFetch(info.path, info.query, {
    method: info.method ?? "GET",
    headers: info.headers,
    body: JSON.stringify(info.body),
  });

  const obj = await resp.json();

  if (resp.status >= 200 && resp.status < 300) {
    return obj;
  } else {
    throw { data: obj, status: resp.status };
  }

}

export type JsonFetch = typeof jsonFetch;

export function changeToken(newToken: string): void {
  token = newToken;
}

type Responses<T extends Schema> = T["responses"];

type SuccessResponse<T extends Schema> =
  Responses<T>[200] extends object
  ? Responses<T>[200]
  : Responses<T>[201] extends object ? Responses<T>[201] : never;

type IfNeverThenUndefined<T> = [T] extends [never] ? undefined : T;

export function fromApiDefinition<TSchema extends Schema>(api: Api) {
  type TQuery = TSchema["querystring"];
  type TBody = TSchema["body"];

  return function (
    query: IfNeverThenUndefined<TQuery>,
    body: IfNeverThenUndefined<TBody>,
  ): Promise<JsonFetchResult<SuccessResponse<TSchema>>>  {
    return jsonFetch({
      path: api.url,
      method: api.method,
      query,
      body,
    });
  };
}
