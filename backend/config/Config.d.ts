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
    synchronize: boolean
    entitiesDirs: string[]
    migrations: string[]
    cli: Cli
    type: string
    clientUrl: string
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
