import fp from "fastify-plugin";
import { entities } from "@/entities";
import { config } from "@/core/config";
import { EntityManager, MySqlDriver } from "@mikro-orm/mysql";
import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import waitOn from "wait-on";

import { basename } from "path";

// https://mikro-orm.io/docs/migrations/#importing-migrations-statically
const migrations = {};

function importAll(r: __WebpackModuleApi.RequireContext) {
  r.keys().forEach(
    (key) => (migrations[basename(key)] = Object.values(r(key))[0]),
  );
}

importAll(require.context("../../migrations", false, /\.ts$/));

const migrationsList = Object.keys(migrations).map((migrationName) => ({
  name: migrationName,
  class: migrations[migrationName],
}));


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
  const { dbName, dropSchema,
    highlight, connectionTimeout,
    host, port, runMigrations, synchronize,
    user, password, debug,
  } = config.orm;

  fastify.log.info("Wait for db connection.");

  // wait for db to be alive
  await waitOn({
    resources: [`tcp:${host}:${port}`],
    timeout: connectionTimeout,
  });

  fastify.log.info("db is started. Connecting to it.");

  const dbConnection = await MikroORM.init<MySqlDriver>({
    host,
    port,
    user,
    password,
    debug,
    dbName,
    type: "mysql",
    highlighter: highlight ? new SqlHighlighter() : undefined,
    logger: (msg) => fastify.log.info(msg),
    entities,
    forceUndefined: true,
    driverOptions: {
      connectTimeout: connectionTimeout,
    },
    migrations: {
      migrationsList,
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

  if (synchronize) {
    await schemaGenerator.updateSchema();
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
