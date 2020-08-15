import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ApiDefinition, Responses } from "yaarxiv-api";
import { Static, Type } from "@sinclair/typebox";

export function route<TApiDef extends ApiDefinition>(
  fastify: FastifyInstance,
  api: TApiDef,
  handler: (
    req: FastifyRequest<{
      Body: Static<TApiDef["body"]>;
      Querystring: Static<TApiDef["querystring"]>;
    }>,
    reply: FastifyReply
    // the Response type doesn't work to extract all possible responses
  ) => Promise<Responses<TApiDef>>) {

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
