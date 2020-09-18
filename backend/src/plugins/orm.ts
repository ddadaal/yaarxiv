import fp from "fastify-plugin";
import { Connection, createConnection } from "typeorm";
import { entities } from "@/entities";
import { Logger, QueryRunner } from "typeorm";
import { FastifyLoggerInstance } from "fastify";
import { config } from "@/utils/config";
import mysql from "mysql2/promise";

class TypeormPinoLogger implements Logger {

  constructor(private logger: FastifyLoggerInstance) { }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
    this.logger.debug(sql);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
    this.logger.error(sql);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
    this.logger.info(sql);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }

  log(level: "log"|"info"|"warn", message: any, queryRunner?: QueryRunner) {
    switch (level) {
    case "log":
    case "info":
      this.logger.info(message);
      break;
    case "warn":
      this.logger.warn(message);
      break;
    }
  }

  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) { // most probably circular objects in parameters
      return parameters;
    }
  }

}

declare module "fastify" {
  // @ts-ignore
  interface FastifyInstance {
    orm: Connection;
 }
}

export const ormPlugin = fp(async (fastify) => {
  // create the database if not exists.
  const { host, port, username, password, database, dropSchema, connectTimeout } = config.typeorm;
  const connection = await mysql.createConnection({
    host,
    port,
    user: username,
    password,
    connectTimeout,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // create the database connection with typeorm
  const dbConnection = await createConnection({
    ...config.typeorm,
    logger: new TypeormPinoLogger(fastify.log),
    entities,
  });

  fastify.decorate("orm", dbConnection);

  fastify.addHook("onClose", async (instance) => {
    // remove the schema before closing
    if (dropSchema) {
      instance.log.info(`DROP SCHEMA \`${database}\`;`);
      await connection.query(`DROP SCHEMA \`${database}\`;`);
    }
    instance.log.info("Closing db connection...");
    connection.destroy();
    await instance.orm.close();
  });


});
