import fp from "fastify-plugin";
import typeormPlugin from "fastify-typeorm-plugin";
import { createConnection } from "typeorm";
import { entities } from "@/entities";
import { Logger, QueryRunner } from "typeorm";
import { FastifyLoggerInstance } from "fastify";
import { config } from "@/utils/config";

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

export const ormPlugin = fp(async (fastify) => {
  const dbConnection = await createConnection({
    ...config.typeorm,
    logger: new TypeormPinoLogger(fastify.log),
    entities,
  });

  fastify.register(typeormPlugin, { connection: dbConnection });
});
