import { JwtTokenPayload, signUser } from "@/plugins/auth";
import { FastifyInstance } from "fastify";
import { replacePathArgs } from "yaarxiv-api/utils/replacePathArgs";
import { RequestArgs } from "yaarxiv-api/utils/request";
import { Awaited, GeneralSchema } from "yaarxiv-api/utils/schema";
import { Route } from "@/utils/route";

export async function callRoute<TSchema extends GeneralSchema>(
  server: FastifyInstance,
  route: Route<TSchema>,
  args: RequestArgs<TSchema>,
  loginAs?: JwtTokenPayload,
  headers?: Record<string, string>,
) {
  // @ts-ignore
  const { path, query, body } = args;

  return await server.inject({
    url: path ? replacePathArgs(route.api.endpoint.url, path) : route.api.endpoint.url,
    query,
    payload: body,
    method: route.api.endpoint.method,
    headers: {
      ...headers,
      ...loginAs ? {
        authorization: `bearer ${signUser(server, loginAs)}`,
      } : undefined,
    },
  }) as (Omit<Awaited<ReturnType<typeof server.inject>>, "json"> & {
    json<Code extends number>(): TSchema["responses"][Code];
  });
}
