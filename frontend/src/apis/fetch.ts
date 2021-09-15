import { replacePathArgs } from "yaarxiv-api/api/utils/replacePathArgs";
import { Endpoint, GeneralSchema, SuccessResponse } from "yaarxiv-api/api/utils/schema";
import {
  parseQueryToQuerystring,
  Querystring, RequestArgs,
} from "yaarxiv-api/api/utils/request";
import { isFormData, isServer } from "src/utils/isServer";
import { removeNullOrUndefinedKey } from "src/utils/array";
import { failEvent, finallyEvent, prefetchEvent, successEvent } from "./events";
import { config } from "src/utils/config";

const apiBaseUrl = isServer()
  ? config.serverApiRoot
  : config.clientApiRoot;

export type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

let token = "";

export function changeToken(newToken: string): void {
  token = newToken;
}

export function getFullUrl(basePath: string, pathArgs: any, query: any) {
  const replacedPath = pathArgs ? replacePathArgs(basePath, pathArgs) : basePath;
  let url = apiBaseUrl + replacedPath;
  if (query) {
    url += parseQueryToQuerystring(query);
  }
  return url;
}


export function fullFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = token
    ? { ...init?.headers, "authorization": `Bearer ${token}` }
    : init?.headers ?? {};


  return fetch(url,
    {
      ...init,
      headers,
      mode: "cors",
      // disable cache for IE11
      cache: "no-cache",
    });
}

export type FullFetch = typeof fullFetch;

export interface FetchInfo {
  path: string;
  pathArgs?: unknown;
  method?: HttpMethod;
  query?: Querystring;
  body?: unknown;
  headers?: Record<string, string>;
}

export type JsonFetchResult<TResp> = TResp;

const SERVER_ERROR_STATUS = -2;
const CLIENT_ERROR_STATUS = -1;

export class HttpError<T = any> {
  data: T;
  status: number;
  text?: string;

  get isServerError() { return this.status === SERVER_ERROR_STATUS; }
  get isClientError() { return this.status === CLIENT_ERROR_STATUS; }
}

export function makeHttpError<T>(status: number, data: T, text?: string) {
  const error = new HttpError<T>();
  error.data = data;
  error.status = status;
  error.text = text;
  return error;
}

function tryParseJson(text: string): object | undefined {
  try {
    return JSON.parse(text);
  } catch (e) {
    return undefined;
  }
}

function checkIsJson(resp: Response) {
  const type = resp.headers.get("content-type");
  return type && type.includes("application/json");
}

/**
 * Fetch and returns as json.
 * @param info the fetch info
 * @throws {Response} If the request is successful but response is not json,
 * the response will be thrown
 * @throws {JsonFetchError} If the statusCode is not [200, 300), a error will be thrown
 */
export async function jsonFetch<T>(
  info: FetchInfo,
  signal?: AbortSignal,
): Promise<JsonFetchResult<T>> {

  const isForm = isFormData(info.body);

  prefetchEvent.execute(undefined);

  const fullUrl = getFullUrl(info.path, info.pathArgs, info.query);

  try {
    const resp = await fullFetch(fullUrl, {
      method: info.method ?? "GET",
      headers: {
        ...isForm ? undefined : { "content-type": "application/json" },
        ...info.headers,
      },
      body: isForm ? (info.body as any) : JSON.stringify(info.body),
      signal,
    });

    if (resp.ok) {
      if (resp.status === 204) {
        successEvent.execute({ status: 204, data: undefined });
        return undefined as any;
      }
      if (checkIsJson(resp)) {
        const obj = await resp.json();
        successEvent.execute({ status: resp.status, data: obj });
        return obj;
      } else {
        successEvent.execute({ status: resp.status, data: resp });
        throw resp;
      }
    } else {
      const text = await resp.text();
      const payload = makeHttpError(resp.status, tryParseJson(text), text);
      failEvent.execute(payload);
      throw payload;
    }
  } catch (r) {
    // existence of r.type indicates it's a server error (node-fetch)
    if (r.name === "FetchError") {
      const payload = makeHttpError(SERVER_ERROR_STATUS, JSON.parse(JSON.stringify(r)));
      failEvent.execute(payload);
      throw payload;
    }

    // TypeError is client side fetch error
    if (r instanceof TypeError) {
      const payload = makeHttpError(CLIENT_ERROR_STATUS, r);
      failEvent.execute(payload);
      throw payload;
    }
    throw r;
  } finally {
    finallyEvent.execute(undefined);
  }

}

export type JsonFetch = typeof jsonFetch;



export function fromApi<TSchema extends GeneralSchema>(endpoint: Endpoint<TSchema>) {
  return function (
    args: RequestArgs<TSchema>,
    signal?: AbortSignal,
  ): Promise<JsonFetchResult<SuccessResponse<TSchema>>>  {

    const anyArgs = args as any;

    return jsonFetch({
      path: endpoint.url,
      pathArgs: anyArgs.path,
      method: endpoint.method,
      query: removeNullOrUndefinedKey(anyArgs.query),
      body: anyArgs.body,
    }, signal);
  };
}
