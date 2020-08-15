import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ApiDefinition } from "yaarxiv-api/src";
import { Static } from "@sinclair/typebox";

type ValueOf<T> = T[keyof T];
type MapStatic<T> = T extends any ? Static<T> : never;
type Responses<T> = MapStatic<ValueOf<T>>;

export function route<
  TApiDef extends ApiDefinition
>(
  fastify: FastifyInstance,
  api: TApiDef,
  handler: (
    req: FastifyRequest<{
      Body: Static<TApiDef["schema"]["body"]>;
      Querystring: Static<TApiDef["schema"]["querystring"]>;
    }>,
    reply: FastifyReply
  ) => Promise<Responses<TApiDef["schema"]["responses"]>>) {

  fastify.route<{
    Body: Static<TApiDef["schema"]["body"]>;
    Querystring: Static<TApiDef["schema"]["querystring"]>;
  }>({
    method: api.method,
    url: api.url,
    schema: {
      description: api.description,
      querystring: api.schema.querystring,
      body: api.schema.body,
      response: api.schema.responses,
    },
    handler,
  });

}
