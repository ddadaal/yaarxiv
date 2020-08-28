import fp from "fastify-plugin";

import { MikroORM, ReflectMetadataProvider } from "@mikro-orm/core";
import { EntityManager as SqliteEntityManager } from "@mikro-orm/sqlite";
import * as plugin from "fastify-request-context";
import { config } from "node-config-ts";

declare module "fastify" {
  interface FastifyRequest {
    getEm(): SqliteEntityManager;
  }

  interface FastifyInstance {
    orm: MikroORM;
  }
}


export const fastifyMikroPlugin = fp(async (fastify) => {

  // @ts-ignore
  const orm = await MikroORM.init({
    ...config.orm,
    metadataProvider: ReflectMetadataProvider,
    cache: { enabled: false },
    logger: (msg) => fastify.log.info(msg),
  });

  const generator = orm.getSchemaGenerator();
  await generator.ensureDatabase();

  fastify.decorate("orm", orm);

  fastify.addHook("onClose", (fastify, done) => {
    fastify.orm.close().then(() => done());
  });

  fastify.register((plugin as any).fastifyRequestContextPlugin, {
    hook: "onRequest",
    defaultStoreValues: { em: orm.em },
  });

  fastify.decorateRequest("getEm", function() {
    return this.requestContext.get("em");
  });

  fastify.addHook("onRequest", (req, rep, done) => {
    req.requestContext.set("em", orm.em.fork());
    done();
  });
});
