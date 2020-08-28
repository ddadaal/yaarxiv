import fp from "fastify-plugin";

import { EntityManager, MikroORM } from "mikro-orm";
import { fastifyRequestContextPlugin } from "fastify-request-context";


declare module "fastify" {
  interface FastifyRequest {
    orm: EntityManager;
  }

  interface FastifyInstance {
    orm: EntityManager;
  }
}

export const fastifyMikroPlugin = fp(async (fastify) => {
  const orm = await MikroORM.init();

  fastify.decorate("orm", orm.em.fork() );

  fastify.register(fastifyRequestContextPlugin, {
    hook: "preValidation",
    defaultStoreValues: { em: orm.em.fork() },
  });

  fastify.decorateRequest("orm", function() {
    return this.requestContext.get("em");
  });
});
