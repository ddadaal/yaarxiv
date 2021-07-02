import type { Options } from "@mikro-orm/core";
import type { MySqlDriver } from "@mikro-orm/mysql";
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
  orm: Options<MySqlDriver> & {
    runMigrations?: boolean;
    dropSchema?: boolean;
    highlight?: boolean;
    connectTimeout?: number;
    synchronize?: boolean;
  };
  upload: {
    path: string;
    maxFileSize: number;
  };
  staticPrefix: string;
  bcryptSaltLength: number;
  mail: false | (SMTPConnection.Options & {
    from: string;
    ignoreError: boolean;
  });
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

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type ConfigOverride = DeepPartial<Config>;
