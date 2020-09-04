import config from "config";
import { ConnectionOptions } from "typeorm";
import { FastifyServerOptions } from "fastify";

export interface Config {
  port: number;
  loadSwagger: boolean;
  logger: FastifyServerOptions["logger"];
  jwtSecret: string;
  typeorm: ConnectionOptions;
  upload: {
    path: string;
    maxFileSize: number;
  };
  staticPrefix: string;
  bcryptSaltLength: number;
}

const typedConfig: Config = config as any;

export { typedConfig as config };
