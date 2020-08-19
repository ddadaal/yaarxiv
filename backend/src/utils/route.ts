import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Api, Schema, Responses, SchemaObject } from "yaarxiv-api";

interface RouteSpec {
  api: Api;
  schema: SchemaObject;
  summary?: string;
}


export function route<TSchema extends Schema>(
  fastify: FastifyInstance,
  { api, schema, summary }: RouteSpec,
  handler: (
    req: FastifyRequest<{
      Body: TSchema["body"]
      Querystring: TSchema["querystring"];
    }>,
    reply: FastifyReply
  ) => Promise<Responses<TSchema["responses"]>>) {

  fastify.route<{
    Body: TSchema["body"],
    Querystring: TSchema["querystring"],
  }>({
    method: api.method,
    url: api.url,
    schema: {
      summary: summary,
      description: schema.Schema.description,
      // querystring: schema.Schema.properties.querystring,
      // body: schema.Schema.properties.body,
      // response: schema.Schema.properties.responses.properties,
    },
    handler,
  });

}
