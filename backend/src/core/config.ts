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
  } | {
    type: "minio",
    connection: {
      endPoint: string,
      port: number,
      useSSL: boolean,
      // username
      accessKey: string,
      // password
      secretKey: string,
    },
    bucketName: string,
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

// convert the first ${a} to process.env.a
// TODO support multiple ${a}

function replaceRec(obj: object) {
  if (!obj) { return; }
  for (const k in obj) {
    if (typeof obj[k] === "string") {
      obj[k] = obj[k].replace(/\$\{([a-zA-Z0-9_]+)\}/, (_, p1: string) => process.env[p1]);
    } else if (typeof obj[k] === "object") {
      replaceRec(obj[k]);
    }
  }
}

replaceRec(typedConfig);

export { typedConfig as config };

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type ConfigOverride = DeepPartial<Config>;
