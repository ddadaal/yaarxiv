import { Endpoint, Schema, replacePathArgs  } from "yaarxiv-api";

export function replacePathInEndpoint<T extends Schema>(
  endpoint: Endpoint,
  args: T["path"],
): Endpoint {
  return {
    method: endpoint.method,
    url: replacePathArgs(endpoint.url, args as {}),
  };
}
