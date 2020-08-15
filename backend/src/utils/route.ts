import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ApiDefinition, Static } from "yaarxiv-api";

export function route<TApiDef extends ApiDefinition>(
  fastify: FastifyInstance,
  api: TApiDef,
  handler: (
    req: FastifyRequest<{
      Body: Static<TApiDef["body"]>;
      Querystring: Static<TApiDef["querystring"]>;
    }>,
    reply: FastifyReply
    // Responses<TApiDef> might cause TS2589 which is very annoying
  ) => Promise<any>) {

  fastify.route<{
    Body: Static<TApiDef["body"]>;
    Querystring: Static<TApiDef["querystring"]>;
  }>({
    method: api.method,
    url: api.url,
    schema: {
      description: api.description,
      querystring: api.querystring,
      body: api.body,
      response: api.responses,
    },
    handler,
  });

}
