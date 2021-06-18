import { Options } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import config from "config";
import { FastifyServerOptions } from "fastify";
import SMTPConnection from "nodemailer/lib/smtp-connection";

export interface Config {
  port: number;
  loadSwagger: boolean;
  logger: FastifyServerOptions["logger"];
  jwtSecret: string;
  orm: Options<MySqlDriver> & {
    runMigrations?: boolean;
    dropSchema?: boolean;
    highlight?: boolean;
    connectTimeout?: number;
  };
  upload: {
    path: string;
    maxFileSize: number;
  };
  staticPrefix: string;
  bcryptSaltLength: number;
  mail: SMTPConnection.Options;
  resetPassword: {
    /**
     * The url template to reset password page.
     * Use {} as the placeholder for token.
     *
     * @example http://localhost:5000/forget/reset?token={}
     */
    resetPageUrlTemplate: string;

    /** How long a token is valid. Unit: seconds */
    tokenValidTimeSeconds: number;
  }
}

const typedConfig: Config = config as any;

export { typedConfig as config };
