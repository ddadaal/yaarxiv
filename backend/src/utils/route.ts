import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Endpoint, Schema, Responses, SchemaObject } from "yaarxiv-api";
import { routes } from "./schemas";

interface RouteExtraInfo {
  jwtAuth?: boolean;
  summary?: string;
}

export const route = <TSchema extends Schema>(
  fastify: FastifyInstance,
  endpoint: Endpoint,
  schemaName: keyof typeof routes,
  { jwtAuth = false, summary = undefined }: RouteExtraInfo,
) => (handler: (
    req: FastifyRequest<{
      Body: TSchema["body"]
      Querystring: TSchema["querystring"];
    }>,
    reply: FastifyReply
  ) => Promise<Responses<TSchema["responses"]>>) => {

    const schema = routes[schemaName] as SchemaObject;

    fastify.route<{
    Body: TSchema["body"],
    Querystring: TSchema["querystring"],
  }>({
    method: endpoint.method,
    url: endpoint.url,
    schema: {
      summary,
      description: schema.description,
      querystring: schema.properties.querystring,
      body: schema.properties.body,
      response: schema.properties.responses.properties,
    },
    preValidation: jwtAuth ? [fastify.jwtAuth] : undefined,
    handler,
  });

  };
