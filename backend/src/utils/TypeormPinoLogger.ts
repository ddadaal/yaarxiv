import { Logger, QueryRunner } from "typeorm";
import { FastifyLoggerInstance } from "fastify";

export class TypeormPinoLogger implements Logger {

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
