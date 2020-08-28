/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    port: number
    loadSwagger: boolean
    logger: Logger
    jwtSecret: string
    orm: Orm
  }
  interface Orm {
    dbName: string
    entities: string[]
    migrations: string[]
    cli: Cli
    type: string
    clientUrl: string
    debug: boolean
  }
  interface Cli {
    migrationsDir: string
  }
  interface Logger {
    level: string
    prettyPrint: boolean
  }
  export const config: Config
  export type Config = IConfig
}
