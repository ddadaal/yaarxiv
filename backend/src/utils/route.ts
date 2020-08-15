import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ApiDefinition } from "yaarxiv-api";
import { Static, Type } from "@sinclair/typebox";

// type ValueOf<T> = T[keyof T];
// // eslint-disable-next-line @typescript-eslint/ban-types
// type MapStatic<T> = T extends any ? Static<T> : never;
// type Responses<T> = MapStatic<ValueOf<T>>;

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
  ) => Promise<unknown>) {

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
