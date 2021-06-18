import { GeneralSchema } from "./schema";

export type SelectNotUndefined<T extends {
  path: {} | undefined;
  query: {} | undefined;
  body: {} | undefined;
}> =
  ({ path: T["path"] } extends { path: object } ?  { path: T["path"]} : {}) &
  ({ query: T["query"] } extends { query: object } ? { query: T["query"]} : {}) &
  ({ body: T["body"] } extends { body: object } ? { body: T["body"]} : {});

export type RequestArgs<TSchema extends GeneralSchema> = SelectNotUndefined<{
  path: TSchema["path"];
  query: TSchema["querystring"];
  body: TSchema["body"];
}>;

export type Querystring = Record<string, string | string[] | number | undefined>;

export function parseQueryToQuerystring(query: Querystring) {
  let url = "?";
  for (const k in query) {
    const val = query[k];
    if (typeof val !== "undefined") {
      const key = encodeURIComponent(k) + "=";
      if (Array.isArray(val)) {
        for (const v of val){
          url += key + encodeURIComponent(v);
          url += "&";
        }
      } else {
        url += key + encodeURIComponent(val);
        url += "&";
      }
    }
  }
  if (url.endsWith("&")) {
    url = url.substr(0, url.length -1);
  }
  return url;
}
