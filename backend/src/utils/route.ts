import { FastifyInstance, FastifyRequest, FastifyReply, FastifySchema } from "fastify";
import { Endpoint, Schema, SchemaObject } from "yaarxiv-api";
import { AuthOption } from "./auth";
import { routes } from "./schemas";

interface RouteExtraInfo extends FastifySchema {
  authOption?: AuthOption;
}

type Res<T> = Partial<T>;

export const route = <TSchema extends Schema>(
  fastify: FastifyInstance,
  endpoint: Endpoint,
  schemaName: keyof typeof routes,
  { authOption = undefined, ...rest }: RouteExtraInfo,
) => (handler: (
    req: FastifyRequest<{
      Body: TSchema["body"];
      Querystring: TSchema["querystring"];
      Params: TSchema["path"];
    }>,
    reply: FastifyReply
  ) => Promise<Res<TSchema["responses"]>>) => {

    const schema = routes[schemaName] as SchemaObject;

    fastify.route<{
      Body: TSchema["body"],
      Querystring: TSchema["querystring"],
      Params: TSchema["path"];
    }>({
      method: endpoint.method,
      url: endpoint.url,
      schema: {
        description: schema.description,
        querystring: schema.properties.querystring,
        params: schema.properties.path,
        body: schema.properties.body,
        response: schema.properties.responses.properties,
        consumes: ["application/json"],
        ...rest,
      },
      preValidation: authOption ? [fastify.jwtAuth(authOption)] : undefined,
      handler: async (req, rep) => {
        const resp = await handler(req, rep);
        const code = Object.keys(resp)[0];
        rep.code(Number(code));
        return resp[code];
      },
    });

  };
