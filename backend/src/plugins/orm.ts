import fp from "fastify-plugin";
import { entities } from "@/entities";
import { config } from "@/utils/config";
import mysql from "mysql2/promise";
import { EntityManager } from "@mikro-orm/mysql";
import { MikroORM } from "@mikro-orm/core";

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
  const { host, port, user, password, dbName, dropSchema } = config.orm;
  const connection = await mysql.createConnection({ host, port, user, password });
  await connection.query(`CREATE SCHEMA IF NOT EXISTS \`${dbName}\`;`);

  // create the database connection with typeorm
  const dbConnection = await MikroORM.init({
    ...config.orm,
    logger: (msg) => fastify.log.info(msg),
    entities,
  });

  const schemaGenerator= dbConnection.getSchemaGenerator();
  await schemaGenerator.createSchema();

  fastify.addHook("onRequest", async function (req) {
    req.em = dbConnection.em.fork() as EntityManager;
  });

  fastify.decorate("orm", dbConnection);

  fastify.addHook("onClose", async () => {
    // remove the schema before closing
    if (dropSchema) {
      fastify.log.info(`Drop schema ${dbName}`);
      await connection.query(`DROP SCHEMA \`${dbName}\`;`);
    }
    connection.destroy();
    fastify.log.info("Closing db connection.");
    await dbConnection.close();
  });

});
