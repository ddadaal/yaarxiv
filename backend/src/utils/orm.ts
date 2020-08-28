import fp from "fastify-plugin";

import { EntityManager, MikroORM } from "mikro-orm";
import * as plugin from "fastify-request-context";

declare module "fastify" {
  interface FastifyRequest {
    orm: EntityManager;
  }

  interface FastifyInstance {
    orm: MikroORM;
  }
}

export const fastifyMikroPlugin = fp(async (fastify) => {
  const orm = await MikroORM.init();
  const generator = orm.getSchemaGenerator();
  await generator.ensureDatabase();

  fastify.decorate("orm", orm);

  fastify.register((plugin as any).fastifyRequestContextPlugin, {
    hook: "preValidation",
    defaultStoreValues: { em: orm.em.fork() },
  });

  fastify.decorateRequest("orm", function() {
    return this.requestContext.get("em");
  });
});
