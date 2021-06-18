import fp from "fastify-plugin";
import { entities } from "@/entities";
import { config } from "@/utils/config";
import { EntityManager } from "@mikro-orm/mysql";
import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import waitOn from "wait-on";

declare module "fastify" {

  interface FastifyInstance {
    orm: MikroORM;
  }

  interface FastifyRequest {
    em: EntityManager;
 }
}

export const ormPlugin = fp(async (fastify) => {
  // create the database if not exists.
  const { dbName, dropSchema, highlight, connectTimeout, host, port, runMigrations } = config.orm;

  fastify.log.info("Wait for db connection.");

  // wait for db to be alive
  await waitOn({
    resources: [`tcp:${host}:${port}`],
    timeout: connectTimeout,
  });

  fastify.log.info("db is started. Connecting to it.");

  const dbConnection = await MikroORM.init({
    ...config.orm,
    highlighter: highlight ? new SqlHighlighter() : undefined,
    logger: (msg) => fastify.log.info(msg),
    entities,
    driverOptions: {
      connectTimeout,
    },
  });

  if (!dbName) {
    throw new Error("dbName is not specified!");
  }

  const schemaGenerator = dbConnection.getSchemaGenerator();
  await schemaGenerator.ensureDatabase();

  if (runMigrations) {
    await dbConnection.getMigrator().up();
  }

  fastify.addHook("onRequest", async function (req) {
    req.em = dbConnection.em.fork() as EntityManager;
  });

  fastify.decorate("orm", dbConnection);

  fastify.addHook("onClose", async () => {
    // drop schema before closing
    if (dropSchema) {
      fastify.log.info(`Drop schema ${dbName}`);
      // the following does not work.
      // const schemaGenerator = dbConnection.getSchemaGenerator();
      // await schemaGenerator.dropDatabase(dbName);

      // Use raw sql instead
      await dbConnection.em.getDriver().execute(`drop schema ${dbName};`);
    }
    fastify.log.info("Closing db connection.");
    await dbConnection.close();
  });

});
