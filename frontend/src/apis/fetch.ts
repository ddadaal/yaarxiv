const baseUrl = "http://127.0.0.1:3000";

export type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

let token = "";

export function fullFetch(
  path: string,
  query?: Record<string, string>,
  init?: RequestInit
): Promise<Response> {
  const headers = token
    ? { ...init?.headers, "authorization": `Bearer ${token}` }
    : init?.headers;

  let url = baseUrl + path;
  if (query) {
    url += "?";
    url += new URLSearchParams(query).toString();
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
  query?: Record<string, string>;
  body?: unknown;
  headers?: Headers;
}

export async function jsonFetch<T>(info: FetchInfo): Promise<T> {
  const resp = await fullFetch(info.path, info.query, {
    method: info.method ?? "GET",
    headers: info.headers,
    body: JSON.stringify(info.body),
  });

  return await resp.json();
}

export type JsonFetch = typeof jsonFetch;

export function changeToken(newToken: string): void {
  token = newToken;
}
