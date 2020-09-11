import getConfig from "next/config";

export interface AppConfig {
  apiRoot: string;
  staticRoot: string;
}

export const config = getConfig().publicRuntimeConfig as AppConfig;
