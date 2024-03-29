import { JwtTokenPayload, signUser } from "@/plugins/auth";
import { FastifyInstance } from "fastify";
import { replacePathArgs } from "yaarxiv-api/api/utils/replacePathArgs";
import { RequestArgs } from "yaarxiv-api/api/utils/request";
import { Awaited, GeneralSchema } from "yaarxiv-api/api/utils/schema";
import { Route } from "@/core/route";

export async function callRoute<TSchema extends GeneralSchema>(
  server: FastifyInstance,
  route: Route<TSchema>,
  args: RequestArgs<TSchema>,
  loginAs?: JwtTokenPayload,
  headers?: Record<string, string>,
): Promise<CallRouteResponse<TSchema>> {
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
  });
}

export type CallRouteResponse<TSchema extends GeneralSchema> =
  Omit<Awaited<ReturnType<FastifyInstance["inject"]>>, "json"> & {
    json<Code extends number>(): TSchema["responses"][Code];
  }
