import { FastifyInstance, FastifyRequest, FastifyReply, preValidationHookHandler } from "fastify";
import { ApiProps } from "yaarxiv-api/api/utils/apiProps";
import { Endpoint, GeneralSchema, SchemaObject } from "yaarxiv-api/api/utils/schema";
import { routes } from "./schemas";

export interface Route<TSchema extends GeneralSchema> {
  api: {
    endpoint: Endpoint<TSchema>;
    props?: ApiProps;
  };
  schemaName: keyof typeof routes | undefined;
  handler: (
    req: FastifyRequest<{
      Body: TSchema["body"];
      Querystring: TSchema["querystring"];
      Params: TSchema["path"];
    }>,
    fastify: FastifyInstance,
    reply: FastifyReply
  ) => Promise<Partial<TSchema["responses"]>>;
}

function preValidations(f: FastifyInstance, props?: ApiProps): preValidationHookHandler[] | undefined {
  if (!props) { return undefined;}

  const validators: preValidationHookHandler[] = [];

  if (props.requiredRoles) {
    validators.push(f.jwtAuth(props.requiredRoles));
  }


  return validators.length === 0 ? undefined : validators;
}

export const route = <TSchema extends GeneralSchema>(
  api: Route<TSchema>["api"],
  schemaName: Route<TSchema>["schemaName"],
  handler: Route<TSchema>["handler"],
) => ({ api, schemaName, handler });

export const registerRoute = (
  fastify: FastifyInstance,
  route: Route<any>,
) => {
  const schema = route.schemaName ? routes[route.schemaName] as SchemaObject : undefined;

  fastify.register((f, _, done) => {
    f.route({
      method: route.api.endpoint.method,
      url: route.api.endpoint.url,
      schema: schema ? {
        description: schema.description,
        querystring: schema.properties.querystring,
        params: schema.properties.path,
        body: schema.properties.body,
        response: schema.properties.responses.properties,
        consumes: route.api.props?.consumes,
        summary: route.api.props?.summary,
      } : undefined,
      preValidation: preValidations(f, route.api.props),
      handler: async (req: any, reply) => {
        const resp = await route.handler(req, f, reply);
        const code = Object.keys(resp)[0];
        reply.code(Number(code));

        const respBody = resp[code];

        reply.send(respBody);

        await reply;
      },
    });
    f.log.trace(`Registering route for ${route.api.endpoint.method} ${route.api.endpoint.url}`);
    done();
  });
};

