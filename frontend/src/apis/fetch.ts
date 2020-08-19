import { Api, Schema } from "yaarxiv-api";
import {  incrementRequest, decrementRequest } from "src/components/TopProgressBar";
import { isServer } from "src/utils/isServer";

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

  if (!isServer()) {
    incrementRequest();
  }

  return fetch(url,
    {
      ...init,
      headers,
      mode: "cors",
    }).finally(() => {
    if (!isServer()) {
      decrementRequest();
    }
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

type IfNotObjectThenUndefined<T> = T extends Record<string, unknown> ? T : undefined;

type SelectNotUndefined<T extends {
  path: {} | undefined;
  query: {} | undefined;
  body: {} | undefined}> =
  ({ path: T["path"] } extends { path: undefined } ? {} : { path: T["path"]} ) &
  ({ query: T["query"] } extends { query: undefined } ? {} : { query: T["query"]}) &
  ({ body: T["body"] } extends { body: undefined } ? {} : { body: T["body"]});

export function fromApiDefinition<TSchema extends Schema>(api: Api) {
  type TPath = TSchema["path"];
  type TQuery = TSchema["querystring"];
  type TBody = TSchema["body"];

  return function (args: SelectNotUndefined<{
    path: IfNotObjectThenUndefined<TPath>,
    query: IfNotObjectThenUndefined<TQuery>,
    body: IfNotObjectThenUndefined<TBody>,
  }>): Promise<JsonFetchResult<SuccessResponse<TSchema>>>  {

    const anyArgs = args as any;
    // replace path params
    const replacedPath = anyArgs.path
      ? api.url
        .split("/")
        .reduce((prev, curr) => ([
          ...prev,
          curr.startsWith(":") ? anyArgs.path[curr.slice(1)] : curr]), [])
        .join("/")
      : api.url;

    return jsonFetch({
      path: replacedPath,
      method: api.method,
      query: anyArgs.query,
      body: anyArgs.body,
    });
  };
}
