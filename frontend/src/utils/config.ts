import getConfig from "next/config";

export interface AppConfig {
  apiRoot: string;
  staticRoot: string;
  pdfSizeLimit: number;
}

export const config: AppConfig = getConfig().publicRuntimeConfig;
