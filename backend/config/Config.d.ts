/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    port: number
    loadSwagger: boolean
    logger: Logger
    jwtSecret: string
    typeorm: Typeorm
  }
  interface Typeorm {
    type: string
    database: string
    synchronize: boolean
    entities: string[]
    logging: boolean
    migrations: string[]
    cli: Cli
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