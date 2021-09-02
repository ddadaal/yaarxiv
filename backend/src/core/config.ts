import config from "config";
import type { FastifyServerOptions } from "fastify";
import type SMTPConnection from "nodemailer/lib/smtp-connection";

export interface Config {
  address: string;
  port: number;
  loadSwagger: boolean;
  logger: FastifyServerOptions["logger"];
  jwtSecret: string;
  pluginTimeout: number;
  defaultPageSize: number;
  orm: {
    host: string;
    port: number;
    user: string;
    password: string;
    debug?: boolean;
    dbName: string;
    runMigrations?: boolean;
    dropSchema?: boolean;
    highlight?: boolean;
    connectionTimeout?: number;
    synchronize?: boolean;
  };
  storage: {
    type: "fs",
    path: string;
  };
  staticPrefix: string;
  bcryptSaltLength: number;
  mail: false | (SMTPConnection.Options & {
    from: string;
    ignoreError: boolean;
  });
  frontendUrl: string;
  resetPassword: {
    /**
     * The url template to reset password page.
     * Use {} as the placeholder for token.
     *
     * @example /forget/reset?token={}
     */
    resetPagePathnameTemplate: string;

    /** How long a token is valid. Unit: seconds */
    tokenValidTimeSeconds: number;
  }
  emailValidation: {
    pathnameTemplate: string;
    timeoutSeconds: number;
    sendIntervalSeconds: number;
  };
}

const typedConfig: Config = config as any;

export { typedConfig as config };

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type ConfigOverride = DeepPartial<Config>;
