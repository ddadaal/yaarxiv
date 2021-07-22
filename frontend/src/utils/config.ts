import getConfig from "next/config";

export interface AppConfig {
  clientApiRoot: string;
  serverApiRoot: string;
  staticFileRoot: string;
}

export const config: AppConfig = getConfig().publicRuntimeConfig;
