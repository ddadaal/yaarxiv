import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Api, Schema, Responses, SchemaObject } from "yaarxiv-api";

export function route<TSchema extends Schema>(
  fastify: FastifyInstance,
  api: Api,
  // schemaType: TSchema,
  schemaObject: SchemaObject,
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
      description: schemaObject.description,
      querystring: schemaObject.properties.querystring,
      body: schemaObject.properties.body,
      response: schemaObject.properties.responses.properties,
    },
    handler,
  });

}
